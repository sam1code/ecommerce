const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const catchAsyncError = require("../middleWare/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Create new Order

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).send({
    success: true,
    order,
  });
});

// get single order-- logged in user
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order.user.email !== req.user.email && req.user.role != "admin") {
    return next(
      new ErrorHandler("you are not allowed to view this order details")
    );
  }
  if (!order) {
    return next(new ErrorHandler("Product not found with this email id.", 404));
  }

  res.status(200).send({
    success: true,
    order,
  });
});

// get logged in user order
exports.getMyOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });

  res.status(200).send({
    success: true,
    order,
  });
});

// get all orders -- ADMIN
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).send({
    success: true,
    orders,
    totalAmount,
  });
});

// Update Order Status -- ADMIN
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found wit this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity);
  });

  order.orderStatus = req.body.status;
  if (order.orderStatus === "Delivered") order.deliveredAt = Date.now();

  await order.save({ validateBeforeSave: false });

  res.status(200).send({
    success: true,
    order,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}

// delete order --ADMIN
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found wit this Id", 404));
  }
  await order.remove();
  res.status(200).send({
    success: true,
  });
});
