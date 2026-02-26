import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import User from '@/models/User'
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/api-response'
import { getUserFromRequest } from '@/lib/auth'

// POST add review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const { rating, comment } = body

    if (!rating || !comment) {
      return errorResponse('Rating and comment are required')
    }

    if (rating < 1 || rating > 5) {
      return errorResponse('Rating must be between 1 and 5')
    }

    const product = await Product.findById(params.id)
    if (!product) {
      return notFoundResponse('Product not found')
    }

    const userData = await User.findById(user.userId)
    if (!userData) {
      return errorResponse('User not found', 404)
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (r: any) => r.user.toString() === user.userId
    )

    if (existingReview) {
      return errorResponse('You have already reviewed this product')
    }

    // Add review
    product.reviews.push({
      user: userData._id,
      userName: userData.name,
      rating,
      comment,
      createdAt: new Date(),
    } as any)

    // Update rating
    product.updateRating()
    await product.save()

    return successResponse(product, 'Review added successfully', 201)
  } catch (error: any) {
    console.error('Add review error:', error)
    return errorResponse(error.message || 'Failed to add review', 500)
  }
}
