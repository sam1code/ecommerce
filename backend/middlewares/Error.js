import ErrorHandler from "../utils/ErrorHandler.js";

export const error = (err, req, res, next) => {
  //invalid id error CastError  (mongodb id error)
  if (err.name === "CastError") {
    const message = `Resourse not found, Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";
  res.status(err.statusCode).json({ success: false, message: err.message });
};
