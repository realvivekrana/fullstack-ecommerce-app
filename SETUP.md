# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Make Sure MongoDB is Running

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env.local`

### Step 3: Seed Database
```bash
npm run seed
```

This creates:
- ✅ Admin user (admin@premiumstore.com / admin123)
- ✅ 6 categories
- ✅ 10 sample products

### Step 4: Start Development Server
```bash
npm run dev
```

Open http://localhost:3000

## 🎯 What You Can Do

### As a Regular User:
1. **Browse Products** - Visit homepage or /shop
2. **Register Account** - Click user icon → Sign Up
3. **Add to Cart** - Click "Add to Cart" on any product
4. **Checkout** - Go to cart → Proceed to Checkout
5. **View Orders** - After login, go to "My Orders"

### As Admin:
1. **Login** with admin credentials:
   - Email: `admin@premiumstore.com`
   - Password: `admin123`
2. **Access Admin Dashboard** - Click user icon → Admin Panel
3. **View Analytics** - See total products, orders, revenue
4. **Manage Orders** - View and update order status

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
- Windows: Check Services for "MongoDB"
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

### Port 3000 Already in Use
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

The `.env.local` file is already configured with defaults:

```env
MONGODB_URI=mongodb://localhost:27017/premium-ecommerce
JWT_SECRET=premium-ecommerce-jwt-secret-key-2024
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=nextauth-secret-key-2024
```

**For production, generate secure secrets:**
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🧪 Test the Application

### Test User Flow:
1. Register new account at `/login`
2. Browse products at `/shop`
3. Add products to cart
4. Go to checkout
5. Place order
6. View order in "My Orders"

### Test Admin Flow:
1. Login as admin
2. Go to Admin Dashboard
3. View statistics
4. Check recent orders
5. Manage products (coming soon)

## 📚 API Testing

You can test API endpoints using tools like Postman or curl:

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
    600: '#your-color',
    700: '#your-color',
  },
}
```

### Add More Products
Run seed script again or use Admin Panel (when implemented)

### Modify Database Schema
Edit models in `src/models/` and restart server

## 🚀 Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy Database
Use MongoDB Atlas for production database

## 📞 Need Help?

- Check README.md for detailed documentation
- Open an issue on GitHub
- Check Next.js docs: https://nextjs.org/docs

---

**Happy Coding! 🎉**
