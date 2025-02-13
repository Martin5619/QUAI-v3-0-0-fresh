import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Schema for document updates
const documentUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  format: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const document = await prisma.document_v3.findUnique({
      where: {
        id,
        user: {
          email: session.user.email
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const data = await req.json()
    const validatedData = documentUpdateSchema.parse(data)

    // Check if document exists and belongs to user
    const existingDocument = await prisma.document_v3.findUnique({
      where: {
        id,
        user: {
          email: session.user.email
        }
      }
    })

    if (!existingDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Update document and manage tags in a transaction
    const updatedDocument = await prisma.$transaction(async (tx) => {
      // Update document
      const doc = await tx.document_v3.update({
        where: { id },
        data: {
          ...(validatedData.title && { title: validatedData.title }),
          ...(validatedData.content && { 
            content: validatedData.content,
            size: Buffer.from(validatedData.content).length 
          }),
          ...(validatedData.description && { description: validatedData.description }),
          ...(validatedData.format && { format: validatedData.format })
        }
      })

      // Update tags if provided
      if (validatedData.tags) {
        // Remove existing tags
        await tx.documentToTag_v3.deleteMany({
          where: { documentId: id }
        })

        // Add new tags
        for (const tagName of validatedData.tags) {
          const tag = await tx.documentTag_v3.upsert({
            where: { name: tagName },
            create: { name: tagName },
            update: {}
          })

          await tx.documentToTag_v3.create({
            data: {
              document: { connect: { id: doc.id } },
              tag: { connect: { id: tag.id } }
            }
          })
        }
      }

      return doc
    })

    return NextResponse.json(updatedDocument)
  } catch (error) {
    console.error('Error updating document:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid document data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if document exists and belongs to user
    const document = await prisma.document_v3.findUnique({
      where: {
        id,
        user: {
          email: session.user.email
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete document (relationships will be automatically deleted due to cascade)
    await prisma.document_v3.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
