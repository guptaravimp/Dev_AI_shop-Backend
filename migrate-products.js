const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://guptaravii263:d9UxkunX03arxibz@tododb.muyfv.mongodb.net/HackathonDB');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function
const migrateProducts = async () => {
  try {
    console.log('Starting product migration...');
    
    // Get Product model
    const Product = require('./models/Product');
    
    // Find all products without seller field
    const productsWithoutSeller = await Product.find({ seller: { $exists: false } });
    
    console.log(`Found ${productsWithoutSeller.length} products without seller field`);
    
    if (productsWithoutSeller.length === 0) {
      console.log('No products need migration');
      return;
    }
    
    // Update products to have a default seller (you can change this to a specific user ID)
    const defaultSellerId = '686537948039b4ef01cfe18b'; // Replace with actual user ID
    
    for (const product of productsWithoutSeller) {
      product.seller = defaultSellerId;
      await product.save();
      console.log(`Updated product: ${product.productName}`);
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run migration
connectDB().then(() => {
  migrateProducts();
}); 