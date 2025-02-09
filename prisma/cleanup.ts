require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanup() {
  try {
    // Update any stuck GENERATING status to ERROR if they've been stuck for more than 10 minutes
    const stuckSets = await prisma.questionSet.updateMany({
      where: {
        status: 'GENERATING',
        updatedAt: {
          lt: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
        }
      },
      data: {
        status: 'ERROR',
        error: 'Generation timed out',
        progress: 0
      }
    })

    console.log(`Updated ${stuckSets.count} stuck question sets`)

    // Delete any ERROR status sets that have no questions
    const emptySets = await prisma.questionSet.deleteMany({
      where: {
        status: 'ERROR',
        questions: {
          none: {}
        }
      }
    })

    console.log(`Deleted ${emptySets.count} empty error sets`)

    console.log('Cleanup completed successfully')
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanup()
