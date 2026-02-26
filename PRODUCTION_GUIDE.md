# 🏭 Production Optimization Guide

Complete guide to optimize your e-commerce platform for production.

---

## ⚡ Performance Optimization

### 1. Image Optimization

**Update next.config.js:**

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'your-cdn-domain.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

### 2. Database Indexing

Add indexes to MongoDB for better query performance:

```javascript
// In your models or migration script
// User indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Product indexes
db.products.createIndex({ category: 1 })
db.products.createIndex({ brand: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ rating: -1 })
db.products.createIndex({ featured: 1 })
db.products.createIndex({ title: 'text', description: 'text' })

// Order indexes
db.orders.createIndex({ user: 1, createdAt: -1 })
db.orders.createIndex({ orderStatus: 1 })
db.orders.createIndex({ orderNumber: 1 }, { unique: true })

// Cart indexes
db.carts.createIndex({ user: 1 }, { unique: true })
```

### 3. API Response Caching

**Add caching headers:**

```typescript
// src/app/api/products/route.ts
export async function GET(request: NextRequest) {
  const response = await getProducts()
  
  return new NextResponse(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  })
}
```

### 4. Code Splitting

Already implemented with Next.js App Router, but ensure:

```typescript
// Use dynamic imports for heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR if not needed
})
```

### 5. Bundle Size Optimization

```bash
# Analyze bundle size
npm install @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})

# Run analysis
ANALYZE=true npm run build
```

---

## 🔒 Security Enhancements

### 1. Rate Limiting

Install rate limiting middleware:

```bash
npm install express-rate-limit
```

Create middleware:

```typescript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  message: 'Too many login attempts, please try again later.',
})
```

### 2. Input Validation

Install validator:

```bash
npm install validator
```

Add validation:

```typescript
import validator from 'validator'

// Validate email
if (!validator.isEmail(email)) {
  return errorResponse('Invalid email format')
}

// Sanitize input
const sanitizedInput = validator.escape(userInput)
```

### 3. CORS Configuration

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}
```

### 4. Environment Variable Validation

```typescript
// src/lib/env.ts
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
]

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})

// Validate JWT_SECRET length
if (process.env.JWT_SECRET!.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters')
}
```

---

## 📊 Monitoring & Analytics

### 1. Error Tracking

Install Sentry:

```bash
npm install @sentry/nextjs
```

Configure:

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

### 2. Performance Monitoring

```typescript
// src/lib/analytics.ts
export const trackEvent = (eventName: string, properties?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

// Usage
trackEvent('purchase', {
  transaction_id: order.id,
  value: order.total,
  currency: 'USD',
})
```

### 3. Database Monitoring

MongoDB Atlas provides:
- Query performance insights
- Slow query alerts
- Connection monitoring
- Storage metrics

Enable in Atlas dashboard.

---

## 🚀 Scalability

### 1. Database Connection Pooling

```typescript
// src/lib/mongodb.ts
const opts = {
  bufferCommands: false,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
}

await mongoose.connect(MONGODB_URI, opts)
```

### 2. Redis Caching (Optional)

```bash
npm install redis
```

```typescript
// src/lib/redis.ts
import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL,
})

client.on('error', (err) => console.log('Redis Client Error', err))

await client.connect()

// Cache products
export async function getCachedProducts() {
  const cached = await client.get('products:all')
  if (cached) return JSON.parse(cached)
  
  const products = await Product.find()
  await client.setEx('products:all', 3600, JSON.stringify(products))
  
  return products
}
```

### 3. CDN for Static Assets

Use Vercel's Edge Network or configure custom CDN:

```typescript
// next.config.js
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yourdomain.com' 
    : '',
}
```

---

## 📧 Email Notifications

### Setup SendGrid

```bash
npm install @sendgrid/mail
```

```typescript
// src/lib/email.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendOrderConfirmation(order: any, user: any) {
  const msg = {
    to: user.email,
    from: 'orders@yourdomain.com',
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order Number: ${order.orderNumber}</p>
      <p>Total: $${order.totalAmount}</p>
      <a href="${process.env.NEXTAUTH_URL}/orders/${order._id}">View Order</a>
    `,
  }
  
  await sgMail.send(msg)
}
```

---

## 💳 Payment Integration

### Stripe Integration

```bash
npm install stripe @stripe/stripe-js
```

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function createPaymentIntent(amount: number) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
  })
}
```

---

## 🔍 SEO Optimization

### 1. Meta Tags

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'Premium Store - Best Online Shopping',
  description: 'Shop the latest products with amazing deals',
  keywords: 'ecommerce, shopping, online store',
  openGraph: {
    title: 'Premium Store',
    description: 'Shop the latest products',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Store',
    description: 'Shop the latest products',
  },
}
```

### 2. Sitemap

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()
  
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
    },
    {
      url: 'https://yourdomain.com/shop',
      lastModified: new Date(),
    },
    ...products.map((product) => ({
      url: `https://yourdomain.com/product/${product.id}`,
      lastModified: product.updatedAt,
    })),
  ]
}
```

### 3. Robots.txt

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

---

## 🧪 Testing

### Unit Tests

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import ProductCard from '@/components/ProductCard'

describe('ProductCard', () => {
  it('renders product information', () => {
    const product = {
      id: '1',
      name: 'Test Product',
      price: 99.99,
    }
    
    render(<ProductCard product={product} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })
})
```

### API Tests

```bash
npm install --save-dev supertest
```

```typescript
// __tests__/api/products.test.ts
import request from 'supertest'

describe('Products API', () => {
  it('GET /api/products returns products', async () => {
    const response = await request('http://localhost:3000')
      .get('/api/products')
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data.products)).toBe(true)
  })
})
```

---

## 📱 Progressive Web App (PWA)

```bash
npm install next-pwa
```

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // your config
})
```

---

## 🔄 Backup Strategy

### 1. Database Backups

MongoDB Atlas automatic backups:
- Daily snapshots
- Point-in-time recovery
- 7-day retention (free tier)

### 2. Code Backups

- GitHub repository (primary)
- Regular commits
- Tagged releases
- Branch protection

### 3. Environment Variables

- Store securely in password manager
- Document in team wiki
- Never commit to repository

---

## 📈 Performance Metrics

### Target Metrics

- **First Contentful Paint:** < 1.8s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.8s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### Monitoring Tools

- Vercel Analytics
- Google PageSpeed Insights
- Lighthouse CI
- Web Vitals

---

## ✅ Production Checklist

### Pre-Launch

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance optimized
- [ ] SEO configured
- [ ] Analytics setup
- [ ] Error tracking enabled
- [ ] Backups configured
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Email notifications working

### Post-Launch

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Monitor database performance
- [ ] Check API response times
- [ ] Review security logs
- [ ] Test backup restoration
- [ ] Update documentation

---

## 🎯 Continuous Improvement

### Weekly Tasks

- Review error logs
- Check performance metrics
- Monitor database usage
- Review user feedback
- Update dependencies

### Monthly Tasks

- Security audit
- Performance optimization
- Database optimization
- Backup testing
- Feature planning

---

**Your platform is now production-ready and optimized! 🚀**
