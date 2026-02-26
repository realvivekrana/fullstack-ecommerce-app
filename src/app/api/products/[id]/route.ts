import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response'
import { getUserFromRequest, isAdmin } from '@/lib/auth'

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const product = await Product.findById(params.id)
    if (!product) {
      return notFoundResponse('Product not found')
    }

    return successResponse(product)
  } catch (error: any) {
    console.error('Get product error:', error)
    return errorResponse(error.message || 'Failed to get product', 500)
  }
}

// PUT update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user || !isAdmin(user)) {
      return errorResponse('Unauthorized', 403)
    }

    const body = await request.json()
    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      return notFoundResponse('Product not found')
    }

    return successResponse(product, 'Product updated successfully')
  } catch (error: any) {
    console.error('Update product error:', error)
    return errorResponse(error.message || 'Failed to update product', 500)
  }
}

// DELETE product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user || !isAdmin(user)) {
      return errorResponse('Unauthorized', 403)
    }

    const product = await Product.findByIdAndDelete(params.id)
    if (!product) {
      return notFoundResponse('Product not found')
    }

    return successResponse(null, 'Product deleted successfully')
  } catch (error: any) {
    console.error('Delete product error:', error)
    return errorResponse(error.message || 'Failed to delete product', 500)
  }
}
