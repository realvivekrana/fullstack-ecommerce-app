const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Read environment variables
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

// Schemas
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
  { 
    name: 'Electronics', 
    slug: 'electronics', 
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', 
    description: 'Latest electronic gadgets and devices' 
  },
  { 
    name: 'Fashion', 
    slug: 'fashion', 
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', 
    description: 'Trendy fashion and apparel' 
  },
  { 
    name: 'Home & Living', 
    slug: 'home-living', 
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400', 
    description: 'Home essentials and decor' 
  },
  { 
    name: 'Sports', 
    slug: 'sports', 
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400', 
    description: 'Sports and fitness equipment' 
  },
  { 
    name: 'Books', 
    slug: 'books', 
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 
    description: 'Books and literature' 
  },
  { 
    name: 'Beauty', 
    slug: 'beauty', 
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 
    description: 'Beauty and cosmetic products' 
  },
]

const products = [
  // Electronics
  {
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life. Experience crystal-clear audio quality with deep bass and crisp highs.',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    category: 'Electronics',
    brand: 'AudioPro',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800',
    ],
    stock: 50,
    rating: 4.8,
    reviews: [],
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Noise Cancellation': 'Active ANC',
    },
    features: ['Active Noise Cancellation', 'Premium Sound Quality', 'Comfortable Fit', 'Long Battery Life'],
    featured: true,
  },
  {
    title: 'Smart Watch Series 7',
    description: 'Advanced fitness tracking, heart rate monitoring, and smartphone notifications. Stay connected and healthy with this cutting-edge smartwatch.',
    price: 399.99,
    originalPrice: 499.99,
    discount: 20,
    category: 'Electronics',
    brand: 'TechWear',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
    ],
    stock: 75,
    rating: 4.6,
    reviews: [],
    specifications: {
      'Display': '1.9" AMOLED',
      'Battery': '48 hours',
      'Water Resistance': '5ATM',
      'Sensors': 'Heart Rate, GPS, SpO2',
    },
    features: ['Fitness Tracking', 'Heart Rate Monitor', 'GPS Navigation', 'Water Resistant'],
    featured: true,
  },
  {
    title: '4K Ultra HD Smart TV 55"',
    description: 'Immersive 4K viewing experience with HDR support and smart features. Stream your favorite content in stunning detail.',
    price: 799.99,
    originalPrice: 1099.99,
    discount: 27,
    category: 'Electronics',
    brand: 'VisionTech',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
      'https://images.unsplash.com/photo-1593359863503-f598b8f5f4d3?w=800',
      'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800',
    ],
    stock: 30,
    rating: 4.7,
    reviews: [],
    specifications: {
      'Screen Size': '55 inches',
      'Resolution': '4K Ultra HD',
      'HDR': 'Yes',
      'Smart Features': 'Built-in',
    },
    features: ['4K Resolution', 'HDR Support', 'Smart TV', 'Voice Control'],
    featured: false,
  },
  {
    title: 'Wireless Gaming Mouse',
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons. Dominate your games with lag-free wireless performance.',
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    category: 'Electronics',
    brand: 'GameGear',
    images: [
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800',
    ],
    stock: 100,
    rating: 4.5,
    reviews: [],
    specifications: {
      'DPI': 'Up to 16000',
      'Buttons': '8 Programmable',
      'Battery': '70 hours',
      'Connectivity': 'Wireless 2.4GHz',
    },
    features: ['High Precision', 'RGB Lighting', 'Programmable Buttons', 'Long Battery'],
    featured: false,
  },

  // Fashion
  {
    title: 'Premium Leather Jacket',
    description: 'Genuine leather jacket with classic design. Perfect for any occasion, combining style and comfort.',
    price: 249.99,
    originalPrice: 349.99,
    discount: 29,
    category: 'Fashion',
    brand: 'StyleCo',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
    ],
    stock: 40,
    rating: 4.9,
    reviews: [],
    specifications: {
      'Material': '100% Genuine Leather',
      'Lining': 'Polyester',
      'Closure': 'Zipper',
      'Care': 'Professional Clean Only',
    },
    features: ['Genuine Leather', 'Classic Design', 'Multiple Pockets', 'Comfortable Fit'],
    featured: true,
  },
  {
    title: 'Designer Sneakers',
    description: 'Comfortable and stylish sneakers for everyday wear. Premium materials and modern design.',
    price: 129.99,
    originalPrice: 179.99,
    discount: 28,
    category: 'Fashion',
    brand: 'UrbanStep',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
    ],
    stock: 80,
    rating: 4.6,
    reviews: [],
    specifications: {
      'Upper Material': 'Canvas & Leather',
      'Sole': 'Rubber',
      'Closure': 'Lace-up',
      'Weight': '350g per shoe',
    },
    features: ['Comfortable', 'Breathable', 'Durable', 'Stylish Design'],
    featured: false,
  },

  // Home & Living
  {
    title: 'Modern Coffee Table',
    description: 'Elegant coffee table with tempered glass top and wooden legs. Perfect centerpiece for your living room.',
    price: 199.99,
    originalPrice: 299.99,
    discount: 33,
    category: 'Home & Living',
    brand: 'HomeStyle',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
    ],
    stock: 25,
    rating: 4.7,
    reviews: [],
    specifications: {
      'Dimensions': '120cm x 60cm x 45cm',
      'Material': 'Tempered Glass & Wood',
      'Weight Capacity': '50kg',
      'Assembly': 'Required',
    },
    features: ['Modern Design', 'Tempered Glass', 'Sturdy Construction', 'Easy to Clean'],
    featured: true,
  },
  {
    title: 'Luxury Bedding Set',
    description: 'Premium cotton bedding set including duvet cover, pillowcases, and fitted sheet. Hotel-quality comfort.',
    price: 149.99,
    originalPrice: 219.99,
    discount: 32,
    category: 'Home & Living',
    brand: 'ComfortHome',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    ],
    stock: 60,
    rating: 4.8,
    reviews: [],
    specifications: {
      'Material': '100% Egyptian Cotton',
      'Thread Count': '800',
      'Size': 'Queen',
      'Care': 'Machine Washable',
    },
    features: ['Premium Cotton', 'Soft & Breathable', 'Durable', 'Easy Care'],
    featured: false,
  },

  // Sports
  {
    title: 'Professional Yoga Mat',
    description: 'Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and floor exercises.',
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
    category: 'Sports',
    brand: 'FitLife',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800',
    ],
    stock: 150,
    rating: 4.5,
    reviews: [],
    specifications: {
      'Dimensions': '183cm x 61cm',
      'Thickness': '6mm',
      'Material': 'TPE',
      'Weight': '1.2kg',
    },
    features: ['Non-Slip Surface', 'Extra Cushioning', 'Eco-Friendly', 'Lightweight'],
    featured: false,
  },
  {
    title: 'Adjustable Dumbbells Set',
    description: 'Space-saving adjustable dumbbells with quick weight change system. Perfect for home workouts.',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    category: 'Sports',
    brand: 'PowerFit',
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800',
    ],
    stock: 45,
    rating: 4.7,
    reviews: [],
    specifications: {
      'Weight Range': '5-52.5 lbs per dumbbell',
      'Material': 'Steel & Rubber',
      'Adjustment': 'Quick-Change Dial',
      'Warranty': '2 years',
    },
    features: ['Adjustable Weight', 'Space Saving', 'Durable', 'Quick Change System'],
    featured: true,
  },

  // Books
  {
    title: 'The Art of Programming',
    description: 'Comprehensive guide to modern programming practices. Perfect for beginners and experienced developers.',
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    category: 'Books',
    brand: 'TechBooks',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
    ],
    stock: 200,
    rating: 4.8,
    reviews: [],
    specifications: {
      'Pages': '450',
      'Format': 'Hardcover',
      'Language': 'English',
      'Publisher': 'Tech Press',
    },
    features: ['Comprehensive Guide', 'Practical Examples', 'Expert Tips', 'Updated Content'],
    featured: false,
  },

  // Beauty
  {
    title: 'Luxury Skincare Set',
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer. Natural ingredients for glowing skin.',
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    category: 'Beauty',
    brand: 'GlowBeauty',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800',
    ],
    stock: 90,
    rating: 4.9,
    reviews: [],
    specifications: {
      'Products': '4-piece set',
      'Skin Type': 'All types',
      'Ingredients': 'Natural & Organic',
      'Cruelty-Free': 'Yes',
    },
    features: ['Natural Ingredients', 'Complete Routine', 'Cruelty-Free', 'Dermatologist Tested'],
    featured: true,
  },
]

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    console.log('Clearing existing data...')
    await User.deleteMany({})
    await Category.deleteMany({})
    await Product.deleteMany({})
    console.log('Existing data cleared')

    // Create admin user
    console.log('Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await User.create({
      name: 'Admin User',
      email: 'admin@premiumstore.com',
      password: hashedPassword,
      role: 'admin',
      wishlist: [],
      orderHistory: [],
      addresses: [],
    })
    console.log('Admin user created')

    // Create categories
    console.log('Creating categories...')
    await Category.insertMany(categories)
    console.log(`${categories.length} categories created`)

    // Create products
    console.log('Creating products...')
    await Product.insertMany(products)
    console.log(`${products.length} products created`)

    console.log('\n✅ Database seeded successfully!')
    console.log('\nAdmin credentials:')
    console.log('Email: admin@premiumstore.com')
    console.log('Password: admin123')
    console.log('\nAll products have 2-3 high-quality images from Unsplash')

  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('\nDatabase connection closed')
  }
}

seedDatabase()
