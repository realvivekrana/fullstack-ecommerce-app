import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const userData = await User.findById(user.userId).select('-password')
    if (!userData) {
      return errorResponse('User not found', 404)
    }

    return successResponse(userData)
  } catch (error: any) {
    console.error('Get user error:', error)
    return errorResponse(error.message || 'Failed to get user', 500)
  }
}
