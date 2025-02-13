import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'

describe('Document System', () => {
  let userId: string
  let testTag: any
  let testDocument: any

  beforeAll(async () => {
    // Create test user
    const hashedPassword = await hash('password123', 12)
    const user = await db.user_v3.create({
      data: {
        email: 'test-docs@quai.com',
        password: hashedPassword,
        role: 'PERSONAL_USER',
        plan: 'FREE'
      }
    })
    userId = user.id
  })

  afterAll(async () => {
    // Clean up test data
    await db.documentToTag_v3.deleteMany({
      where: {
        document: {
          userId
        }
      }
    })
    await db.document_v3.deleteMany({
      where: {
        userId
      }
    })
    await db.documentTag_v3.deleteMany({
      where: {
        name: {
          startsWith: 'test-'
        }
      }
    })
    await db.user_v3.delete({
      where: {
        id: userId
      }
    })
  })

  describe('Tags', () => {
    it('should create a tag', async () => {
      testTag = await db.documentTag_v3.create({
        data: {
          name: 'test-tag-1',
          description: 'Test tag for document system'
        }
      })
      expect(testTag.name).toBe('test-tag-1')
      expect(testTag.description).toBe('Test tag for document system')
    })

    it('should not allow duplicate tag names', async () => {
      await expect(db.documentTag_v3.create({
        data: {
          name: 'test-tag-1'
        }
      })).rejects.toThrow()
    })
  })

  describe('Documents', () => {
    it('should create a document with tags', async () => {
      testDocument = await db.document_v3.create({
        data: {
          title: 'Test Document',
          content: 'Test content',
          type: 'text/plain',
          size: Buffer.from('Test content').length,
          userId,
          tags: {
            create: {
              tag: {
                connect: {
                  id: testTag.id
                }
              }
            }
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

      expect(testDocument.title).toBe('Test Document')
      expect(testDocument.tags[0].tag.name).toBe('test-tag-1')
    })

    it('should update document tags', async () => {
      const newTag = await db.documentTag_v3.create({
        data: {
          name: 'test-tag-2'
        }
      })

      await db.documentToTag_v3.create({
        data: {
          documentId: testDocument.id,
          tagId: newTag.id
        }
      })

      const updatedDocument = await db.document_v3.findUnique({
        where: { id: testDocument.id },
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      })

      expect(updatedDocument?.tags).toHaveLength(2)
      expect(updatedDocument?.tags.map(t => t.tag.name)).toContain('test-tag-2')
    })
  })
})
