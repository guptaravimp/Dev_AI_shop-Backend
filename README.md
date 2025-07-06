# E-Commerce Backend API

A Node.js/Express backend for an e-commerce application with product management and AI-powered features.

## Features

- Product Management: CRUD operations for products
- AI Integration: Intent prediction and voice command processing
- Database: MongoDB with Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env-template.txt .env
   ```
   Edit `.env` file with your configuration values.

4. **Start the server**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=mongodb+srv://guptaravii263:d9UxkunX03arxibz@tododb.muyfv.mongodb.net/HackathonDB

# Server
PORT=5000
NODE_ENV=development
```

## API Endpoints

### User Endpoints

#### GET `/api/v1/users`
Get all users.

**Response:**
```json
{
  "message": "User routes working"
}
```

### Product Endpoints

#### GET `/api/v1/getAllproducts`
Get all products.

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "product_id",
      "imageUrl": "https://example.com/product.jpg",
      "productName": "Product Name",
      "description": "Product description",
      "category": "Electronics",
      "price": 999.99,
      "buyNo": 5,
      "rating": 4.5,
      "discount": 10,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/v1/createProduct`
Create a new product.

**Request Body:**
```json
{
  "imageUrl": "https://example.com/product.jpg",
  "productName": "New Product",
  "description": "Product description",
  "category": "Electronics",
  "price": 999.99,
  "buyNo": 0,
  "rating": 0,
  "discount": 0
}
```

#### POST `/api/v1/getProduct`
Get product by ID.

**Request Body:**
```json
{
  "productId": "product_id_here"
}
```

### AI Intent Endpoints

#### POST `/api/get-intent`
Get AI intent prediction for voice commands.

**Request Body:**
```json
{
  "text": "show me electronics products"
}
```

**Response:**
```json
{
  "intent": "electronics",
  "price": null,
  "confidence": 0.95
}
```

## Database Schema

### User Model
- Basic user information (name, email, profile picture)

### Product Model
- Basic Info (name, description, category)
- Pricing (price, discount)
- Media (image URL)
- Metrics (rating, purchase count)
- Timestamps (created, updated)

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## Testing

To test the API endpoints, you can use tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

## Development

### Project Structure
```
Backend/
├── config/
│   └── DbConnection.js
├── controllers/
│   ├── authController.js
│   └── Products.js
├── middleware/
├── models/
│   ├── User.js
│   └── Product.js
├── routes/
│   ├── UserRoutes.js
│   ├── productRoutes.js
│   └── intent.js
├── utils/
├── index.js
├── package.json
└── README.md
```

### Adding New Features
1. Create controller in `controllers/`
2. Add routes in `routes/`
3. Update middleware if needed
4. Update this README

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 