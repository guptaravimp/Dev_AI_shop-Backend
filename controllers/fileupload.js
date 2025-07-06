const File = require("../models/File")
const cloudinary = require('cloudinary').v2

exports.localFileupload = async (req, res) => {
    try {
        ////fetch file
        const file = req.files.file;
        console.log("File received:", file);
        
        /// __dirname-> means current directly in myu this case we are inside controller in fileupload.js file i.e __dirname
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`; /// server path
        console.log("Path->", path)

        file.mv(path, (err) => {
            console.log(err);
        });

        res.json({
            success: true,
            message: "Local file uploaded successfully"
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "File upload failed"
        })
    }
}

function isFiletypeSupported(type, supportedType) {
    return supportedType.includes(type);
}

async function uploadFileToCloudinary(file, folder) {
    const options = { folder };
    options.resource_type = "auto"
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Product Image Upload - Enhanced for product creation
exports.uploadProductImage = async (req, res) => {
    try {
        // Check if file exists
        if (!req.files || !req.files.imagefiles) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        const file = req.files.imagefiles;
        console.log("Product image file:", file);

        // Validation for supported file types
        const supportedType = ["jpg", "png", "jpeg", "webp"]
        const fileType = file.name.split('.')[1].toLowerCase();

        if (!isFiletypeSupported(fileType, supportedType)) {
            return res.status(400).json({
                success: false,
                message: "File type not supported. Please upload JPG, PNG, JPEG, or WEBP files."
            });
        }

        // File size validation (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: "File size too large. Please upload files smaller than 5MB."
            });
        }

        // Upload to Cloudinary
        const response = await uploadFileToCloudinary(file, "dev-ai-shop-products");
        console.log("Cloudinary response:", response);

        // Create file record in database
        const fileData = await File.create({
            name: file.name,
            tags: "product",
            email: req.body.email || "anonymous@example.com",
            imageUrl: response.secure_url,
            publicId: response.public_id,
            uploadedBy: req.body.userId || null
        });

        res.json({
            success: true,
            message: "Product image uploaded successfully",
            data: {
                imageUrl: response.secure_url,
                publicId: response.public_id,
                fileId: fileData._id
            }
        });

    } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({
            success: false,
            message: "Image upload failed. Please try again."
        });
    }
}

// Original image upload function (keeping for backward compatibility)
exports.imageUpload = async (req, res) => {
    try {
        /// data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);
        
        if (!req.files || !req.files.imagefiles) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        const file = req.files.imagefiles;
        console.log(file);

        /// validation 
        const supportedType = ["jpg", "png", "jpeg"]
        const fileType = file.name.split('.')[1].toLowerCase();

        if (!isFiletypeSupported(fileType, supportedType)) {
            return res.status(400).json({
                success: false,
                message: "File type is not supported"
            });
        }

        /// file format supported 
        const response = await uploadFileToCloudinary(file, "techravibusiness");
        console.log("response:", response);

        /// db entry created 
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
            publicId: response.public_id
        })

        res.json({
            success: true,
            message: "image uploaded successfully",
            imageUrl: response.secure_url,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

// Delete image from Cloudinary
exports.deleteImage = async (req, res) => {
    try {
        const { publicId } = req.body;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: "Public ID is required"
            });
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary delete result:", result);

        // Delete from database
        await File.findOneAndDelete({ publicId });

        res.json({
            success: true,
            message: "Image deleted successfully"
        });

    } catch (error) {
        console.error("Delete image error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete image"
        });
    }
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto"
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

