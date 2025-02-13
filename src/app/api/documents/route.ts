import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Schema for document creation/update
const documentSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  description: z.string().optional(),
  documentType: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const validatedData = documentSchema.parse(data)
    
    // Create the document without tags for now
    const document = await prisma.document_v3.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        documentType: validatedData.documentType,
        size: Buffer.from(validatedData.content).length,
        user: {
          connect: {
            email: session.user.email
          }
        }
      }
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error creating document:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid document data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Documents endpoint - Session:', JSON.stringify(session, null, 2))
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    console.log('Documents endpoint - Query params:', { page, limit, skip })
    console.log('Documents endpoint - Querying for user email:', session.user.email)

    // Get documents without tags for now
    const documents = await prisma.document_v3.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      skip,
      take: limit,
      orderBy: {
        updatedAt: 'desc'
      }
    })
    console.log('Documents endpoint - Found documents count:', documents.length)

    // Get total count for pagination
    const total = await prisma.document_v3.count({
      where: {
        user: {
          email: session.user.email
        }
      }
    })
    console.log('Documents endpoint - Total count:', total)

    return NextResponse.json({
      documents,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page
      }
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}
