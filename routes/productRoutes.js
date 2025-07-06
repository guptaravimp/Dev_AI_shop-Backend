const express = require("express");
const { createProduct, getAllProducts, getProductByID, addRating, getProductReviews, getUserSoldProducts } = require("../controllers/Products");
const router = express.Router();

// Product CRUD operations
router.post("/createProduct", createProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/getProduct/:productId", getProductByID);

// Rating operations
router.post("/addRating/:productId", addRating);
router.get("/getReviews/:productId", getProductReviews);

// User sold products
router.get("/getUserSoldProducts/:userId", getUserSoldProducts);

module.exports = router;