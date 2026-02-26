# 🚀 Quick Reference Guide

## One-Minute Setup

```bash
npm install          # Install dependencies
npm run seed        # Populate database
npm run dev         # Start server
```

Open: http://localhost:3000

---

## 🔑 Test Accounts

### Admin Account
```
Email: admin@premiumstore.com
Password: admin123
```

### Create User Account
Register at: http://localhost:3000/login

---

## 📍 Important URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Shop | http://localhost:3000/shop |
| Login | http://localhost:3000/login |
| Cart | http://localhost:3000/cart |
| Admin | http://localhost:3000/admin |
| Orders | http://localhost:3000/orders |
| Wishlist | http://localhost:3000/wishlist |

---

## 🔌 Quick API Tests

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables |
| `src/models/` | Database schemas |
| `src/app/api/` | API endpoints |
| `src/context/` | State management |
| `scripts/seed.js` | Database seeding |

---

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Database
npm run seed         # Seed database
mongod               # Start MongoDB (if local)

# Utilities
npm run lint         # Run linter
```

---

## 🐛 Quick Fixes

### MongoDB Not Connected
```bash
# Check if MongoDB is running
# Windows: Check Services
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port 3000 In Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Clear and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Database Collections

- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `carts` - Shopping carts
- `orders` - Order history

---

## 🎯 Test Flow

### User Flow:
1. Register → Login
2. Browse products → Add to cart
3. Checkout → Place order
4. View order history

### Admin Flow:
1. Login as admin
2. View dashboard
3. Check orders
4. Manage products

---

## 🔐 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/premium-ecommerce
JWT_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## 📱 Features Checklist

- [x] User authentication
- [x] Product browsing
- [x] Shopping cart
- [x] Checkout process
- [x] Order management
- [x] Wishlist
- [x] Admin dashboard
- [x] Product reviews
- [x] Dark mode
- [x] Responsive design

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#0ea5e9',
    600: '#0284c7',
  },
}
```

### Add Products
Use admin panel or run seed script

### Modify Schema
Edit files in `src/models/`

---

## 📚 Documentation

- **README.md** - Full documentation
- **SETUP.md** - Setup guide
- **API_DOCUMENTATION.md** - API reference
- **PROJECT_SUMMARY.md** - Project overview

---

## 🚀 Deploy

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### MongoDB Atlas
1. Create cluster
2. Get connection string
3. Update MONGODB_URI
4. Whitelist IPs

---

## 💡 Pro Tips

- Use MongoDB Compass for database GUI
- Use Postman for API testing
- Check browser console for errors
- Use React DevTools for debugging
- Enable dark mode for better UX

---

## 🆘 Need Help?

1. Check error messages
2. Review documentation
3. Check MongoDB connection
4. Verify environment variables
5. Clear cache and restart

---

## 📞 Quick Links

- MongoDB: https://www.mongodb.com
- Next.js: https://nextjs.org
- Tailwind: https://tailwindcss.com
- Vercel: https://vercel.com

---

**Happy Coding! 🎉**
