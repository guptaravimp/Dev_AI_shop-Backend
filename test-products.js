const mongoose = require('mongoose');
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect('mongodb+srv://guptaravii263:d9UxkunX03arxibz@tododb.muyfv.mongodb.net/HackathonDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dummyProducts = [
  {
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    productName: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life",
    category: "electronics",
    price: 89.99,
    buyNo: 150,
    rating: 4.5,
    discount: 15
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    productName: "Smart Watch Series 5",
    description: "Advanced smartwatch with health monitoring, GPS, and water resistance",
    category: "electronics",
    price: 299.99,
    buyNo: 89,
    rating: 4.8,
    discount: 20
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    productName: "Nike Air Max Running Shoes",
    description: "Comfortable running shoes with excellent cushioning and breathable design",
    category: "footwear",
    price: 129.99,
    buyNo: 234,
    rating: 4.6,
    discount: 10
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500",
    productName: "Leather Crossbody Bag",
    description: "Stylish leather bag perfect for everyday use with multiple compartments",
    category: "accessories",
    price: 79.99,
    buyNo: 67,
    rating: 4.3,
    discount: 0
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
    productName: "Polaroid Camera",
    description: "Vintage-style instant camera with modern features and high-quality prints",
    category: "electronics",
    price: 149.99,
    buyNo: 45,
    rating: 4.7,
    discount: 25
  }
];

async function addDummyProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add dummy products
    const products = await Product.insertMany(dummyProducts);
    console.log('Added dummy products successfully!');
    
    // Display the products with their IDs
    console.log('\n=== DUMMY PRODUCTS ADDED ===');
    products.forEach(product => {
      console.log(`ID: ${product._id}`);
      console.log(`Name: ${product.productName}`);
      console.log(`Category: ${product.category}`);
      console.log(`Price: $${product.price}`);
      console.log('---');
    });

    // Test getProductByID with the first product
    const firstProduct = products[0];
    console.log(`\n=== TESTING GET PRODUCT BY ID ===`);
    console.log(`Testing with ID: ${firstProduct._id}`);
    console.log(`Product Name: ${firstProduct.productName}`);
    
    // Test the API endpoint
    console.log('\n=== API TESTING ===');
    console.log('To test the API, use these endpoints:');
    console.log(`1. Get all products: GET https://dev-ai-shop-backend.vercel.app/api/v1/getAllproducts`);
    console.log(`2. Get product by ID: GET https://dev-ai-shop-backend.vercel.app/api/v1/getProduct/${firstProduct._id}`);
    
    console.log('\n=== CURL COMMANDS ===');
    console.log('Get all products:');
    console.log('curl -X GET https://dev-ai-shop-backend.vercel.app/api/v1/getAllproducts');
    console.log('\nGet product by ID:');
    console.log(`curl -X GET https://dev-ai-shop-backend.vercel.app/api/v1/getProduct/${firstProduct._id}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

addDummyProducts(); 