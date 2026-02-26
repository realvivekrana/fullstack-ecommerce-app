import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Cart from '@/models/Cart'
import Product from '@/models/Product'
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response'
import { getUserFromRequest } from '@/lib/auth'

// GET user cart
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    let cart = await Cart.findOne({ user: user.userId }).populate('items.product')
    
    if (!cart) {
      cart = await Cart.create({ user: user.userId, items: [] })
    }

    return successResponse(cart)
  } catch (error: any) {
    console.error('Get cart error:', error)
    return errorResponse(error.message || 'Failed to get cart', 500)
  }
}

// POST add to cart
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return errorResponse('Product ID is required')
    }

    const product = await Product.findById(productId)
    if (!product) {
      return errorResponse('Product not found', 404)
    }

    if (product.stock < quantity) {
      return errorResponse('Insufficient stock')
    }

    let cart = await Cart.findOne({ user: user.userId })
    
    if (!cart) {
      cart = await Cart.create({
        user: user.userId,
        items: [{ product: productId, quantity, price: product.price }],
      })
    } else {
      const existingItem = cart.items.find(
        (item: any) => item.product.toString() === productId
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.items.push({ product: productId, quantity, price: product.price } as any)
      }

      await cart.save()
    }

    cart = await Cart.findById(cart._id).populate('items.product')

    return successResponse(cart, 'Product added to cart')
  } catch (error: any) {
    console.error('Add to cart error:', error)
    return errorResponse(error.message || 'Failed to add to cart', 500)
  }
}

// PUT update cart item
export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const user = getUserFromRequest(request)
    if (!user) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || quantity === undefined) {
      return errorResponse('Product ID and quantity are required')
    }

    const cart = await Cart.findOne({ user: user.userId })
    if (!cart) {
      return errorResponse('Cart not found', 404)
    }

    const item = cart.items.find((item: any) => item.product.toString() === productId)
    if (!item) {
      return errorResponse('Item not found in cart', 404)
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item: any) => item.product.toString() !== productId)
    } else {
      item.quantity = quantity
    }

    await cart.save()
    const updatedCart = await Cart.findById(cart._id).populate('items.product')

    return successResponse(updatedCart, 'Cart updated')
  } catch (error: any) {
    console.error('Update cart error:', error)
    return errorResponse(error.message || 'Failed to update cart', 500)
  }
}

// DELETE remove from cart
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

    const cart = await Cart.findOne({ user: user.userId })
    if (!cart) {
      return errorResponse('Cart not found', 404)
    }

    cart.items = cart.items.filter((item: any) => item.product.toString() !== productId)
    await cart.save()

    const updatedCart = await Cart.findById(cart._id).populate('items.product')

    return successResponse(updatedCart, 'Item removed from cart')
  } catch (error: any) {
    console.error('Remove from cart error:', error)
    return errorResponse(error.message || 'Failed to remove from cart', 500)
  }
}
