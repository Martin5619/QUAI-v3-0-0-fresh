import { PrismaClient } from '@prisma/client'

interface MigrationStatus {
  isComplete: boolean
  message?: string
}

export async function checkMigrationStatus(): Promise<MigrationStatus> {
  const prisma = new PrismaClient()

  try {
    // Check if we have any users in the database
    const userCount = await prisma.user_v3.count()
    if (userCount === 0) {
      return {
        isComplete: false,
        message: 'No users found in database. Migration may not be complete.'
      }
    }

    // Check if we have any documents
    const docCount = await prisma.document_v3.count()
    if (docCount === 0) {
      return {
        isComplete: false,
        message: 'No documents found in database. Migration may not be complete.'
      }
    }

    // All checks passed
    return {
      isComplete: true
    }
  } catch (error) {
    console.error('Migration status check failed:', error)
    return {
      isComplete: false,
      message: 'Error checking migration status'
    }
  } finally {
    await prisma.$disconnect()
  }
}

export async function requireMigrationComplete() {
  const status = await checkMigrationStatus()
  if (!status.isComplete) {
    throw new Error(`Migration not complete: ${status.message}`)
  }
}
