# Image Upload Setup Guide

This guide explains how to set up image upload functionality using Cloudinary for the product creation feature.

## Prerequisites

1. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com)
2. **Node.js Backend**: Ensure your backend is running
3. **Frontend**: Ensure your React frontend is running

## Backend Setup

### 1. Environment Variables

Add the following Cloudinary credentials to your `.env` file:

```env
# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 2. Get Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Install Dependencies

The required dependencies are already installed:
- `cloudinary` - For Cloudinary integration
- `express-fileupload` - For handling file uploads

### 4. Backend Features

The backend now includes:

- **File Model** (`models/File.js`): Stores file metadata
- **Enhanced Upload Controller** (`controllers/fileupload.js`):
  - `uploadProductImage`: Upload product images to Cloudinary
  - `deleteImage`: Delete images from Cloudinary
  - File type validation (JPG, PNG, JPEG, WEBP)
  - File size validation (5MB limit)
  - Error handling and response formatting

- **File Upload Routes** (`routes/fileUpload.js`):
  - `POST /api/v1/uploadProductImage` - Upload product images
  - `DELETE /api/v1/deleteImage` - Delete images

## Frontend Setup

### 1. Updated CreateProduct Page

The frontend now includes:

- **File Upload Interface**: Drag-and-drop or click-to-upload
- **Image Preview**: Shows uploaded image immediately
- **Validation**: Client-side file type and size validation
- **Progress Indicators**: Loading states and success/error messages
- **Remove Functionality**: Option to remove uploaded images

### 2. API Integration

The frontend uses the new API endpoints:
- `UPLOAD_PRODUCT_IMAGE`: Upload images to Cloudinary
- `DELETE_IMAGE`: Remove images from Cloudinary

## Usage

### Creating a Product with Image

1. Navigate to the "Sell Product" page
2. Fill in product details (name, description, category, price, discount)
3. **Upload Image**:
   - Click the upload area or drag an image file
   - Supported formats: JPG, PNG, WEBP (max 5MB)
   - Image will be uploaded to Cloudinary automatically
   - Preview will show the uploaded image
4. Click "Create Product" to save

### Image Storage

- Images are stored in Cloudinary folder: `dev-ai-shop-products`
- Each image gets a unique public ID
- Image URLs are stored in the product's `imageUrl` field
- File metadata is stored in the `File` collection

## API Endpoints

### Upload Product Image
```
POST /api/v1/uploadProductImage
Content-Type: multipart/form-data

Body:
- imagefiles: File (required)
- email: String (optional)
- userId: String (optional)

Response:
{
  "success": true,
  "message": "Product image uploaded successfully",
  "data": {
    "imageUrl": "https://res.cloudinary.com/...",
    "publicId": "dev-ai-shop-products/...",
    "fileId": "file_id"
  }
}
```

### Delete Image
```
DELETE /api/v1/deleteImage
Content-Type: application/json

Body:
{
  "publicId": "dev-ai-shop-products/..."
}

Response:
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## Error Handling

The system handles various error scenarios:

- **Invalid file type**: Only JPG, PNG, JPEG, WEBP allowed
- **File too large**: Maximum 5MB file size
- **Upload failures**: Network issues or Cloudinary errors
- **Missing files**: No file provided in request

## Security Features

- File type validation (whitelist approach)
- File size limits
- Secure Cloudinary URLs
- User association with uploads
- Error logging for debugging

## Troubleshooting

### Common Issues

1. **"No image file provided"**
   - Ensure the file input is properly configured
   - Check that the file is being sent in the request

2. **"File type not supported"**
   - Only JPG, PNG, JPEG, WEBP files are allowed
   - Check file extension and MIME type

3. **"File size too large"**
   - Maximum file size is 5MB
   - Compress or resize the image before uploading

4. **Cloudinary upload fails**
   - Check Cloudinary credentials in `.env`
   - Verify internet connection
   - Check Cloudinary account status

### Debug Steps

1. Check browser console for frontend errors
2. Check backend logs for server errors
3. Verify Cloudinary credentials
4. Test with smaller image files
5. Check network connectivity

## Future Enhancements

Potential improvements:
- Image compression and optimization
- Multiple image uploads per product
- Image cropping and editing
- CDN integration for faster loading
- Image backup and recovery
- Advanced image processing (filters, effects) 