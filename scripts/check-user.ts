import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    console.log('Checking database connection...')
    await prisma.$connect()
    console.log('Connected to database')

    const email = 'test1@quai.com'
    console.log(`\nChecking user with email: ${email}`)
    
    const user = await prisma.user_v3.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountState: true,
        verificationToken: true,
        emailVerified: true,
        createdAt: true
      }
    })

    if (user) {
      console.log('\nFound user:', {
        ...user,
        createdAt: user.createdAt.toISOString()
      })
    } else {
      console.log('\nNo user found with this email')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
