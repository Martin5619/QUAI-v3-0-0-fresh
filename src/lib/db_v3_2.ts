import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

// Prevent multiple instances in development
const prisma = globalThis.prisma || new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty'
})

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma
}

// Proxy to handle connection errors and retries
export const db = new Proxy(prisma, {
  get(target, prop) {
    const origMethod = target[prop]

    if (typeof origMethod === 'function') {
      return async (...args: any[]) => {
        try {
          return await origMethod.apply(target, args)
        } catch (error) {
          console.error(`Database operation failed:`, error)
          
          // Retry once for connection errors
          if (error.message.includes('Connection')) {
            try {
              await target.$connect()
              return await origMethod.apply(target, args)
            } catch (retryError) {
              console.error(`Retry failed:`, retryError)
              throw retryError
            }
          }
          
          throw error
        }
      }
    }

    return origMethod
  }
})
