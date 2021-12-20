import mongoose from "mongoose";
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a valid product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "please provide production"],
  },
  price: {
    type: Number,
    required: [true, "please Enter Product Price"],
    maxLength: [6, "price can't be more than 999999"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "please enter product category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [3, "product can't exceed 999"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      Comment: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("product", productSchema, "products");
