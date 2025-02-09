import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prismaClient = new PrismaClient({
  log: ['error'],
})

// Middleware to sync userId_v2414 with id
prismaClient.$use(async (params, next) => {
  // Only handle User_v2414 model operations
  if (params.model === 'User_v2414') {
    // For create operations, we need to handle it in a transaction
    if (params.action === 'create') {
      return prismaClient.$transaction(async (tx) => {
        // First create the user
        const user = await next(params)
        
        // Then immediately update with the userId_v2414
        const updated = await tx.user_v2414.update({
          where: { id: user.id },
          data: { userId_v2414: user.id },
          include: {
            ...params.args.include,
            usage_v2414: true
          }
        })
        
        return updated
      })
    }
    
    // For update operations
    if (params.action === 'update' || params.action === 'updateMany') {
      return prismaClient.$transaction(async (tx) => {
        const result = await next(params)
        
        // If we have a single user result
        if (result && 'id' in result) {
          // Ensure userId_v2414 stays in sync
          if (!result.userId_v2414 || result.userId_v2414 !== result.id) {
            return await tx.user_v2414.update({
              where: { id: result.id },
              data: { userId_v2414: result.id },
              include: {
                ...params.args.include,
                usage_v2414: true
              }
            })
          }
        }
        
        return result
      })
    }
  }
  
  return next(params)
})

export const prisma = globalForPrisma.prisma || prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
