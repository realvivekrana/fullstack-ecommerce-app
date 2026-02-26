import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const [productCount, categoryCount] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
    ])

    return successResponse({
      status: 'healthy',
      database: 'connected',
      products: productCount,
      categories: categoryCount,
    })
  } catch (error: any) {
    console.error('Health check error:', error)
    return errorResponse(error.message || 'Health check failed', 500)
  }
}
