require('dotenv').config();
const express = require('express');
const cors = require('cors');
const DBConnection = require('./config/DbConnection');
// const productRoutes=require('./routes/productRoutes')
const productRoutes=require("./routes/productRoutes")
const userRoutes=require("./routes/UserRoutes")
const fileUploadRoutes=require("./routes/fileUpload")
const app = express();
const fileupload=require("express-fileupload")
const port = process.env.PORT || 5000;
const cloudinary=require("./config/cloudinary")
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom middleware to handle text/plain JSON
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'text/plain' && !req.body) {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(data);
        console.log('Successfully parsed text/plain as JSON:', req.body);
      } catch (error) {
        console.log('Failed to parse text/plain as JSON:', error.message);
        req.body = {};
      }
      next();
    });
  } else {
    next();
  }
});

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`=== REQUEST DEBUG ===`);
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`Content-Type: ${req.headers['content-type']}`);
  console.log(`Body:`, req.body);
  console.log(`Body Type:`, typeof req.body);
  console.log(`Body Keys:`, req.body ? Object.keys(req.body) : 'No body');
  console.log(`====================`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Test endpoint to check if server is running
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test POST endpoint to check body parsing
app.post('/api/test-body', (req, res) => {
  res.json({ 
    message: 'Body parsing test',
    receivedBody: req.body,
    bodyType: typeof req.body,
    headers: req.headers['content-type']
  });
});
app.use(fileupload({
  useTempFiles:true,
  tempFileDir:'/tmp/'
}));
cloudinary.cloudinaryConnect();

// 🔗 Connect API route
app.use('/api', require('./routes/intent'));
app.use("/api/v1",productRoutes)
app.use("/api/v1",userRoutes)
app.use("/api/v1",fileUploadRoutes)
DBConnection()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
