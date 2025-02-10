import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectToDatabase } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email/service_v3'

const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(req: Request) {
  try {
    const { email } = requestResetSchema.parse(await req.json())

    const { db } = await connectToDatabase()
    const collection = db.collection('users_v3')

    // Find user
    const user = await collection.findOne({ email })
    if (!user) {
      // Return success even if user not found for security
      return NextResponse.json(
        { message: 'If an account exists, a reset link has been sent' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomUUID()
    const resetExpiry = new Date()
    resetExpiry.setHours(resetExpiry.getHours() + 1)

    // Update user with reset token
    await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken,
          resetExpiry,
          updatedAt: new Date(),
        },
      }
    )

    // Send reset email
    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json(
      { message: 'If an account exists, a reset link has been sent' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset request error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to process reset request' },
      { status: 500 }
    )
  }
}
