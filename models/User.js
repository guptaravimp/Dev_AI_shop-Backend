const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['buyer', 'seller'], 
        required: true, 
        default: 'buyer' 
    },
    access_token: { type: String },
    access_token_exp: { type: Date },
    refresh_token: { type: String },
    refresh_token_exp: { type: Date },
    YourOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    soldProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Check if model already exists to prevent recompilation error
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
