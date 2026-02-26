import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IReview {
  user: mongoose.Types.ObjectId
  userName: string
  rating: number
  comment: string
  createdAt: Date
}

export interface IProduct extends Document {
  title: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  brand: string
  images: string[]
  stock: number
  rating: number
  reviews: IReview[]
  specifications?: Record<string, string>
  features?: string[]
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0 && v.every(url => url && url.trim() !== '')
        },
        message: 'At least one valid image URL is required',
      },
      default: function() {
        // Default images based on category
        const category = (this.category || '').toLowerCase()
        if (category.includes('electronic')) {
          return ['https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800']
        }
        if (category.includes('fashion')) {
          return ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800']
        }
        if (category.includes('beauty')) {
          return ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800']
        }
        if (category.includes('home')) {
          return ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800']
        }
        if (category.includes('book')) {
          return ['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800']
        }
        if (category.includes('sport')) {
          return ['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800']
        }
        return ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800']
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [ReviewSchema],
    specifications: {
      type: Map,
      of: String,
    },
    features: [String],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Update rating when reviews change
ProductSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0
  } else {
    const sum = this.reviews.reduce((acc: number, review: IReview) => acc + review.rating, 0)
    this.rating = Math.round((sum / this.reviews.length) * 10) / 10
  }
}

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product
