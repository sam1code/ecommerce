import catchAsyncError from "../middlewares/CatchAsyncErrors.js";
import ProductModel from "../models/productModels.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const products = {
  // create product-- Admin
  createProduct: catchAsyncError(async (req, res, next) => {
    const product = await ProductModel.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  }),
  // get all products
  getAllProducts: catchAsyncError(async (req, res) => {
    const products = await ProductModel.find();
    res.status(200).json({ success: true, products });
  }),
  //Get product details
  getProductDetails: catchAsyncError(async (req, res, next) => {
    let product = await ProductModel.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }
    res.status(200).json({ success: true, product });
  }),

  //update product -- Admin
  updateProduct: catchAsyncError(async (req, res) => {
    let product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Product not found",
      });
    }
    product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({ success: true, product });
  }),
  // delete product --admin
  deleteProduct: catchAsyncError(async (req, res) => {
    let product = await ProductModel.findById(req.params.id);
    if (!product) {
      res.status(500).json({ success: false, message: "product not found" });
    }
    await product.remove();
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  }),
};
