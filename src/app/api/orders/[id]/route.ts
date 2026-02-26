import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/api-response'
import { getUserFromRequest, isAdmin } from '@/lib/auth'

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const order = await Order.findById(params.id).populate('user', 'name email')
    if (!order) {
      return notFoundResponse('Order not found')
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== user.userId && !isAdmin(user)) {
      return errorResponse('Unauthorized', 403)
    }

    return successResponse(order)
  } catch (error: any) {
    console.error('Get order error:', error)
    return errorResponse(error.message || 'Failed to get order', 500)
  }
}

// PUT update order status (admin only)
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
    const { orderStatus, paymentStatus } = body

    const updateData: any = {}
    if (orderStatus) updateData.orderStatus = orderStatus
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const order = await Order.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!order) {
      return notFoundResponse('Order not found')
    }

    return successResponse(order, 'Order updated successfully')
  } catch (error: any) {
    console.error('Update order error:', error)
    return errorResponse(error.message || 'Failed to update order', 500)
  }
}
