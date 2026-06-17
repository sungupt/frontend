# EKart API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Server Information
- **API Docs**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/health

---

## Authentication

### JWT Token Format
```
Authorization: Bearer <token>
```

### Token Storage (Frontend)
- Token stored in localStorage as `authToken`
- Automatically added to requests via axios interceptor
- Cleared on 401 Unauthorized

---

## API Endpoints

### 1. CUSTOMER API (`/customer-api`)

#### Register New User
```
POST /customer-api/register
No Auth Required

Request Body:
{
  "emailId": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass@123",
  "phoneNumber": "9876543210",
  "address": "123 Main St, City, State"
}

Success Response (200):
{
  "status": "success",
  "message": "You are successfully registered as customer with Email Id: user@example.com"
}

Error Response (400):
{
  "status": "error",
  "message": "Email id already in use. Please try with a new email id"
}
```

#### Login
```
POST /customer-api/login
No Auth Required

Request Body:
{
  "emailId": "user@example.com",
  "password": "SecurePass@123"
}

Success Response (200):
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "emailId": "user@example.com",
    "name": "John Doe",
    "phoneNumber": "9876543210",
    "address": "123 Main St, City, State",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Error Response (400):
{
  "status": "error",
  "message": "No customer found with the email id"
}
```

#### Get Profile
```
GET /customer-api/profile
Auth Required: YES

Headers:
Authorization: Bearer <token>

Success Response (200):
{
  "status": "success",
  "message": "Profile retrieved",
  "data": {
    "email_id": "user@example.com",
    "name": "John Doe",
    "phone_number": "9876543210",
    "address": "123 Main St, City, State",
    "created_at": "2024-06-17T10:00:00.000Z"
  }
}
```

#### Update Profile
```
PUT /customer-api/profile
Auth Required: YES

Headers:
Authorization: Bearer <token>

Request Body:
{
  "name": "Jane Doe",
  "phoneNumber": "9876543211",
  "address": "456 New St, City, State"
}

Success Response (200):
{
  "status": "success",
  "message": "Profile updated successfully"
}
```

---

### 2. PRODUCT API (`/product-api`)

#### Get All Products
```
GET /product-api/products
No Auth Required

Query Parameters:
- page (default: 1)
- limit (default: 10)
- category (optional)
- brand (optional)
- search (optional)

Example:
GET /product-api/products?page=1&limit=10&category=Electronics

Success Response (200):
{
  "status": "success",
  "message": "Products retrieved",
  "data": {
    "data": [
      {
        "product_id": 1,
        "name": "iPhone 14 Pro",
        "description": "Latest Apple iPhone...",
        "category": "Electronics",
        "brand": "Apple",
        "price": 999.99,
        "available_quantity": 50,
        "image_url": "https://..."
      },
      ...
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 45,
      "itemsPerPage": 10
    }
  }
}
```

#### Get Product by ID
```
GET /product-api/product/{productId}
No Auth Required

Example:
GET /product-api/product/1

Success Response (200):
{
  "status": "success",
  "message": "Product retrieved",
  "data": {
    "product_id": 1,
    "name": "iPhone 14 Pro",
    "description": "...",
    "category": "Electronics",
    "brand": "Apple",
    "price": 999.99,
    "available_quantity": 50,
    "image_url": "https://..."
  }
}

Error Response (400):
{
  "status": "error",
  "message": "Sorry product is not available"
}
```

#### Search Products
```
GET /product-api/search
No Auth Required

Query Parameters:
- query (required)
- page (default: 1)
- limit (default: 10)

Example:
GET /product-api/search?query=iPhone&page=1&limit=10

Success Response (200):
{
  "status": "success",
  "message": "Search results",
  "data": {...}
}

Error Response (400):
{
  "status": "error",
  "message": "No products found matching your search"
}
```

#### Get Categories
```
GET /product-api/categories
No Auth Required

Success Response (200):
{
  "status": "success",
  "message": "Categories retrieved",
  "data": ["Electronics", "Audio", "Computers", "Tablets", "TVs", "Gaming"]
}
```

#### Get Brands
```
GET /product-api/brands
No Auth Required

Success Response (200):
{
  "status": "success",
  "message": "Brands retrieved",
  "data": ["Apple", "Samsung", "Sony", "Dell", "Google"]
}
```

---

### 3. CART API (`/cart-api`)

#### Add Product to Cart
```
POST /cart-api/products
Auth Required: YES

Headers:
Authorization: Bearer <token>

Request Body:
{
  "productId": 1,
  "quantity": 2
}

Success Response (200):
{
  "status": "success",
  "message": "Product successfully added to the cart having cartId: 5"
}

Error Response (400):
{
  "status": "error",
  "message": "Product is already added to the cart"
}
```

#### Get Cart Products
```
GET /cart-api/products
Auth Required: YES

Headers:
Authorization: Bearer <token>

Success Response (200):
{
  "status": "success",
  "message": "Cart products retrieved",
  "data": [
    {
      "cart_product_id": 1,
      "quantity": 2,
      "product_id": 1,
      "name": "iPhone 14 Pro",
      "brand": "Apple",
      "price": 999.99,
      "available_quantity": 50,
      "image_url": "https://..."
    },
    ...
  ]
}

Error Response (400):
{
  "status": "error",
  "message": "No products are available in your cart"
}
```

#### Update Product Quantity
```
PUT /cart-api/product/{productId}
Auth Required: YES

Headers:
Authorization: Bearer <token>

Request Body:
{
  "quantity": 3
}

Success Response (200):
{
  "status": "success",
  "message": "Quantity updated successfully"
}

Error Response (400):
{
  "status": "error",
  "message": "Product is not available in your cart"
}
```

#### Delete Product from Cart
```
DELETE /cart-api/product/{productId}
Auth Required: YES

Headers:
Authorization: Bearer <token>

Success Response (200):
{
  "status": "success",
  "message": "Your item has been removed from cart"
}

Error Response (400):
{
  "status": "error",
  "message": "Product is not available in your cart"
}
```

#### Clear Cart
```
DELETE /cart-api/clear
Auth Required: YES

Headers:
Authorization: Bearer <token>

Success Response (200):
{
  "status": "success",
  "message": "Cart cleared successfully"
}
```

---

### 4. ORDER API (`/order-api`)

#### Place Order
```
POST /order-api/place-order
Auth Required: YES

Headers:
Authorization: Bearer <token>

Request Body:
{
  "dateOfDelivery": "2024-07-01T10:00:00",
  "paymentCardId": 1
}

Success Response (200):
{
  "status": "success",
  "message": "Order is successfully placed with order id: 15",
  "data": {
    "orderId": 15,
    "totalPrice": 1899.98,
    "discountAmount": 189.99,
    "finalPrice": 1709.99,
    "discount": "10%"
  }
}

Error Response (400):
{
  "status": "error",
  "message": "Cart is empty"
}
```

#### Get Customer Orders
```
GET /order-api/orders
Auth Required: YES

Headers:
Authorization: Bearer <token>

Success Response (200):
{
  "status": "success",
  "message": "Orders retrieved",
  "data": [
    {
      "order_id": 15,
      "customer_email_id": "user@example.com",
      "date_of_order": "2024-06-17T10:30:00.000Z",
      "total_price": 1709.99,
      "order_status": "PLACED",
      "discount": 189.99,
      "payment_through": "CREDIT",
      "date_of_delivery": "2024-07-01T10:00:00.000Z",
      "delivery_address": "123 Main St, City, State",
      "orderedProducts": [
        {
          "ordered_product_id": 1,
          "product_id": 1,
          "product_name": "iPhone 14 Pro",
          "brand": "Apple",
          "price_at_purchase": 999.99,
          "quantity": 2
        },
        ...
      ]
    },
    ...
  ]
}

Error Response (400):
{
  "status": "error",
  "message": "No orders are found for customer email id"
}
```

#### Get Order Details
```
GET /order-api/order/{orderId}
Auth Required: YES

Headers:
Authorization: Bearer <token>

Example:
GET /order-api/order/15

Success Response (200):
{
  "status": "success",
  "message": "Order details retrieved",
  "data": {...}
}

Error Response (400):
{
  "status": "error",
  "message": "Order not found"
}
```

---

### 5. PAYMENT API (`/payment-api`)

#### Add Card
```
POST /payment-api/cards
Auth Required: YES

Headers:
Authorization: Bearer <token>

Request Body:
{
  "cardType": "CREDIT",
  "cardNumber": "1234567890123456",
  "nameOnCard": "JOHN DOE",
  "cvv": 123,
  "expiryDate": "2025-12-31"
}

Success Response (200):
{
  "status": "success",
  "message": "The card has been successfully added, with card ID: 10"
}

Error Response (400):
{
  "status": "error",
  "message": "Card number must be 16 digits"
}
```

#### Get All Customer Cards
```
GET /payment-api/cards
Auth Required: YES

Headers:
Authorization: Bearer <token>

Success Response (200):
{
  "status": "success",
  "message": "Cards retrieved",
  "data": [
    {
      "card_id": 1,
      "card_type": "CREDIT",
      "card_number": "**** **** **** 3456",
      "name_on_card": "JOHN DOE",
      "cvv_hash": "XXX",
      "cvv": null,
      "expiry_date": "2025-12-31",
      "customer_email_id": "user@example.com"
    },
    ...
  ]
}

Error Response (400):
{
  "status": "error",
  "message": "No cards found"
}
```

#### Get Cards by Type
```
GET /payment-api/cards/{cardType}
Auth Required: YES

Headers:
Authorization: Bearer <token>

Parameters:
- cardType: CREDIT or DEBIT

Example:
GET /payment-api/cards/CREDIT

Success Response (200):
{
  "status": "success",
  "message": "Cards retrieved",
  "data": [...]
}

Error Response (400):
{
  "status": "error",
  "message": "No card found"
}
```

---

## HTTP Status Codes

| Code | Meaning | Common Reason |
|------|---------|---------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input or business logic error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Server Error | Internal server error |

---

## Common Error Messages

| Error | Solution |
|-------|----------|
| Invalid email format | Use valid email (e.g., user@example.com) |
| Phone number must be 10 digits | Enter exactly 10 digit phone number |
| Password must contain uppercase, lowercase, number and special character | Use strong password (e.g., SecurePass@123) |
| Card number must be 16 digits | Enter 16 digit card number |
| CVV must be 3 digits | Enter 3 digit CVV |
| Expiry date must be in the future | Select future date for expiry |
| No customer found with the email id | Check email or register first |
| Invalid or expired token | Login again to get new token |
| Cart is empty | Add items to cart first |

---

## Testing with cURL

### Example: Register and Login

```bash
# Register
curl -X POST http://localhost:5000/api/customer-api/register \
  -H "Content-Type: application/json" \
  -d '{
    "emailId": "testuser@example.com",
    "name": "Test User",
    "password": "TestPass@123",
    "phoneNumber": "9123456789",
    "address": "Test Address"
  }'

# Login (copy token from response)
curl -X POST http://localhost:5000/api/customer-api/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailId": "testuser@example.com",
    "password": "TestPass@123"
  }'

# Get Products (no auth needed)
curl -X GET "http://localhost:5000/api/product-api/products?page=1&limit=10"

# Get Cart (requires token)
curl -X GET http://localhost:5000/api/cart-api/products \
  -H "Authorization: Bearer <token_from_login>"
```

---

## Frontend Service Integration

See the frontend service files for TypeScript/JavaScript implementation:

- `customerService.ts` - Customer/Auth operations
- `productService.ts` - Product browsing
- `cartService.ts` - Cart management
- `orderService.ts` - Order operations
- `paymentService.ts` - Payment/Card management

---

**Last Updated**: June 17, 2024
**API Version**: 1.0.0
