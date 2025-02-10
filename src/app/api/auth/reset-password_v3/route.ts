import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { z } from 'zod'
import { connectToDatabase } from '@/lib/db'

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
})

export async function POST(req: Request) {
  try {
    const { token, password } = resetPasswordSchema.parse(await req.json())

    const { db } = await connectToDatabase()
    const collection = db.collection('users_v3')

    // Find user with valid reset token
    const user = await collection.findOne({
      resetToken: token,
      resetExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hash(password, 12)

    // Update user password and clear reset token
    await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          resetToken: null,
          resetExpiry: null,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
