import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { successResponse, errorResponse } from '@/lib/api-response'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, email, password, phone } = body

    // Validation
    if (!name || !email || !password) {
      return errorResponse('Name, email, and password are required')
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters')
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return errorResponse('User with this email already exists')
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
    })

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    return successResponse(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      'User registered successfully',
      201
    )
  } catch (error: any) {
    console.error('Register error:', error)
    return errorResponse(error.message || 'Registration failed', 500)
  }
}
