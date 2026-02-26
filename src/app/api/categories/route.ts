import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getUserFromRequest, isAdmin } from '@/lib/auth'

// GET all categories
export async function GET() {
  try {
    await connectDB()

    const categories = await Category.find().sort({ name: 1 })
    return successResponse(categories)
  } catch (error: any) {
    console.error('Get categories error:', error)
    return errorResponse(error.message || 'Failed to get categories', 500)
  }
}

// POST create category (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user || !isAdmin(user)) {
      return errorResponse('Unauthorized', 403)
    }

    const body = await request.json()
    const category = await Category.create(body)

    return successResponse(category, 'Category created successfully', 201)
  } catch (error: any) {
    console.error('Create category error:', error)
    return errorResponse(error.message || 'Failed to create category', 500)
  }
}
