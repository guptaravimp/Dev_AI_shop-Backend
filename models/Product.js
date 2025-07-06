// // models/Product.js

// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     productName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//     },
//     category: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     buyNo: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     imageUrl: {
//       type: String,
//       default: "https://via.placeholder.com/150",
//     },
//     rating: {
//       type: Number,
//       default: 0,
//     },
//     reviews: [
//       {
//         user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         comment: String,
//         stars: Number,
//       },
//     ],
//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Product", productSchema);

// models/Product.js

// import mongoose from "mongoose";
const mongoose=require('mongoose')

const productSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      default: "https://via.placeholder.com/150",
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        comment: { type: String, default: "" },
        stars: { type: Number, required: true, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now }
      },
    ],
    buyNo: {
      type: Number,
      default: 0, // number of times purchased
    },
    rating: {
      type: Number,
      default: 0, // average rating
    },
    discount: {
      type: Number,
      default: 0, // e.g. 20 means 20% off
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
  },
  { timestamps: true }
);

// Check if model already exists to prevent recompilation error
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);


