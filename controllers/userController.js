const User = require('../models/User');
const Product = require('../models/Product');
const PasswordHelper = require('../utils/passwordHelper');
const TokenHelper = require('../utils/tokenHelper');

exports.createUser = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);
        
        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({ 
                message: "Request body is missing",
                error: "No request body received"
            });
        }

        const { username, email, password, role = 'buyer' } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: "Username, email, and password are required",
                received: { username: !!username, email: !!email, password: !!password }
            });
        }

        // Validate role
        if (role && !['buyer', 'seller'].includes(role)) {
            return res.status(400).json({ 
                message: "Role must be either 'buyer' or 'seller'" 
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already exists" });

        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.status(400).json({ message: "Username already exists" });

    const { token: accessToken, exp: accessExp } = TokenHelper.createAccessToken({ sub: email });
    const { token: refreshToken, exp: refreshExp } = TokenHelper.createRefreshToken({ sub: email });

    const hashedPassword = PasswordHelper.hashPassword(password);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
        access_token: accessToken,
        access_token_exp: accessExp,
        refresh_token: refreshToken,
        refresh_token_exp: refreshExp
    });

    await newUser.save();

    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    res.status(201).json(userToReturn);
    } catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).json({ 
            message: "Internal server error during user creation",
            error: error.message 
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login attempt for email:", email);

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Login failed: User not found for email:", email);
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }

        // Verify password
        const isPasswordValid = PasswordHelper.comparePassword(password, user.password);
        if (!isPasswordValid) {
            console.log("Login failed: Invalid password for email:", email);
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }

        // Generate new tokens
        const { token: accessToken, exp: accessExp } = TokenHelper.createAccessToken({ sub: email });
        const { token: refreshToken, exp: refreshExp } = TokenHelper.createRefreshToken({ sub: email });

        // Update user with new tokens
        user.access_token = accessToken;
        user.access_token_exp = accessExp;
        user.refresh_token = refreshToken;
        user.refresh_token_exp = refreshExp;
        user.updated_at = new Date();

        await user.save();

        // Prepare response (exclude password)
        const userToReturn = user.toObject();
        delete userToReturn.password;

        console.log("Login successful for email:", email);

        res.status(200).json({
            message: "Login successful",
            user: userToReturn
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ 
            message: "Internal server error during login",
            error: error.message 
        });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const { email } = req.body;

        console.log("Logout attempt for email:", email);

        // Validate required fields
        if (!email) {
            return res.status(400).json({ 
                message: "Email is required" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Logout failed: User not found for email:", email);
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        // Clear tokens
        user.access_token = null;
        user.access_token_exp = null;
        user.refresh_token = null;
        user.refresh_token_exp = null;
        user.updated_at = new Date();

        await user.save();

        console.log("Logout successful for email:", email);

        res.status(200).json({
            message: "Logout successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });

    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ 
            message: "Internal server error during logout",
            error: error.message 
        });
    }
};

exports.purchaseProduct = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        console.log("Purchase attempt for user:", userId, "product:", productId);

        // Validate required fields
        if (!userId || !productId) {
            return res.status(400).json({ 
                message: "User ID and Product ID are required" 
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            console.log("Purchase failed: User not found for ID:", userId);
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            console.log("Purchase failed: Product not found for ID:", productId);
            return res.status(404).json({ 
                message: "Product not found" 
            });
        }

        // Check if product is already in user's orders
        if (user.YourOrders.includes(productId)) {
            return res.status(400).json({ 
                message: "Product already purchased by this user" 
            });
        }

        // Add product to user's orders
        user.YourOrders.push(productId);
        user.updated_at = new Date();

        // Update product's buyNo (purchase count)
        product.buyNo += 1;
        product.updated_at = new Date();

        console.log(`Updating product ${productId} buyNo from ${product.buyNo - 1} to ${product.buyNo}`);

        // Save both user and product
        await Promise.all([user.save(), product.save()]);

        console.log("Purchase successful for user:", userId, "product:", productId);
        console.log("Updated product buyNo:", product.buyNo);

        res.status(200).json({
            message: "Product purchased successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                YourOrders: user.YourOrders,
                created_at: user.created_at,
                updated_at: user.updated_at
            },
            product: {
                _id: product._id,
                productName: product.productName,
                price: product.price,
                discount: product.discount,
                buyNo: product.buyNo
            }
        });

    } catch (error) {
        console.error("Error during product purchase:", error);
        res.status(500).json({ 
            message: "Internal server error during product purchase",
            error: error.message 
        });
    }
};

exports.getAllYourOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        console.log("Getting orders for user:", userId);

        // Validate required fields
        if (!userId) {
            return res.status(400).json({ 
                message: "User ID is required" 
            });
        }

        // Find user and populate the YourOrders with product details
        const user = await User.findById(userId).populate('YourOrders');
        if (!user) {
            console.log("Get orders failed: User not found for ID:", userId);
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        console.log("Orders retrieved successfully for user:", userId);

        res.status(200).json({
            message: "Orders retrieved successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                YourOrders: user.YourOrders,
                created_at: user.created_at,
                updated_at: user.updated_at
            },
            totalOrders: user.YourOrders.length
        });

    } catch (error) {
        console.error("Error getting user orders:", error);
        res.status(500).json({ 
            message: "Internal server error while getting orders",
            error: error.message 
        });
    }
};

