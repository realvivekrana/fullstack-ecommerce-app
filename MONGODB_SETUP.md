# 🗄️ MongoDB Setup Guide

## The Issue

Your application needs MongoDB to work, but MongoDB is not currently installed or running on your system.

---

## ✅ Solution Options

### Option 1: Use MongoDB Atlas (Cloud - Recommended & Easiest)

**This is the EASIEST option - No local installation needed!**

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Free Cluster**
   - Click "Build a Database"
   - Choose **FREE** tier (M0 Sandbox)
   - Select a region close to you
   - Click "Create"
   - Wait 3-5 minutes for cluster creation

3. **Setup Database Access**
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin`
   - Password: `admin123` (or create your own)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Setup Network Access**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Update .env.local**
   - Open `.env.local` file
   - Replace the MONGODB_URI line with your connection string
   - Replace `<password>` with your actual password
   - Add database name at the end:
   ```
   MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/premium-ecommerce?retryWrites=true&w=majority
   ```

7. **Seed Database**
   ```bash
   npm run seed
   ```

8. **Start Server**
   ```bash
   npm run dev
   ```

**Done! Your app will now work with MongoDB Atlas (cloud database).**

---

### Option 2: Install MongoDB Locally (Windows)

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows
   - Version: Latest
   - Package: MSI
   - Click "Download"

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Install as a Service: ✓ (checked)
   - Service Name: MongoDB
   - Data Directory: C:\Program Files\MongoDB\Server\7.0\data
   - Log Directory: C:\Program Files\MongoDB\Server\7.0\log
   - Click "Install"

3. **Verify Installation**
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # Should show: Status = Running
   ```

4. **Add MongoDB to PATH** (if needed)
   - Open System Properties → Environment Variables
   - Edit "Path" variable
   - Add: `C:\Program Files\MongoDB\Server\7.0\bin`
   - Click OK

5. **Test MongoDB**
   ```powershell
   mongod --version
   # Should show version info
   ```

6. **Seed Database**
   ```bash
   npm run seed
   ```

7. **Start Server**
   ```bash
   npm run dev
   ```

---

### Option 3: Use Docker (Advanced)

```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Seed database
npm run seed

# Start server
npm run dev
```

---

## 🔍 Troubleshooting

### MongoDB Service Not Running (Windows)

```powershell
# Start MongoDB service
net start MongoDB

# Or using Services app:
# 1. Press Win + R
# 2. Type: services.msc
# 3. Find "MongoDB"
# 4. Right-click → Start
```

### Connection Refused Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- MongoDB is not running
- Start MongoDB service (see above)
- Or use MongoDB Atlas instead

### Authentication Failed

```
Error: Authentication failed
```

**Solution:**
- Check your MongoDB Atlas username/password
- Make sure you replaced `<password>` in connection string
- Verify user has correct permissions

### Network Timeout

```
Error: Server selection timed out
```

**Solution:**
- Check internet connection (for Atlas)
- Verify IP whitelist includes 0.0.0.0/0 (for Atlas)
- Check firewall settings

---

## ✅ Quick Test

After setup, test your connection:

```bash
# Visit health check endpoint
curl http://localhost:3000/api/health

# Should return:
# {
#   "success": true,
#   "data": {
#     "status": "healthy",
#     "database": "connected",
#     "products": 10,
#     "categories": 6
#   }
# }
```

---

## 📝 Recommended: MongoDB Atlas

**Why MongoDB Atlas is better for development:**

✅ No local installation needed
✅ Works immediately
✅ Free tier available
✅ Accessible from anywhere
✅ Automatic backups
✅ Better for deployment
✅ No maintenance required

**Setup time: 5 minutes**

---

## 🆘 Still Having Issues?

1. **Check MongoDB Atlas Dashboard**
   - Is cluster running?
   - Is user created?
   - Is IP whitelisted?

2. **Check Connection String**
   - Is password correct?
   - Is database name added?
   - No spaces in the string?

3. **Check .env.local**
   - File exists?
   - MONGODB_URI is set?
   - No quotes around the value?

4. **Restart Everything**
   ```bash
   # Stop server (Ctrl+C)
   # Clear cache
   rm -rf .next
   # Restart
   npm run dev
   ```

---

## 🎯 Next Steps

After MongoDB is set up:

1. ✅ Seed database: `npm run seed`
2. ✅ Start server: `npm run dev`
3. ✅ Visit: http://localhost:3000
4. ✅ Test shop page: http://localhost:3000/shop
5. ✅ Login as admin: admin@premiumstore.com / admin123

---

**Need help? Check the connection string format:**

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

Replace:
- `USERNAME` - your database username
- `PASSWORD` - your database password
- `CLUSTER` - your cluster address
- `DATABASE_NAME` - `premium-ecommerce`
