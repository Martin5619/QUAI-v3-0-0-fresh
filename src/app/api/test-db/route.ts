import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    console.log('Testing database connection...')
    // Try to count all users as a simple test
    const userCount = await prisma.user_v3.count()
    console.log('Database connection successful. User count:', userCount)
    return NextResponse.json({ success: true, userCount })
  } catch (error) {
    console.error('Database connection test failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json({ error: 'Database connection test failed' }, { status: 500 })
  }
}
