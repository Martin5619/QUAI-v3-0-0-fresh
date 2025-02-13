import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

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

    // Check if tag exists and is being used
    const tag = await prisma.documentTag_v3.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            documents: true
          }
        }
      }
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Delete the tag and all its relationships
    await prisma.$transaction([
      // Delete all document-tag relationships
      prisma.documentToTag_v3.deleteMany({
        where: {
          tagId: id
        }
      }),
      // Delete the tag itself
      prisma.documentTag_v3.delete({
        where: {
          id
        }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}
