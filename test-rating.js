const axios = require('axios');

// Test the rating system
async function testRating() {
  try {
    console.log('Testing rating system...');
    
    // Test data
    const testData = {
      productId: '6866c91e1787b4491028ea8d', // Replace with actual product ID
      userId: '686537948039b4ef01cfe18b', // Replace with actual user ID
      stars: 4,
      comment: 'Test rating from script'
    };

    console.log('Test data:', testData);

    // Test adding rating
    const response = await axios.post(`http://localhost:5000/api/v1/addRating/${testData.productId}`, {
      userId: testData.userId,
      stars: testData.stars,
      comment: testData.comment
    });

    console.log('Rating response:', response.data);

    // Test getting reviews
    const reviewsResponse = await axios.get(`http://localhost:5000/api/v1/getReviews/${testData.productId}`);
    console.log('Reviews response:', reviewsResponse.data);

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testRating(); 