import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response'
import { getUserFromRequest } from '@/lib/auth'

// GET user wishlist
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const userData = await User.findById(user.userId).populate('wishlist')
    if (!userData) {
      return errorResponse('User not found', 404)
    }

    return successResponse(userData.wishlist)
  } catch (error: any) {
    console.error('Get wishlist error:', error)
    return errorResponse(error.message || 'Failed to get wishlist', 500)
  }
}

// POST add to wishlist
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return errorResponse('Product ID is required')
    }

    const userData = await User.findById(user.userId)
    if (!userData) {
      return errorResponse('User not found', 404)
    }

    if (userData.wishlist.includes(productId)) {
      return errorResponse('Product already in wishlist')
    }

    userData.wishlist.push(productId)
    await userData.save()

    const updatedUser = await User.findById(user.userId).populate('wishlist')

    return successResponse(updatedUser?.wishlist, 'Added to wishlist')
  } catch (error: any) {
    console.error('Add to wishlist error:', error)
    return errorResponse(error.message || 'Failed to add to wishlist', 500)
  }
}

// DELETE remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return errorResponse('Product ID is required')
    }

    const userData = await User.findById(user.userId)
    if (!userData) {
      return errorResponse('User not found', 404)
    }

    userData.wishlist = userData.wishlist.filter(
      (id: any) => id.toString() !== productId
    )
    await userData.save()

    const updatedUser = await User.findById(user.userId).populate('wishlist')

    return successResponse(updatedUser?.wishlist, 'Removed from wishlist')
  } catch (error: any) {
    console.error('Remove from wishlist error:', error)
    return errorResponse(error.message || 'Failed to remove from wishlist', 500)
  }
}
