const Product = require("../models/Product"); 
const User = require("../models/User");

exports.createProduct = async (req, res) => {
    try {
        // Extract product data from request body
        const { imageUrl, productName, description, category, price, buyNo, rating, discount, sellerId } = req.body;
        
        // Validate required fields
        if (!productName || !description || !category || !price) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: productName, description, category, and price are required"
            });
        }

        // Validate seller if provided
        if (sellerId) {
            const seller = await User.findById(sellerId);
            if (!seller) {
                return res.status(404).json({
                    success: false,
                    message: "Seller not found"
                });
            }
        }

        // Validate price
        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });
        }

        // Validate discount if provided
        if (discount && (discount < 0 || discount > 100)) {
            return res.status(400).json({
                success: false,
                message: "Discount must be between 0 and 100"
            });
        }

        // Validate rating if provided
        if (rating && (rating < 0 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 0 and 5"
            });
        }

        // Create product object with default values
        const productData = {
            imageUrl: imageUrl || "https://via.placeholder.com/150",
            productName: productName.trim(),
            description: description.trim(),
            category: category.trim(),
            price: parseFloat(price),
            buyNo: buyNo || 0,
            rating: rating || 0,
            discount: discount || 0
        };

        // Add seller if provided
        if (sellerId) {
            productData.seller = sellerId;
        }

        // Create the product
        const product = await Product.create(productData);
        
        // Add product to seller's soldProducts if seller exists
        if (sellerId) {
            const seller = await User.findById(sellerId);
            if (seller) {
                seller.soldProducts.push(product._id);
                await seller.save();
                console.log("Product added to seller's soldProducts:", sellerId);
            }
        }
        
        console.log("Product created successfully:", product);
        
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    } catch (error) {
        console.error("Error while creating product:", error);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Product with this name already exists"
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: "Product creation failed",
            error: error.message
        });
    }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); 

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error while getting products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

exports.getProductByID = async (req, res) => {
  try {
    const { productId } = req.params; // Changed from req.body to req.params for RESTful API

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error while fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Add rating to product
exports.addRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, stars, comment } = req.body;

    console.log('=== RATING DEBUG ===');
    console.log('Product ID:', productId);
    console.log('User ID:', userId);
    console.log('Stars:', stars);
    console.log('Comment:', comment);
    console.log('Request body:', req.body);

    // Validate required fields
    if (!productId || !userId || !stars) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: "Product ID, User ID, and rating stars are required"
      });
    }

    // Validate rating stars
    if (stars < 1 || stars > 5) {
      console.log('Validation failed - invalid stars:', stars);
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5 stars"
      });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      console.log('Product not found:', productId);
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    console.log('Product found:', product.productName);

    // Check if user has already rated this product
    const existingReviewIndex = product.reviews.findIndex(
      review => review.user.toString() === userId
    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      console.log('Updating existing review for user:', userId);
      product.reviews[existingReviewIndex].stars = stars;
      product.reviews[existingReviewIndex].comment = comment || product.reviews[existingReviewIndex].comment;
    } else {
      // Add new review
      console.log('Adding new review for user:', userId);
      product.reviews.push({
        user: userId,
        stars: stars,
        comment: comment || ""
      });
    }

    // Calculate new average rating
    const totalStars = product.reviews.reduce((sum, review) => sum + review.stars, 0);
    const averageRating = totalStars / product.reviews.length;
    
    // Update product rating
    product.rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal place

    console.log('New average rating:', product.rating);
    console.log('Total reviews:', product.reviews.length);

    // Save the updated product
    await product.save();

    console.log(`Rating added/updated for product ${productId} by user ${userId}`);

    res.status(200).json({
      success: true,
      message: existingReviewIndex !== -1 ? "Rating updated successfully" : "Rating added successfully",
      data: {
        productId: product._id,
        rating: product.rating,
        totalReviews: product.reviews.length,
        userRating: stars,
        userComment: comment || ""
      }
    });

  } catch (error) {
    console.error("Error while adding rating:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add rating",
      error: error.message
    });
  }
};

// Get product reviews
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const product = await Product.findById(productId).populate('reviews.user', 'username email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        productId: product._id,
        rating: product.rating,
        totalReviews: product.reviews.length,
        reviews: product.reviews
      }
    });

  } catch (error) {
    console.error("Error while fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message
    });
  }
};

// Get user's sold products
exports.getUserSoldProducts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find user and populate soldProducts with product details
    const user = await User.findById(userId).populate('soldProducts');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        soldProducts: user.soldProducts,
        totalSold: user.soldProducts.length
      }
    });

  } catch (error) {
    console.error("Error getting user sold products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sold products",
      error: error.message
    });
  }
};

// Update product
