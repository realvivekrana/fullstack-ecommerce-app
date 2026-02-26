const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

// Read environment variables
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

// Extended product data
const brands = {
  Electronics: ['TechPro', 'AudioMaster', 'VisionTech', 'SmartGear', 'DigitalLife'],
  Fashion: ['UrbanStyle', 'ClassicWear', 'TrendSet', 'ModernFit', 'StyleHub'],
  'Home & Living': ['ComfortZone', 'HomeEssentials', 'LivingSpace', 'CozyHome', 'ModernLiving'],
  Sports: ['ActiveFit', 'SportsPro', 'FitLife', 'AthleteGear', 'PowerSports'],
  Books: ['ReadMore', 'BookWorld', 'PageTurner', 'LitHub', 'StoryTime'],
  Beauty: ['GlowUp', 'BeautyEssence', 'PureGlow', 'RadiantSkin', 'BeautyPro'],
}

const productTemplates = {
  Electronics: [
    { name: 'Wireless Headphones', basePrice: 150, desc: 'Premium sound quality with noise cancellation' },
    { name: 'Smart Watch', basePrice: 300, desc: 'Track your fitness and stay connected' },
    { name: 'Bluetooth Speaker', basePrice: 80, desc: 'Portable speaker with amazing sound' },
    { name: 'Laptop Stand', basePrice: 45, desc: 'Ergonomic aluminum laptop stand' },
    { name: 'Wireless Mouse', basePrice: 35, desc: 'Precision wireless mouse' },
    { name: 'USB-C Hub', basePrice: 60, desc: 'Multi-port USB-C adapter' },
    { name: 'Phone Case', basePrice: 25, desc: 'Protective phone case' },
    { name: 'Screen Protector', basePrice: 15, desc: 'Tempered glass screen protector' },
    { name: 'Power Bank', basePrice: 40, desc: '20000mAh portable charger' },
    { name: 'Webcam', basePrice: 70, desc: 'HD webcam for video calls' },
  ],
  Fashion: [
    { name: 'Leather Jacket', basePrice: 200, desc: 'Genuine leather jacket' },
    { name: 'Denim Jeans', basePrice: 80, desc: 'Classic fit denim jeans' },
    { name: 'Cotton T-Shirt', basePrice: 25, desc: 'Comfortable cotton t-shirt' },
    { name: 'Running Shoes', basePrice: 120, desc: 'Lightweight running shoes' },
    { name: 'Backpack', basePrice: 60, desc: 'Durable travel backpack' },
    { name: 'Sunglasses', basePrice: 90, desc: 'UV protection sunglasses' },
    { name: 'Wrist Watch', basePrice: 150, desc: 'Elegant wrist watch' },
    { name: 'Belt', basePrice: 35, desc: 'Leather belt' },
    { name: 'Wallet', basePrice: 45, desc: 'Genuine leather wallet' },
    { name: 'Cap', basePrice: 20, desc: 'Adjustable baseball cap' },
  ],
  'Home & Living': [
    { name: 'Coffee Maker', basePrice: 100, desc: 'Programmable coffee maker' },
    { name: 'Desk Lamp', basePrice: 50, desc: 'LED desk lamp' },
    { name: 'Throw Pillow', basePrice: 30, desc: 'Decorative throw pillow' },
    { name: 'Wall Clock', basePrice: 40, desc: 'Modern wall clock' },
    { name: 'Storage Box', basePrice: 25, desc: 'Fabric storage box' },
    { name: 'Picture Frame', basePrice: 20, desc: 'Wooden picture frame' },
    { name: 'Candle Set', basePrice: 35, desc: 'Scented candle set' },
    { name: 'Plant Pot', basePrice: 15, desc: 'Ceramic plant pot' },
    { name: 'Rug', basePrice: 80, desc: 'Soft area rug' },
    { name: 'Curtains', basePrice: 60, desc: 'Blackout curtains' },
  ],
  Sports: [
    { name: 'Yoga Mat', basePrice: 40, desc: 'Non-slip yoga mat' },
    { name: 'Dumbbells', basePrice: 60, desc: 'Adjustable dumbbells' },
    { name: 'Resistance Bands', basePrice: 25, desc: 'Set of resistance bands' },
    { name: 'Jump Rope', basePrice: 15, desc: 'Speed jump rope' },
    { name: 'Water Bottle', basePrice: 20, desc: 'Insulated water bottle' },
    { name: 'Gym Bag', basePrice: 45, desc: 'Spacious gym bag' },
    { name: 'Fitness Tracker', basePrice: 100, desc: 'Activity fitness tracker' },
    { name: 'Tennis Racket', basePrice: 120, desc: 'Professional tennis racket' },
    { name: 'Basketball', basePrice: 30, desc: 'Official size basketball' },
    { name: 'Cycling Gloves', basePrice: 25, desc: 'Padded cycling gloves' },
  ],
  Books: [
    { name: 'Fiction Novel', basePrice: 15, desc: 'Bestselling fiction novel' },
    { name: 'Self-Help Book', basePrice: 20, desc: 'Personal development book' },
    { name: 'Cookbook', basePrice: 25, desc: 'Gourmet cookbook' },
    { name: 'Biography', basePrice: 18, desc: 'Inspiring biography' },
    { name: 'Science Book', basePrice: 30, desc: 'Popular science book' },
    { name: 'Art Book', basePrice: 40, desc: 'Coffee table art book' },
    { name: 'Travel Guide', basePrice: 22, desc: 'Comprehensive travel guide' },
    { name: 'Children Book', basePrice: 12, desc: 'Illustrated children book' },
    { name: 'Poetry Collection', basePrice: 16, desc: 'Modern poetry collection' },
    { name: 'History Book', basePrice: 28, desc: 'Historical narrative' },
  ],
  Beauty: [
    { name: 'Face Cream', basePrice: 45, desc: 'Moisturizing face cream' },
    { name: 'Lipstick Set', basePrice: 35, desc: 'Long-lasting lipstick set' },
    { name: 'Perfume', basePrice: 80, desc: 'Luxury perfume' },
    { name: 'Makeup Brush Set', basePrice: 50, desc: 'Professional brush set' },
    { name: 'Face Mask', basePrice: 25, desc: 'Hydrating face mask' },
    { name: 'Nail Polish', basePrice: 12, desc: 'Quick-dry nail polish' },
    { name: 'Hair Serum', basePrice: 30, desc: 'Nourishing hair serum' },
    { name: 'Body Lotion', basePrice: 20, desc: 'Moisturizing body lotion' },
    { name: 'Sunscreen', basePrice: 28, desc: 'SPF 50 sunscreen' },
    { name: 'Eye Shadow Palette', basePrice: 40, desc: 'Versatile eye shadow palette' },
  ],
}

const images = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
  Fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
  'Home & Living': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
  Books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500',
  Beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
}

function generateProducts() {
  const products = []
  
  Object.keys(productTemplates).forEach(category => {
    const categoryBrands = brands[category]
    const templates = productTemplates[category]
    
    templates.forEach((template, index) => {
      categoryBrands.forEach((brand, brandIndex) => {
        const hasDiscount = Math.random() > 0.6
        const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0
        const price = template.basePrice + (brandIndex * 10)
        const originalPrice = hasDiscount ? Math.round(price / (1 - discount / 100)) : undefined
        
        products.push({
          title: `${brand} ${template.name}`,
          description: `${template.desc}. High quality ${template.name.toLowerCase()} from ${brand}.`,
          price,
          originalPrice,
          discount: hasDiscount ? discount : undefined,
          category,
          brand,
          images: [images[category]],
          stock: Math.floor(Math.random() * 100) + 10,
          rating: (Math.random() * 2 + 3).toFixed(1),
          reviews: [],
          specifications: {
            Brand: brand,
            Category: category,
            'In Stock': 'Yes',
          },
          features: [`Premium ${template.name}`, 'High Quality', 'Fast Shipping'],
          featured: Math.random() > 0.8,
        })
      })
    })
  })
  
  return products
}

async function seed() {
  try {
    console.log('🌱 Starting large database seed...')
    
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
    const categories = [
      { name: 'Electronics', slug: 'electronics', image: images.Electronics, description: 'Latest electronic gadgets' },
      { name: 'Fashion', slug: 'fashion', image: images.Fashion, description: 'Trendy fashion items' },
      { name: 'Home & Living', slug: 'home-living', image: images['Home & Living'], description: 'Home essentials' },
      { name: 'Sports', slug: 'sports', image: images.Sports, description: 'Sports equipment' },
      { name: 'Books', slug: 'books', image: images.Books, description: 'Books and literature' },
      { name: 'Beauty', slug: 'beauty', image: images.Beauty, description: 'Beauty products' },
    ]
    
    await Category.insertMany(categories)
    console.log('📁 Created categories')

    // Generate and create products
    const products = generateProducts()
    await Product.insertMany(products)
    console.log(`📦 Created ${products.length} products`)

    console.log('✅ Large database seeded successfully!')
    console.log(`\n📊 Statistics:`)
    console.log(`   Categories: ${categories.length}`)
    console.log(`   Products: ${products.length}`)
    console.log(`   Brands per category: ${Object.values(brands)[0].length}`)
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
