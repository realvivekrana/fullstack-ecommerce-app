# 🚀 Deployment Guide

Complete guide to deploy your e-commerce platform to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] MongoDB Atlas account created
- [ ] Environment variables configured
- [ ] Build succeeds without errors
- [ ] API endpoints tested
- [ ] Security review completed

---

## 🌐 Deploy to Vercel (Recommended)

### Step 1: Prepare Your Repository

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Full-stack e-commerce platform"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### Step 2: Setup MongoDB Atlas

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to your users
   - Click "Create"

3. **Setup Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set permissions to "Read and write to any database"
   - Save credentials securely

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `premium-ecommerce`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/premium-ecommerce?retryWrites=true&w=majority
```

### Step 3: Deploy to Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/premium-ecommerce
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret-min-32-characters
   NODE_ENV=production
   ```

   **Generate Secure Secrets:**
   ```bash
   # Generate JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Generate NEXTAUTH_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Your site will be live at `https://your-project.vercel.app`

### Step 4: Seed Production Database

After deployment, seed your production database:

```bash
# Update .env.local with production MongoDB URI temporarily
MONGODB_URI=your-production-mongodb-uri npm run seed

# Or create a separate seed script for production
```

### Step 5: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

---

## 🐳 Deploy with Docker

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/premium-ecommerce
      - JWT_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-nextauth-secret
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Deploy

```bash
docker-compose up -d
```

---

## ☁️ Deploy to AWS

### Using AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect GitHub repository

2. **Configure Build**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Add Environment Variables**
   - Same as Vercel setup

4. **Deploy**
   - Save and deploy

---

## 🔒 Security Checklist

### Before Going Live:

- [ ] Change all default passwords
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Enable MongoDB authentication
- [ ] Whitelist specific IPs (if possible)
- [ ] Review all API endpoints
- [ ] Test authentication flows
- [ ] Validate all user inputs
- [ ] Sanitize database queries
- [ ] Add CSP headers
- [ ] Enable security headers

### Recommended Security Headers

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## 📊 Post-Deployment

### 1. Verify Deployment

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Login works
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Orders are created
- [ ] Admin panel accessible
- [ ] All API endpoints respond

### 2. Setup Monitoring

**Vercel Analytics:**
- Enable in Vercel dashboard
- Monitor performance
- Track errors

**MongoDB Atlas Monitoring:**
- Check database metrics
- Monitor query performance
- Set up alerts

### 3. Setup Backups

**MongoDB Atlas:**
- Enable automatic backups
- Configure backup schedule
- Test restore process

### 4. Performance Optimization

- Enable Vercel Edge Network
- Configure caching headers
- Optimize images
- Enable compression
- Monitor Core Web Vitals

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys
```

### Preview Deployments

- Every pull request gets a preview URL
- Test changes before merging
- Share with team for review

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Check build logs in Vercel
# Common issues:
- Missing environment variables
- TypeScript errors
- Dependency issues

# Fix locally first:
npm run build
```

### Database Connection Issues

```bash
# Check:
- MongoDB URI is correct
- Database user has permissions
- IP whitelist includes 0.0.0.0/0
- Network access is configured
```

### API Errors

```bash
# Check:
- Environment variables are set
- JWT_SECRET is configured
- API routes are deployed
- CORS is configured correctly
```

---

## 📈 Scaling

### Vercel Pro Features

- Increased bandwidth
- More build minutes
- Team collaboration
- Advanced analytics
- Priority support

### MongoDB Atlas Scaling

- Upgrade cluster tier
- Enable auto-scaling
- Add read replicas
- Configure sharding

### CDN Configuration

- Use Vercel Edge Network
- Configure caching
- Optimize assets
- Enable compression

---

## 💰 Cost Estimation

### Free Tier (Hobby)

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Free SSL
- **Cost: $0**

**MongoDB Atlas:**
- 512MB storage
- Shared RAM
- Shared CPU
- **Cost: $0**

**Total: $0/month** (suitable for development/small projects)

### Production Tier

**Vercel Pro:**
- 1TB bandwidth
- Advanced features
- **Cost: $20/month**

**MongoDB Atlas M10:**
- 10GB storage
- 2GB RAM
- **Cost: $57/month**

**Total: ~$77/month** (suitable for production)

---

## 📝 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Database seeded
- [ ] All features tested
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Security headers added
- [ ] Performance optimized

---

## 🎉 You're Live!

Your e-commerce platform is now deployed and accessible worldwide!

**Next Steps:**
1. Share your URL
2. Monitor performance
3. Gather user feedback
4. Iterate and improve

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Next.js Docs: https://nextjs.org/docs
