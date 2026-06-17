# EKart - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
```bash
node --version          # Should be v14+
npm --version           # Should be v6+
mysql --version         # Should be v8.0+
```

---

## Step 1: Setup Database (2 min)

```bash
# Open MySQL
mysql -u root -p

# Enter your MySQL password, then run:
exit

# Import database schema
cd /workspaces/frontend
mysql -u root -p < sqlscript.txt
```

Verify:
```bash
mysql -u root -p
> USE ekart_db;
> SHOW TABLES;
> exit
```

---

## Step 2: Start Backend (1 min)

```bash
cd /workspaces/backend

# Install dependencies (first time only)
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MySQL password

# Start server
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

Test: `curl http://localhost:5000/health`

---

## Step 3: Start Frontend (2 min)

```bash
cd /workspaces/frontend/src

# Install dependencies (first time only)
npm install --legacy-peer-deps

# Start development server
npm start
```

Expected output:
```
Compiled successfully!

You can now view bootstrapfront in the browser.
Local: http://localhost:3000
```

---

## Step 4: Test the App (Optional)

### Register New User
1. Go to http://localhost:3000
2. Click "Register Here"
3. Fill in details:
   - Email: testuser@example.com
   - Name: Test User
   - Password: TestPass@123
   - Phone: 9876543210
   - Address: Test Street

### Login
1. Login with your email and password
2. You'll get an authentication token

### Browse Products
- Click on products to see details
- Search for products using the search bar
- Filter by category or brand

### Add to Cart
1. Click on a product
2. Enter quantity
3. Click "Add to Cart"

### Checkout (Requires Card)
1. Go to cart
2. Click "Proceed to Checkout"
3. Add a payment card first if needed
4. Select delivery date
5. Choose payment method
6. Click "Place Order"

### View Orders
1. Go to "My Orders"
2. See all your orders with details

---

## 🔑 Quick Reference

### URLs
| Component | URL |
|-----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| API Docs | http://localhost:5000/api/docs |
| Health | http://localhost:5000/health |

### Test Credentials (Sample Data)
```
Email: john@example.com
Password: (already hashed in DB)

Email: jane@example.com
Password: (already hashed in DB)
```

### Directories
```
Frontend:  /workspaces/frontend/src
Backend:   /workspaces/backend/src
Database:  /workspaces/frontend/sqlscript.txt
```

### Key Files
| File | Purpose |
|------|---------|
| `.env` (backend) | Configuration |
| `sqlscript.txt` | Database schema |
| `API_ENDPOINTS.md` | API reference |
| `SETUP_GUIDE.md` | Detailed setup |
| `PROJECT_ARCHITECTURE.md` | Architecture docs |

---

## 🛠️ Common Commands

### Backend
```bash
npm run dev      # Development with auto-reload
npm start        # Production mode
npm test         # Run tests
npm run lint     # Check code quality
```

### Frontend
```bash
npm start        # Development server
npm run build    # Build for production
npm test         # Run tests
npm run eject    # Eject from CRA (not reversible)
```

### Database
```bash
mysql -u root -p           # Connect to MySQL
> USE ekart_db;            # Select database
> SHOW TABLES;             # List all tables
> SELECT * FROM customer;  # View customers
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port (macOS/Linux)
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```bash
# Start MySQL
# macOS
brew services start mysql

# Ubuntu/Debian
sudo systemctl start mysql
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps (frontend)
npm install (backend)
```

### Clear Browser Cache
```bash
# In browser DevTools
DevTools > Application > LocalStorage > Clear All
```

---

## 📚 Learn More

- **Full Setup Guide**: `SETUP_GUIDE.md`
- **API Reference**: `API_ENDPOINTS.md`
- **Architecture**: `PROJECT_ARCHITECTURE.md`
- **Backend Docs**: `/backend/README.md`

---

## 💡 Tips

1. **Keep 3 terminal windows open**: MySQL, Backend, Frontend
2. **Check logs** when something doesn't work
3. **Use browser DevTools** to debug frontend issues
4. **Test API with cURL** to debug backend
5. **Read error messages** carefully - they usually tell you the issue

---

## 🎯 Next Steps

After getting the app running:
1. [ ] Explore the codebase
2. [ ] Try all user flows
3. [ ] Modify and customize
4. [ ] Add new features
5. [ ] Deploy to production

---

## ⚡ Performance Tips

- Use Chrome DevTools to check performance
- Monitor database queries
- Keep API responses under 1s
- Optimize images and assets
- Use browser caching

---

## 🚨 Important

- **Never commit `.env` file** with secrets
- **Change JWT_SECRET** before production
- **Use HTTPS** in production
- **Keep dependencies updated**
- **Regular database backups**

---

## 📞 Need Help?

1. Check `SETUP_GUIDE.md` for detailed troubleshooting
2. Review `API_ENDPOINTS.md` for API details
3. Check backend console for server errors
4. Check browser console for frontend errors
5. Check database if data operations fail

---

**Version**: 1.0.0  
**Ready to develop!** 🚀
