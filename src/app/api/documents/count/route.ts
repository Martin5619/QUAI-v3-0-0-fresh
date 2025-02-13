import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Count endpoint - Session:', JSON.stringify(session, null, 2))
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total count of documents for the user
    console.log('Count endpoint - Querying for user email:', session.user.email)
    const count = await prisma.document_v3.count({
      where: {
        user: {
          email: session.user.email
        }
      }
    })
    console.log('Count endpoint - Result:', count)

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching document count:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json({ error: 'Failed to fetch document count' }, { status: 500 })
  }
}
