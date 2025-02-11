import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listUsers() {
  try {
    console.log('Checking database connection...')
    await prisma.$connect()
    console.log('Connected to database')

    console.log('\nListing all users:')
    const users = await prisma.user_v3.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountState: true,
        createdAt: true
      }
    })

    console.log('\nFound', users.length, 'users:')
    users.forEach(user => {
      console.log('\nUser:', {
        ...user,
        createdAt: user.createdAt.toISOString()
      })
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
