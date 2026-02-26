import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Cart from '@/models/Cart'
import Product from '@/models/Product'
import User from '@/models/User'
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response'
import { getUserFromRequest, isAdmin } from '@/lib/auth'

// GET user orders or all orders (admin)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    let orders
    if (isAdmin(user)) {
      orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
    } else {
      orders = await Order.find({ user: user.userId }).sort({ createdAt: -1 })
    }

    return successResponse(orders)
  } catch (error: any) {
    console.error('Get orders error:', error)
    return errorResponse(error.message || 'Failed to get orders', 500)
  }
}

// POST create order
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const { shippingAddress, paymentMethod } = body

    if (!shippingAddress || !paymentMethod) {
      return errorResponse('Shipping address and payment method are required')
    }

    // Get user cart
    const cart = await Cart.findOne({ user: user.userId }).populate('items.product')
    if (!cart || cart.items.length === 0) {
      return errorResponse('Cart is empty')
    }

    // Prepare order items
    const orderItems = []
    for (const item of cart.items) {
      const product = item.product as any
      
      if (product.stock < item.quantity) {
        return errorResponse(`Insufficient stock for ${product.title}`)
      }

      orderItems.push({
        product: product._id,
        title: product.title,
        price: item.price,
        quantity: item.quantity,
        image: product.images[0],
      })

      // Update product stock
      product.stock -= item.quantity
      await product.save()
    }

    // Calculate totals
    const subtotal = cart.totalPrice
    const tax = subtotal * 0.1
    const shippingCost = 0
    const totalAmount = subtotal + tax + shippingCost

    // Create order
    const order = await Order.create({
      user: user.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    })

    // Update user order history
    await User.findByIdAndUpdate(user.userId, {
      $push: { orderHistory: order._id },
    })

    // Clear cart
    cart.items = []
    await cart.save()

    return successResponse(order, 'Order created successfully', 201)
  } catch (error: any) {
    console.error('Create order error:', error)
    return errorResponse(error.message || 'Failed to create order', 500)
  }
}
