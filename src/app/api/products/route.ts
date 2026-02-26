import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getUserFromRequest, isAdmin } from '@/lib/auth'

// GET all products with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minRating = searchParams.get('minRating')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'createdAt'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const featured = searchParams.get('featured')

    // Build query
    const query: any = {}

    if (category) query.category = category
    if (brand) query.brand = brand
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }
    if (minRating) query.rating = { $gte: parseFloat(minRating) }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ]
    }
    if (featured === 'true') query.featured = true

    // Sort options
    let sortOption: any = {}
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 }
        break
      case 'price-desc':
        sortOption = { price: -1 }
        break
      case 'rating':
        sortOption = { rating: -1 }
        break
      case 'newest':
        sortOption = { createdAt: -1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(query),
    ])

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Get products error:', error)
    return errorResponse(error.message || 'Failed to get products', 500)
  }
}

// POST create product (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user || !isAdmin(user)) {
      return errorResponse('Unauthorized', 403)
    }

    const body = await request.json()
    const product = await Product.create(body)

    return successResponse(product, 'Product created successfully', 201)
  } catch (error: any) {
    console.error('Create product error:', error)
    return errorResponse(error.message || 'Failed to create product', 500)
  }
}
