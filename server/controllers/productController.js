const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleWare/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

//create product---ADMIN
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

//update product --ADMIN
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return new ErrorHandler("product not found", 404);
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
  });
  return res.status(200).send({ success: true, product });
});

//delete product --ADMIN
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return new ErrorHandler("product not found", 404);
  }
  await product.remove();
  res
    .status(200)
    .json({ success: true, message: "product deleted successfully" });
});

//get all product
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const productCount = await Product.count();
  const resultsPerPage = 5;
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .searchFeature()
    .filterFeature()
    .paginationFeature(resultsPerPage);

  const products = await apiFeature.query;
  res.status(200).json({ success: true, productCount, products });
});

//get specific product
exports.getSpecificProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  res.send(product);
});

// create new review or update the review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { productId, comment, rating } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }
  let sum = 0;

  product.reviews.forEach((rev) => {
    sum += rev.rating;
  });
  product.ratings = sum / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).send({ success: true });
});

//get all review
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).send({
    success: true,
    reviews: product.reviews,
  });
});

//delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  
  let sum = 0;
  reviews.forEach((rev) => {
    sum += rev.rating;
  });
  const numberOfReviews = reviews.length;
  const ratings = sum / numberOfReviews;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      numberOfReviews,
      ratings,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).send({ success: true });
});
