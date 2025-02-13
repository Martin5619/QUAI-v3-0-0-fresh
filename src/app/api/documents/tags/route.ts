import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Schema for tag creation
const tagSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all tags with document counts for the user
    const tags = await prisma.documentTag_v3.findMany({
      include: {
        _count: {
          select: {
            documents: {
              where: {
                document: {
                  user: {
                    email: session.user.email
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      tags: tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        documentCount: tag._count.documents
      }))
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const validatedData = tagSchema.parse(data)

    // Check if tag already exists
    const existingTag = await prisma.documentTag_v3.findUnique({
      where: { name: validatedData.name }
    })

    if (existingTag) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 400 })
    }

    // Create new tag
    const tag = await prisma.documentTag_v3.create({
      data: {
        name: validatedData.name,
        description: validatedData.description
      }
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error creating tag:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid tag data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}

// DELETE endpoint will be in [id]/route.ts
