# EKart Full Stack E-Commerce Application - Setup Guide

## Complete Setup Instructions for Local Development

This guide will help you set up and run the complete EKart e-commerce application locally with both frontend (React) and backend (Node.js + MySQL).

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [API Integration](#api-integration)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **MySQL**: v8.0 or higher
- **Git**: Latest version
- **RAM**: 4GB minimum
- **Disk Space**: 2GB minimum

### Recommended
- Node.js: v18.0.0 or higher
- MySQL: v8.0.26 or higher
- 8GB RAM
- SSD for faster performance

---

## Database Setup

### Step 1: Install MySQL

#### On macOS (using Homebrew)
```bash
brew install mysql
brew services start mysql
```

#### On Windows
Download and install from: https://dev.mysql.com/downloads/mysql/

#### On Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

### Step 2: Verify MySQL Installation
```bash
mysql --version
mysql -u root -p
```

Enter your password when prompted. You should see the MySQL prompt.

### Step 3: Create Database and Tables

```bash
# Navigate to the frontend directory where sqlscript.txt is located
cd /workspaces/frontend

# Create database and tables
mysql -u root -p < sqlscript.txt
```

When prompted, enter your MySQL root password.

### Step 4: Verify Database Setup
```bash
mysql -u root -p
> USE ekart_db;
> SHOW TABLES;
```

You should see the following tables:
- customer
- product
- card
- cart
- cart_product
- order
- ordered_product
- payment
- audit_log

---

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd /workspaces/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` with your local configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ekart_db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=ekart_secret_key_2024
JWT_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Start Backend Server

#### Development Mode (with auto-reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   EKart E-commerce Backend API         ║
║   Server running on port 5000          ║
║   Environment: development             ║
╚════════════════════════════════════════╝
```

### Step 5: Test Backend
```bash
# In a new terminal, test the health endpoint
curl http://localhost:5000/health

# You should get:
# {"status":"ok","timestamp":"...","uptime":...}
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd /workspaces/frontend/src
```

### Step 2: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 3: Create Environment Configuration

Create or edit `.env` file in the `src` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

Update the API URL in `src/shared/services/apiClient.ts` if needed:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Step 4: Verify Frontend Dependencies

Make sure the following packages are installed:
```bash
npm list react-router-dom axios bootstrap framer-motion lucide-react
```

### Step 5: Start Frontend Development Server

From `/workspaces/frontend/src` directory:
```bash
npm start
```

The React app should open automatically at `http://localhost:3000`

---

## Running the Application

### Start Everything (3 Terminal Windows)

#### Terminal 1: Start MySQL (if not auto-started)
```bash
# macOS
brew services start mysql

# Ubuntu/Debian
sudo systemctl start mysql

# Windows - already running as service
```

#### Terminal 2: Start Backend
```bash
cd /workspaces/backend
npm run dev
```

Expected output:
```
✓ Database connection successful
╔════════════════════════════════════════╗
║   EKart E-commerce Backend API         ║
║   Server running on port 5000          ║
╚════════════════════════════════════════╝
```

#### Terminal 3: Start Frontend
```bash
cd /workspaces/frontend/src
npm start
```

Expected output:
```
Compiled successfully!

You can now view bootstrapfront in the browser.

Local:  http://localhost:3000
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Docs**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/health

---

## API Integration

### Frontend API Services

The frontend uses dedicated service files for API calls:

#### 1. **Customer Service** (`customerService.ts`)
```typescript
import customerService from '../services/customerService';

// Register
await customerService.register({
  emailId: 'user@example.com',
  name: 'John Doe',
  password: 'SecurePass@123',
  phoneNumber: '9876543210',
  address: '123 Main St'
});

// Login
const result = await customerService.login({
  emailId: 'user@example.com',
  password: 'SecurePass@123'
});

// Token is automatically saved
```

#### 2. **Product Service** (`productService.ts`)
```typescript
import productService from '../services/productService';

// Get all products
const products = await productService.getAllProducts({ 
  page: 1, 
  limit: 10 
});

// Search products
const results = await productService.searchProducts({ 
  query: 'iPhone' 
});

// Get categories
const categories = await productService.getCategories();
```

#### 3. **Cart Service** (`cartService.ts`)
```typescript
import cartService from '../services/cartService';

// Add to cart
await cartService.addProductToCart(1, 2); // productId, quantity

// Get cart
const cartItems = await cartService.getCartProducts();

// Update quantity
await cartService.updateProductQuantity(1, 3);

// Remove from cart
await cartService.removeProductFromCart(1);
```

#### 4. **Order Service** (`orderService.ts`)
```typescript
import orderService from '../services/orderService';

// Place order
const order = await orderService.placeOrder({
  dateOfDelivery: '2024-07-01T10:00:00',
  paymentCardId: 1
});

// Get orders
const orders = await orderService.getCustomerOrders();

// Get order details
const details = await orderService.getOrderDetails(1);
```

#### 5. **Payment Service** (`paymentService.ts`)
```typescript
import paymentService from '../services/paymentService';

// Add card
await paymentService.addCard({
  cardType: 'CREDIT',
  cardNumber: '1234567890123456',
  nameOnCard: 'JOHN DOE',
  cvv: 123,
  expiryDate: '2025-12-31'
});

// Get all cards
const cards = await paymentService.getAllCards();

// Get cards by type
const creditCards = await paymentService.getCreditCards();
```

### API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {...},
  "timestamp": "2024-06-17T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description",
  "timestamp": "2024-06-17T10:30:00.000Z"
}
```

### Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is automatically added to all subsequent requests
5. If token expires (401), user is redirected to login

---

## Testing

### Test Sample Data

The database includes sample data for testing:

**Sample Customers:**
- Email: john@example.com
- Password: Password123! (after reset)
- Email: jane@example.com
- Password: Password123!

**Sample Products:**
- iPhone 14 Pro - $999.99
- Samsung Galaxy S23 - $899.99
- Sony Headphones - $399.99
- MacBook Pro 14 - $1999.99
- And 6 more products

**Sample Cards:**
- Card Number: 1234567890123456 (for john@example.com)
- Card Number: 2222222222222222 (for jane@example.com)

### Testing Workflow

#### 1. Register New User
```bash
POST http://localhost:5000/api/customer-api/register
{
  "emailId": "testuser@example.com",
  "name": "Test User",
  "password": "TestPass@123",
  "phoneNumber": "9123456789",
  "address": "Test Address"
}
```

#### 2. Login
```bash
POST http://localhost:5000/api/customer-api/login
{
  "emailId": "testuser@example.com",
  "password": "TestPass@123"
}
```

#### 3. Browse Products
```bash
GET http://localhost:5000/api/product-api/products?page=1&limit=10
```

#### 4. Add to Cart
```bash
POST http://localhost:5000/api/cart-api/products
Headers: Authorization: Bearer <token>
{
  "productId": 1,
  "quantity": 2
}
```

#### 5. Place Order
```bash
POST http://localhost:5000/api/order-api/place-order
Headers: Authorization: Bearer <token>
{
  "dateOfDelivery": "2024-07-01T10:00:00",
  "paymentCardId": 1
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Error
**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
```bash
# Check if MySQL is running
# On macOS
brew services list | grep mysql

# On Ubuntu
sudo systemctl status mysql

# Start MySQL
# On macOS
brew services start mysql

# On Ubuntu
sudo systemctl start mysql
```

#### 2. Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Kill process on port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=5001 npm run dev
```

#### 3. CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Ensure backend CORS_ORIGIN includes frontend URL
- Check `.env` file: `CORS_ORIGIN=http://localhost:3000`
- Restart backend server

#### 4. Authentication Token Issues
**Error:** `Invalid or expired token`

**Solution:**
```bash
# Clear localStorage in browser console
localStorage.clear();

# Reload page and login again
```

#### 5. Database Import Error
**Error:** `error near line ...` when importing sqlscript.txt

**Solution:**
```bash
# Try with explicit encoding
mysql -u root -p --default-character-set=utf8mb4 ekart_db < sqlscript.txt

# Or import line by line
mysql -u root -p ekart_db < sqlscript.txt
```

#### 6. Node Modules Issues
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## Performance Tips

### Optimization

1. **Database Indexing**: Already configured in sqlscript.txt
2. **Connection Pooling**: Configured in database.js
3. **Caching**: Implement Redis for production
4. **CDN**: Use CDN for static assets in production

### Monitoring

```bash
# Monitor Node.js process
npm install -g pm2
pm2 start src/server.js

# Monitor with dashboard
pm2 monit

# View logs
pm2 logs
```

---

## Production Deployment

### Prerequisites
- Hosting platform (AWS, Heroku, DigitalOcean, etc.)
- Domain name
- SSL certificate

### Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Enable HTTPS
- [ ] Set up logging and monitoring
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

---

## Support and Documentation

- **Backend README**: `/workspaces/backend/README.md`
- **Database Schema**: `/workspaces/frontend/sqlscript.txt`
- **API Docs**: http://localhost:5000/api/docs

---

## Quick Reference

### Directory Structure
```
/workspaces/
├── frontend/
│   ├── src/
│   │   ├── shared/services/
│   │   │   ├── apiClient.ts
│   │   │   ├── customerService.ts
│   │   │   ├── productService.ts
│   │   │   ├── cartService.ts
│   │   │   ├── orderService.ts
│   │   │   └── paymentService.ts
│   │   └── ...
│   └── sqlscript.txt
└── backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── routes/
    │   ├── middleware/
    │   ├── utils/
    │   └── server.js
    ├── .env
    ├── package.json
    └── README.md
```

### Key Commands

```bash
# Start everything
Terminal 1: brew services start mysql (or equivalent)
Terminal 2: cd /workspaces/backend && npm run dev
Terminal 3: cd /workspaces/frontend/src && npm start

# Test API
curl http://localhost:5000/health
curl http://localhost:5000/api/docs

# View database
mysql -u root -p
> USE ekart_db;
> SELECT * FROM customer;
```

---

## Next Steps

1. ✅ Setup complete
2. Register a new user
3. Browse products
4. Add items to cart
5. Place an order
6. Check order history

---

For more detailed information, refer to individual README files in backend and frontend directories.

**Happy Shopping with EKart! 🛍️**
