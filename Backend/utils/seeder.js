import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config();

// Same sample data used in the frontend's src/data/products.js, so both stay in sync during development.
const sampleProducts = [
  {
    name: 'Classic Cotton Shirt',
    category: 'men',
    price: 899,
    mrp: 1499,
    rating: 4.3,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
    tag: 'bestseller',
    stockQuantity: 40,
  },
  {
    name: 'Floral Summer Dress',
    category: 'women',
    price: 1299,
    mrp: 2199,
    rating: 4.6,
    reviews: 214,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
    tag: 'featured',
    stockQuantity: 25,
  },
  {
    name: 'Wireless Bluetooth Earbuds',
    category: 'electronics',
    price: 1999,
    mrp: 3499,
    rating: 4.1,
    reviews: 542,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    tag: 'flash-sale',
    stockQuantity: 60,
  },
  {
    name: 'Slim Fit Denim Jeans',
    category: 'men',
    price: 1499,
    mrp: 2299,
    rating: 4.4,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    tag: 'featured',
    stockQuantity: 35,
  },
  {
    name: 'Running Sneakers',
    category: 'men',
    price: 2499,
    mrp: 3999,
    rating: 4.7,
    reviews: 331,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    tag: 'bestseller',
    stockQuantity: 20,
  },
  {
    name: 'Smart Watch Series 5',
    category: 'electronics',
    price: 3999,
    mrp: 5999,
    rating: 4.2,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    tag: 'flash-sale',
    stockQuantity: 15,
  },
  {
    name: 'Leather Handbag',
    category: 'women',
    price: 2199,
    mrp: 3499,
    rating: 4.5,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
    tag: 'featured',
    stockQuantity: 18,
  },
  {
    name: 'Ceramic Table Lamp',
    category: 'home',
    price: 799,
    mrp: 1199,
    rating: 4.0,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    tag: 'bestseller',
    stockQuantity: 0,
  },
];

const run = async () => {
  await connectDB();

  try {
    if (process.argv.includes('-d')) {
      await Product.deleteMany();
      console.log('Products destroyed');
    } else {
      await Product.deleteMany();
      await Product.create(sampleProducts);
      console.log(`${sampleProducts.length} products imported`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Seeder error:', error.message);
    process.exit(1);
  }
};

run();