const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: String,
        default: "product"
    },
    email: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Check if model already exists to prevent recompilation error
module.exports = mongoose.models.File || mongoose.model('File', fileSchema); 