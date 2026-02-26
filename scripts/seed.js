const mongoose = require('mongoose')

// Read environment variables from .env.local file manually
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join('=').trim()
    }
  })
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/premium-ecommerce'

// Simple schemas for seeding
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  addresses: Array,
}, { timestamps: true })

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  description: String,
}, { timestamps: true })

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  category: String,
  brand: String,
  images: [String],
  stock: Number,
  rating: Number,
  reviews: Array,
  specifications: Map,
  features: [String],
  featured: Boolean,
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

const categories = [
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', description: 'Latest electronic gadgets' },
  { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', description: 'Trendy fashion items' },
  { name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400', description: 'Home essentials' },
  { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400', description: 'Sports equipment' },
  { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', description: 'Books and literature' },
  { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', description: 'Beauty products' },
]

const products = [
  {
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life. Experience crystal-clear audio quality.',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    category: 'Electronics',
    brand: 'AudioPro',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
    ],
    stock: 50,
    rating: 4.8,
    reviews: [],
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
    },
    features: ['Active Noise Cancellation', 'Premium Sound Quality', 'Comfortable Fit'],
    featured: true,
  },
  {
    title: 'Smart Watch Series 7',
    description: 'Advanced fitness tracking, heart rate monitoring, and smartphone notifications. Stay connected and healthy.',
    price: 399.99,
    originalPrice: 499.99,
    discount: 20,
    category: 'Electronics',
    brand: 'TechWear',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    stock: 30,
    rating: 4.6,
    reviews: [],
    featured: true,
  },
  {
    title: 'Premium Leather Backpack',
    description: 'Handcrafted genuine leather backpack with laptop compartment. Perfect for professionals.',
    price: 149.99,
    category: 'Fashion',
    brand: 'UrbanStyle',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
    stock: 25,
    rating: 4.7,
    reviews: [],
    featured: false,
  },
  {
    title: '4K Ultra HD Smart TV 55"',
    description: 'Stunning 4K resolution with HDR support and smart streaming capabilities. Transform your viewing experience.',
    price: 699.99,
    originalPrice: 899.99,
    discount: 22,
    category: 'Electronics',
    brand: 'VisionTech',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'],
    stock: 15,
    rating: 4.9,
    reviews: [],
    featured: true,
  },
  {
    title: 'Ergonomic Office Chair',
    description: 'Premium ergonomic chair with lumbar support and adjustable features. Work comfortably all day.',
    price: 349.99,
    category: 'Home & Living',
    brand: 'ComfortZone',
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500'],
    stock: 20,
    rating: 4.5,
    reviews: [],
    featured: false,
  },
  {
    title: 'Professional Camera Kit',
    description: 'Complete photography kit with 24MP sensor and multiple lenses. Capture stunning moments.',
    price: 1299.99,
    originalPrice: 1599.99,
    discount: 19,
    category: 'Electronics',
    brand: 'PhotoMaster',
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500'],
    stock: 10,
    rating: 4.9,
    reviews: [],
    featured: true,
  },
  {
    title: 'Running Shoes Pro',
    description: 'Lightweight running shoes with advanced cushioning technology. Run faster and longer.',
    price: 129.99,
    category: 'Sports',
    brand: 'ActiveFit',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    stock: 40,
    rating: 4.6,
    reviews: [],
    featured: false,
  },
  {
    title: 'Minimalist Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature. Perfect lighting for any task.',
    price: 79.99,
    category: 'Home & Living',
    brand: 'LightWorks',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'],
    stock: 35,
    rating: 4.4,
    reviews: [],
    featured: false,
  },
  {
    title: 'Wireless Gaming Mouse',
    description: 'High-precision wireless gaming mouse with RGB lighting and programmable buttons.',
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    category: 'Electronics',
    brand: 'GameTech',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
    stock: 45,
    rating: 4.7,
    reviews: [],
    featured: false,
  },
  {
    title: 'Yoga Mat Premium',
    description: 'Extra thick yoga mat with non-slip surface. Perfect for all yoga styles.',
    price: 49.99,
    category: 'Sports',
    brand: 'ZenFit',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
    stock: 60,
    rating: 4.5,
    reviews: [],
    featured: false,
  },
]

async function seed() {
  try {
    console.log('🌱 Starting database seed...')
    
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Category.deleteMany({})
    await Product.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Create admin user
    const bcrypt = require('bcryptjs')
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('admin123', salt)
    
    await User.create({
      name: 'Admin User',
      email: 'admin@premiumstore.com',
      password: hashedPassword,
      role: 'admin',
    })
    console.log('👤 Created admin user')

    // Create categories
    await Category.insertMany(categories)
    console.log('📁 Created categories')

    // Create products
    await Product.insertMany(products)
    console.log('📦 Created products')

    console.log('✅ Database seeded successfully!')
    console.log('\n📝 Admin credentials:')
    console.log('   Email: admin@premiumstore.com')
    console.log('   Password: admin123')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  }
}

seed()
