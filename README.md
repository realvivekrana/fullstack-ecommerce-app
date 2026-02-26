# Premium E-commerce Store - Full Stack

A complete, production-ready e-commerce platform built with Next.js 14, React, TypeScript, Tailwind CSS, and MongoDB.

## 🚀 Features

### Frontend
- 🛍️ Complete shopping experience with cart and wishlist
- 🔐 JWT-based authentication (register, login, logout)
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🌙 Dark mode support
- 🎨 Modern UI with Framer Motion animations
- 🔍 Advanced product filtering and search
- ⭐ Product reviews and ratings
- 📦 Order tracking and history
- 🔔 Toast notifications

### Backend
- 🗄️ MongoDB database with Mongoose ODM
- 🔒 Secure password hashing with bcrypt
- 🎫 JWT token authentication
- 📡 RESTful API architecture
- 👤 User management with roles (user/admin)
- 🛒 Persistent cart in database
- 📋 Order management system
- ⭐ Review system

### Admin Features
- 📊 Dashboard with analytics
- ➕ Add/Edit/Delete products
- 📦 Manage orders and update status
- 👥 View customer information
- 📁 Category management

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios
- React Hot Toast

**Backend:**
- Next.js API Routes
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Database Setup

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running on your machine
# Default connection: mongodb://localhost:27017/premium-ecommerce
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `.env.local` with your connection string

### 3. Environment Variables

The `.env.local` file is already created with default values:

```env
MONGODB_URI=mongodb://localhost:27017/premium-ecommerce
JWT_SECRET=premium-ecommerce-jwt-secret-key-2024
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=nextauth-secret-key-2024
ADMIN_EMAIL=admin@premiumstore.com
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

**For production, change these values!**

### 4. Seed Database

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- Admin user (email: admin@premiumstore.com, password: admin123)
- 6 product categories
- 10 sample products

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── cart/          # Cart management
│   │   │   ├── orders/        # Order management
│   │   │   ├── wishlist/      # Wishlist endpoints
│   │   │   └── categories/    # Category endpoints
│   │   ├── admin/             # Admin dashboard
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout page
│   │   ├── login/             # Auth pages
│   │   ├── orders/            # Order history
│   │   ├── product/[id]/      # Product details
│   │   ├── shop/              # Product listing
│   │   └── ...                # Other pages
│   ├── components/            # Reusable components
│   ├── context/               # React Context (Auth, Cart, etc.)
│   ├── lib/                   # Utilities
│   │   ├── mongodb.ts         # Database connection
│   │   ├── auth.ts            # JWT utilities
│   │   ├── api-client.ts      # API client
│   │   └── api-response.ts    # Response helpers
│   ├── models/                # Mongoose models
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Cart.ts
│   │   └── Category.ts
│   └── types/                 # TypeScript types
├── scripts/
│   └── seed.js                # Database seeding script
└── ...
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status (admin)

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist` - Remove from wishlist

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)

## 🗄️ Database Models

### User
- name, email, password (hashed)
- phone, addresses
- role (user/admin)
- wishlist, orderHistory
- timestamps

### Product
- title, description
- price, originalPrice, discount
- category, brand
- images array
- stock quantity
- rating, reviews
- specifications, features
- featured flag
- timestamps

### Order
- user reference
- orderNumber (auto-generated)
- items array
- shippingAddress
- paymentMethod, paymentStatus
- orderStatus
- subtotal, tax, shippingCost, totalAmount
- timestamps

### Cart
- user reference
- items array (product, quantity, price)
- totalPrice (auto-calculated)
- timestamps

### Category
- name, slug
- image, description
- timestamps

## 👤 User Accounts

### Test Admin Account
- Email: `admin@premiumstore.com`
- Password: `admin123`
- Access: Admin dashboard, product management

### Create User Account
Register at `/login` page

## 🎨 Features in Detail

### Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control

### Shopping Cart
- Persistent cart in database
- Real-time updates
- Quantity management
- Automatic total calculation

### Product Management
- Advanced filtering (category, price, brand, rating)
- Search functionality
- Sorting options
- Stock management
- Review system

### Order System
- Complete checkout flow
- Order history tracking
- Status updates
- Email notifications (ready to implement)

### Admin Dashboard
- Sales analytics
- Order management
- Product CRUD operations
- Customer overview

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Update `.env.local` with production values:
- Use MongoDB Atlas connection string
- Generate secure JWT_SECRET
- Update NEXTAUTH_URL to your domain

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- XSS protection
- CORS configuration

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px
- Touch-friendly interface
- Optimized images

## 🎯 Performance

- Next.js Image optimization
- Code splitting
- Lazy loading
- API response caching
- Database indexing

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 License

MIT License - Free for personal and commercial use

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📧 Support

For issues or questions, open a GitHub issue.

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- Tailwind CSS for styling
- All open-source contributors

---

**Built with ❤️ using Next.js, React, and MongoDB**
