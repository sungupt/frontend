# EKart E-Commerce - Project Architecture & Structure

## Project Overview

EKart is a full-stack e-commerce platform built with modern web technologies. It provides a complete shopping experience with product browsing, cart management, order placement, and secure payment processing.

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19.2.6 |
| **Frontend Framework** | React Router | 7.17.0 |
| **Frontend Build** | Create React App | 5.0.1 |
| **Styling** | Bootstrap, CSS3 | 5.3.8 |
| **Backend** | Node.js + Express | 18.0.0 + 4.18.2 |
| **Database** | MySQL | 8.0+ |
| **ORM** | mysql2/promise | 3.6.0 |
| **Authentication** | JWT + Bcryptjs | 9.1.2 + 2.4.3 |
| **API Documentation** | Custom JSON | v1.0 |

---

## Project Structure

```
/workspaces/
│
├── frontend/                          # React Frontend Application
│   ├── public/                        # Static assets
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── index.tsx                  # React entry point
│   │   ├── App.tsx                    # Main App component
│   │   ├── index.css                  # Global styles
│   │   │
│   │   ├── pages/                     # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── CartPage.tsx (to be created)
│   │   │   ├── CheckoutPage.tsx (to be created)
│   │   │   └── OrdersPage.tsx
│   │   │
│   │   ├── providers/                 # Context providers
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── CartProvider.tsx
│   │   │   └── ToastProvider.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── components/            # Reusable components
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   ├── GlassCard.tsx
│   │   │   │   ├── PremiumInput.tsx
│   │   │   │   ├── LuxuryButton.tsx
│   │   │   │   └── AddCardModel.tsx
│   │   │   │
│   │   │   ├── services/              # API Services
│   │   │   │   ├── apiClient.ts       # Axios instance with interceptors
│   │   │   │   ├── customerService.ts # Auth & Profile management
│   │   │   │   ├── productService.ts  # Product browsing
│   │   │   │   ├── cartService.ts     # Cart operations
│   │   │   │   ├── orderService.ts    # Order management
│   │   │   │   └── paymentService.ts  # Card & Payment
│   │   │   │
│   │   │   ├── types/                 # TypeScript types
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── utils/                 # Utilities
│   │   │       └── validators.ts
│   │   │
│   │   └── styles/                    # Styling files
│   │       ├── animation.css
│   │       ├── claymorphism.css
│   │       ├── glassmorphism.css
│   │       ├── typography.css
│   │       └── variable.css
│   │
│   ├── package.json                   # Frontend dependencies
│   ├── tsconfig.json                  # TypeScript config
│   ├── SETUP_GUIDE.md                 # Setup instructions
│   ├── API_ENDPOINTS.md               # API reference
│   ├── sqlscript.txt                  # Database schema
│   └── README.md
│
└── backend/                           # Node.js Backend
    ├── src/
    │   ├── server.js                  # Express app setup
    │   │
    │   ├── config/
    │   │   └── database.js            # MySQL connection pool
    │   │
    │   ├── controllers/               # Business logic
    │   │   ├── customerController.js
    │   │   ├── productController.js
    │   │   ├── cartController.js
    │   │   ├── orderController.js
    │   │   └── paymentController.js
    │   │
    │   ├── routes/                    # API routes
    │   │   ├── customer.js
    │   │   ├── product.js
    │   │   ├── cart.js
    │   │   ├── order.js
    │   │   └── payment.js
    │   │
    │   ├── middleware/                # Express middleware
    │   │   └── auth.js                # JWT verification
    │   │
    │   ├── utils/                     # Utility functions
    │   │   └── helpers.js             # Crypto, JWT, validation
    │   │
    │   ├── models/                    # Data models (for reference)
    │   ├── validators/                # Input validation
    │   └── services/                  # Service layer (for future)
    │
    ├── scripts/
    │   └── migrate.js                 # Database migration
    │
    ├── .env                           # Environment variables
    ├── .env.example                   # Environment template
    ├── package.json                   # Dependencies
    ├── README.md                      # Backend documentation
    └── .gitignore
```

---

## Data Models & Database Schema

### Tables

#### 1. **customer**
Stores user account information

```
Columns:
- email_id (PK, VARCHAR)
- name (VARCHAR)
- password (VARCHAR - bcrypt hashed)
- phone_number (VARCHAR - unique)
- address (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- is_active (BOOLEAN)
```

#### 2. **product**
Product catalog

```
Columns:
- product_id (PK, INT - auto increment)
- name (VARCHAR)
- description (LONGTEXT)
- category (VARCHAR)
- brand (VARCHAR)
- price (DECIMAL)
- available_quantity (INT)
- image_url (VARCHAR)
- created_at (TIMESTAMP)
- is_active (BOOLEAN)
```

#### 3. **cart**
Shopping cart per customer (1:1)

```
Columns:
- cart_id (PK, INT - auto increment)
- customer_email_id (FK to customer)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 4. **cart_product**
Cart items (N:M relationship)

```
Columns:
- cart_product_id (PK, INT - auto increment)
- cart_id (FK to cart)
- product_id (FK to product)
- quantity (INT)
- added_at (TIMESTAMP)
```

#### 5. **card**
Payment cards

```
Columns:
- card_id (PK, INT - auto increment)
- customer_email_id (FK to customer)
- card_type (VARCHAR - CREDIT/DEBIT)
- card_number (VARCHAR - 16 digits, unique)
- name_on_card (VARCHAR)
- cvv_hash (VARCHAR - bcrypt hashed)
- expiry_date (DATE)
- created_at (TIMESTAMP)
- is_active (BOOLEAN)
```

#### 6. **order**
Customer orders

```
Columns:
- order_id (PK, INT - auto increment)
- customer_email_id (FK to customer)
- date_of_order (TIMESTAMP)
- total_price (DECIMAL)
- order_status (VARCHAR - PLACED/CONFIRMED/DISPATCHED/DELIVERED)
- discount (DECIMAL)
- payment_through (VARCHAR - CREDIT/DEBIT)
- date_of_delivery (DATETIME)
- delivery_address (VARCHAR)
- created_at (TIMESTAMP)
```

#### 7. **ordered_product**
Order items (N:M relationship)

```
Columns:
- ordered_product_id (PK, INT - auto increment)
- order_id (FK to order)
- product_id (FK to product)
- quantity (INT)
- price_at_purchase (DECIMAL)
- created_at (TIMESTAMP)
```

#### 8. **payment**
Payment transactions

```
Columns:
- payment_id (PK, INT - auto increment)
- order_id (FK to order)
- card_id (FK to card)
- customer_email_id (FK to customer)
- payment_amount (DECIMAL)
- payment_status (VARCHAR - PENDING/SUCCESS/FAILED)
- transaction_id (VARCHAR - unique)
- payment_date (TIMESTAMP)
```

#### 9. **audit_log**
Activity logging for audit trail

```
Columns:
- log_id (PK, INT - auto increment)
- entity_type (VARCHAR)
- entity_id (VARCHAR)
- action (VARCHAR)
- old_value (LONGTEXT)
- new_value (LONGTEXT)
- user_email_id (FK to customer)
- created_at (TIMESTAMP)
```

---

## API Architecture

### REST API Design

**Base URL**: `http://localhost:5000/api`

### Module Organization

#### 1. **Customer Module** - `/customer-api`
- Authentication (Register, Login)
- Profile Management
- Related Tables: `customer`

#### 2. **Product Module** - `/product-api`
- Browse Products
- Search & Filter
- Category/Brand Listing
- Related Tables: `product`

#### 3. **Cart Module** - `/cart-api`
- Add/Update/Remove Items
- View Cart
- Related Tables: `cart`, `cart_product`

#### 4. **Order Module** - `/order-api`
- Place Orders
- View Order History
- Order Tracking
- Related Tables: `order`, `ordered_product`

#### 5. **Payment Module** - `/payment-api`
- Card Management
- Payment Processing
- Related Tables: `card`, `payment`

---

## Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  Register/Login  │   POST /customer-api/register
│                  │   POST /customer-api/login
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│   Backend validates  │
│   credentials        │
└────────┬─────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Generate JWT Token              │
│ - User email                    │
│ - Expiry: 7 days                │
│ - Sign with JWT_SECRET          │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Return Token to     │
│  Frontend            │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Store in localStorage       │
│  authToken: <token>          │
└────────┬─────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  All subsequent API requests       │
│  Include Authorization header      │
│  Authorization: Bearer <token>     │
└────────────────────────────────────┘
```

---

## Request/Response Flow

### Example: Add to Cart

```
FRONTEND (React)
    │
    ├─ User clicks "Add to Cart"
    │
    ├─ Component calls cartService.addProductToCart(productId, quantity)
    │
    └─► Call apiClient.post('/cart-api/products', data)
        │
        ├─ Axios interceptor adds Authorization header
        │
        └─► HTTP POST to Backend
        
BACKEND (Express)
    │
    ├─ Route: POST /api/cart-api/products
    │
    ├─ Middleware: authMiddleware (verify JWT token)
    │
    ├─ Controller: cartController.addProductToCart()
    │
    ├─ Validation:
    │   ├─ Product exists?
    │   ├─ Stock available?
    │   └─ Not already in cart?
    │
    ├─ Database Operation:
    │   ├─ Get cart_id from customer_email_id
    │   ├─ Insert into cart_product table
    │   └─ Return insertId
    │
    └─► Response: {"status": "success", "message": "..."}
        
FRONTEND (React)
    │
    ├─ Response received
    │
    ├─ Show success toast
    │
    ├─ Update cart context
    │
    └─ Re-render component
```

---

## Security Measures

### 1. **Authentication**
- JWT tokens with 7-day expiry
- Tokens stored in localStorage
- Auto-attached to all protected requests
- 401 responses clear auth data

### 2. **Password Security**
- Bcryptjs hashing (10 salt rounds)
- Strong password requirements:
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character
  - Minimum 8 characters

### 3. **Card Security**
- CVV hashed with bcryptjs
- Card numbers masked in responses (`**** **** **** 1234`)
- No sensitive data in logs
- HTTPS recommended for production

### 4. **SQL Injection Prevention**
- Parameterized queries
- mysql2/promise prevents injection
- Input validation on all endpoints

### 5. **CORS Protection**
- Configured to allow only frontend origin
- Credentials support enabled
- Preflight requests handled

### 6. **Data Validation**
- Email format validation
- Phone number (10 digits)
- Card number (16 digits)
- CVV (3 digits)
- Expiry date validation

---

## Discount Rules

### Credit Card Purchase
- **Discount**: 10%
- **Applied On**: Total price after order processing
- **Formula**: `finalPrice = totalPrice - (totalPrice * 0.10)`

### Debit Card Purchase
- **Discount**: 5%
- **Applied On**: Total price after order processing
- **Formula**: `finalPrice = totalPrice - (totalPrice * 0.05)`

---

## Error Handling

### Response Format
All errors follow consistent format:

```json
{
  "status": "error",
  "message": "Error description",
  "timestamp": "ISO-8601 timestamp"
}
```

### HTTP Status Codes

| Code | When Used | Example |
|------|-----------|---------|
| 200 | Success | Product added to cart |
| 400 | Client error | Invalid input, product not found |
| 401 | Unauthorized | Missing/invalid token |
| 404 | Not found | Endpoint doesn't exist |
| 500 | Server error | Database error |

---

## Performance Optimizations

### Database
- Indexes on frequently queried columns
- Connection pooling (10 connections)
- Query optimization with EXPLAIN
- Prepared statements

### Backend
- Response compression with gzip
- Request size limits
- Rate limiting (future)
- Caching layer (future)

### Frontend
- Code splitting with React Router
- Lazy loading images
- CSS minification
- Component memoization

---

## Deployment Architecture

### Development
```
Local Machine
    ├─ MySQL (localhost:3306)
    ├─ Backend (localhost:5000)
    └─ Frontend (localhost:3000)
```

### Production (Recommended)
```
Cloud Provider (AWS/GCP/Azure)
    │
    ├─ Database: Managed MySQL (RDS/Cloud SQL)
    ├─ Backend: Node.js on EC2/App Engine
    ├─ Frontend: S3/Cloud Storage + CloudFront CDN
    ├─ SSL: Let's Encrypt/AWS ACM
    ├─ Monitoring: CloudWatch/Stackdriver
    └─ Logging: CloudWatch Logs/Cloud Logging
```

---

## Scalability Considerations

### Database
- Read replicas for high traffic
- Database sharding (future)
- Query caching with Redis

### Backend
- Horizontal scaling with load balancer
- Stateless design for easy scaling
- API gateway for routing
- Message queue for async operations

### Frontend
- CDN distribution
- Service workers for offline support
- Progressive Web App (PWA)

---

## Future Enhancements

- [ ] Admin dashboard for product management
- [ ] Email notifications
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Order tracking with real-time updates
- [ ] Customer reviews and ratings
- [ ] Wishlist functionality
- [ ] Inventory management system
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## Development Guidelines

### Code Standards
- TypeScript for type safety
- ES6+ JavaScript features
- Async/await for promises
- RESTful API design
- Consistent naming conventions

### Git Workflow
```bash
main (production)
 ↑
 └── develop (development)
      ↑
      ├── feature/user-auth
      ├── feature/cart
      └── fix/bug-xyz
```

### Testing Strategy
- Unit tests for utilities
- Integration tests for API
- End-to-end tests for workflows
- Load testing for performance

---

## Documentation

- **Setup Guide**: `/workspaces/frontend/SETUP_GUIDE.md`
- **API Reference**: `/workspaces/frontend/API_ENDPOINTS.md`
- **Database**: `/workspaces/frontend/sqlscript.txt`
- **Backend README**: `/workspaces/backend/README.md`

---

## Support & Troubleshooting

See **SETUP_GUIDE.md** for:
- Common issues and solutions
- Port conflicts
- Database connection problems
- CORS errors
- Authentication issues

---

**Project Version**: 1.0.0  
**Last Updated**: June 17, 2024  
**Architecture**: Microservices with REST API  
**Status**: Ready for Development
