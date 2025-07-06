// routes/intent.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/get-intent', async (req, res) => {
  try {
    const { text } = req.body;

    // Use environment variable for Python backend URL
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'https://dev-ai-shop-python-backend-5.onrender.com';
    
    const response = await axios.post(`${pythonBackendUrl}/predict-intent`, {
      text
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error in /api/get-intent:", error.message);
    res.status(500).json({ error: 'Failed to fetch intent' });
  }
});

module.exports = router;
