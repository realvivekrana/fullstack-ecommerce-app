import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { successResponse, errorResponse } from '@/lib/api-response'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return errorResponse('Email and password are required')
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return errorResponse('Invalid email or password', 401)
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401)
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    return successResponse({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }, 'Login successful')
  } catch (error: any) {
    console.error('Login error:', error)
    return errorResponse(error.message || 'Login failed', 500)
  }
}
