import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'

// Simple newsletter subscription endpoint
// In production, integrate with email service like Mailchimp, SendGrid, etc.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return errorResponse('Email is required')
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return errorResponse('Invalid email address')
    }

    // TODO: Integrate with email service
    // For now, just log it
    console.log('Newsletter subscription:', email)

    // In production, you would:
    // 1. Save to database
    // 2. Send to email service (Mailchimp, SendGrid, etc.)
    // 3. Send confirmation email

    return successResponse(
      { email },
      'Successfully subscribed to newsletter!',
      201
    )
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return errorResponse(error.message || 'Failed to subscribe', 500)
  }
}
