# API Documentation

Complete REST API documentation for the Premium E-commerce platform.

## Base URL
```
http://localhost:3000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890" // optional
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

---

### Login
Authenticate user and get JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

---

### Get Current User
Get authenticated user details.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "wishlist": [],
    "addresses": []
  }
}
```

---

## 📦 Product Endpoints

### Get All Products
Retrieve products with optional filters.

**Endpoint:** `GET /products`

**Query Parameters:**
- `category` - Filter by category name
- `brand` - Filter by brand name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minRating` - Minimum rating (1-5)
- `search` - Search in title, description, brand
- `sort` - Sort by: `price-asc`, `price-desc`, `rating`, `newest`, `popularity`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `featured` - Filter featured products: `true`

**Example:**
```
GET /products?category=Electronics&minPrice=100&maxPrice=500&sort=price-asc&page=1
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "title": "Wireless Headphones",
        "description": "Premium headphones...",
        "price": 299.99,
        "originalPrice": 399.99,
        "discount": 25,
        "category": "Electronics",
        "brand": "AudioPro",
        "images": ["url1", "url2"],
        "stock": 50,
        "rating": 4.8,
        "reviews": [],
        "featured": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "pages": 9
    }
  }
}
```

---

### Get Single Product
Get detailed product information.

**Endpoint:** `GET /products/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "title": "Wireless Headphones",
    "description": "Premium headphones...",
    "price": 299.99,
    "category": "Electronics",
    "brand": "AudioPro",
    "images": ["url1", "url2"],
    "stock": 50,
    "rating": 4.8,
    "reviews": [
      {
        "user": "user_id",
        "userName": "John Doe",
        "rating": 5,
        "comment": "Great product!",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "specifications": {
      "Battery Life": "30 hours",
      "Connectivity": "Bluetooth 5.0"
    },
    "features": ["Noise Cancellation", "Premium Sound"]
  }
}
```

---

### Create Product (Admin Only)
Create a new product.

**Endpoint:** `POST /products`

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "title": "New Product",
  "description": "Product description",
  "price": 99.99,
  "originalPrice": 129.99,
  "discount": 23,
  "category": "Electronics",
  "brand": "BrandName",
  "images": ["url1", "url2"],
  "stock": 100,
  "specifications": {
    "Color": "Black",
    "Weight": "500g"
  },
  "features": ["Feature 1", "Feature 2"],
  "featured": false
}
```

**Response:** `201 Created`

---

### Update Product (Admin Only)
Update existing product.

**Endpoint:** `PUT /products/:id`

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:** Same as create (partial updates allowed)

**Response:** `200 OK`

---

### Delete Product (Admin Only)
Delete a product.

**Endpoint:** `DELETE /products/:id`

**Headers:** `Authorization: Bearer <admin-token>`

**Response:** `200 OK`

---

### Add Product Review
Add a review to a product.

**Endpoint:** `POST /products/:id/reviews`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent product! Highly recommended."
}
```

**Response:** `201 Created`

---

## 🛒 Cart Endpoints

### Get User Cart
Get current user's cart.

**Endpoint:** `GET /cart`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "title": "Product Name",
          "price": 99.99,
          "images": ["url"]
        },
        "quantity": 2,
        "price": 99.99
      }
    ],
    "totalPrice": 199.98
  }
}
```

---

### Add to Cart
Add product to cart.

**Endpoint:** `POST /cart`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

**Response:** `200 OK`

---

### Update Cart Item
Update quantity of cart item.

**Endpoint:** `PUT /cart`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 3
}
```

**Response:** `200 OK`

---

### Remove from Cart
Remove item from cart.

**Endpoint:** `DELETE /cart?productId=<product_id>`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## 📋 Order Endpoints

### Get User Orders
Get all orders for current user (or all orders if admin).

**Endpoint:** `GET /orders`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "orderNumber": "ORD-1234567890-ABC",
      "user": "user_id",
      "items": [
        {
          "product": "product_id",
          "title": "Product Name",
          "price": 99.99,
          "quantity": 2,
          "image": "url"
        }
      ],
      "shippingAddress": {
        "name": "John Doe",
        "phone": "1234567890",
        "addressLine1": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001"
      },
      "paymentMethod": "card",
      "paymentStatus": "paid",
      "orderStatus": "processing",
      "subtotal": 199.98,
      "tax": 19.99,
      "shippingCost": 0,
      "totalAmount": 219.97,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Create Order
Create new order from cart.

**Endpoint:** `POST /orders`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "shippingAddress": {
    "name": "John Doe",
    "phone": "1234567890",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "paymentMethod": "card"
}
```

**Payment Methods:** `card`, `upi`, `cod`

**Response:** `201 Created`

---

### Get Single Order
Get order details.

**Endpoint:** `GET /orders/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Update Order Status (Admin Only)
Update order status.

**Endpoint:** `PUT /orders/:id`

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "orderStatus": "shipped",
  "paymentStatus": "paid"
}
```

**Order Status:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`
**Payment Status:** `pending`, `paid`, `failed`

**Response:** `200 OK`

---

## ❤️ Wishlist Endpoints

### Get Wishlist
Get user's wishlist.

**Endpoint:** `GET /wishlist`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "title": "Product Name",
      "price": 99.99,
      "images": ["url"]
    }
  ]
}
```

---

### Add to Wishlist
Add product to wishlist.

**Endpoint:** `POST /wishlist`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "product_id"
}
```

**Response:** `200 OK`

---

### Remove from Wishlist
Remove product from wishlist.

**Endpoint:** `DELETE /wishlist?productId=<product_id>`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## 📁 Category Endpoints

### Get All Categories
Get all product categories.

**Endpoint:** `GET /categories`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Electronics",
      "slug": "electronics",
      "image": "url",
      "description": "Electronic gadgets"
    }
  ]
}
```

---

### Create Category (Admin Only)
Create new category.

**Endpoint:** `POST /categories`

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "New Category",
  "slug": "new-category",
  "image": "url",
  "description": "Category description"
}
```

**Response:** `201 Created`

---

## ❌ Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": {} // optional validation errors
}
```

### Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🧪 Testing with cURL

### Register and Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Add to Cart (with auth)
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in USD
- Product IDs are MongoDB ObjectIds
- JWT tokens expire after 7 days
- Admin role required for product/order management

---

**For more information, check the source code in `src/app/api/`**
