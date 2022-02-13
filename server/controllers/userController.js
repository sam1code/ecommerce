const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleWare/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      publicId: "temporary",
      url: "temp",
    },
  });

  sendToken(user, 200, res);
});

//login users
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if user has given password
  if (!email || !password) {
    return next(new ErrorHandler("Enter email and password", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 201, res);
});

// logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
});

// forget password

exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorHandler("No email recieved", 401));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // get reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = ` your password request token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this then, please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password Link is invalid or expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Confirm Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }
  sendToken(user, 201, res);
};

// Get user Detail
exports.getUserDetail = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.user)
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//update User Password
exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(
      new ErrorHandler(
        "Please provide all fields : oldPassword,newPassword,confirmPassword",
        400
      )
    );
  }
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("new password and Confirm password must be same", 400)
    );
  }

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect old password", 400));
  }

  user.password = newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update user data
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //will update cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).send({ message: true, users });
});

// get single user --ADMIN

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user not found", 400));
  }
  res.status(200).send({
    success: true,
    user,
  });
});

// update user Role --ADMIN
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.role) {
    return next(
      new ErrorHandler("please provide which role you want to assign", 406)
    );
  }
  const newUserData = {
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if(!user){
    return next(
      new ErrorHandler("no user exists with this id", 404)
    );
  }
  res.status(200).json({
    success: true,
  });
});

// Delete User --ADMIN

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  // we will remove cloudnari
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user does not exist", 401));
  }
  await user.remove();
  res.status(200).json({
    success: true,
    message: "user deleted succsessfully"
  });
});
