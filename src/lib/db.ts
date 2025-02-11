import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

// Log all queries in development
const logOptions = process.env.NODE_ENV === "development" ? {
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
} : {}

const prisma = globalThis.prisma || new PrismaClient({
  ...logOptions,
  errorFormat: 'pretty'
})

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma
}

// Add event listeners for logging
if (process.env.NODE_ENV === "development") {
  prisma.$on('query', (e: any) => {
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
  })

  prisma.$on('error', (e: any) => {
    console.error('Prisma Error:', e)
  })

  prisma.$on('info', (e: any) => {
    console.log('Prisma Info:', e)
  })

  prisma.$on('warn', (e: any) => {
    console.warn('Prisma Warning:', e)
  })
}

// Ensure database connection
let isConnected = false
let connectionAttempts = 0
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export const ensureConnection = async () => {
  console.log("Starting database connection check...")
  console.log("Current connection state:", { isConnected, connectionAttempts })
  
  if (isConnected) {
    console.log("Already connected to database")
    return
  }

  while (connectionAttempts < MAX_RETRIES) {
    try {
      console.log(`Attempting database connection (attempt ${connectionAttempts + 1}/${MAX_RETRIES})`)
      console.log("DATABASE_URL format check:", {
        isDefined: !!process.env.DATABASE_URL,
        length: process.env.DATABASE_URL?.length,
        startsWithMongodb: process.env.DATABASE_URL?.startsWith('mongodb'),
      })
      
      // Test connection with a simple query
      await prisma.$connect()
      const result = await prisma.$runCommandRaw({
        ping: 1
      })
      console.log("Database connection test result:", result)
      
      isConnected = true
      console.log("Successfully connected to database")
      return
    } catch (e) {
      connectionAttempts++
      console.error(`Failed to connect to database (attempt ${connectionAttempts}/${MAX_RETRIES}):`, e)
      console.error("Error details:", {
        name: e.name,
        message: e.message,
        code: e.code,
        stack: e.stack
      })
      
      if (connectionAttempts < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY}ms...`)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      } else {
        console.error("Max connection attempts reached")
        throw new Error(`Failed to connect to database after ${MAX_RETRIES} attempts: ${e.message}`)
      }
    }
  }
}

// Reset connection state on errors
const handleConnectionError = async (error: any) => {
  console.log("Handling connection error:", error)
  if (error?.message?.includes('MongoNotConnectedError') || 
      error?.message?.includes('Connection lost') ||
      error?.message?.includes('topology was destroyed')) {
    console.log("Detected connection error, resetting connection state")
    isConnected = false
    connectionAttempts = 0
  }
}

export const db = new Proxy(prisma, {
  get(target, prop) {
    const origMethod = target[prop]
    if (typeof origMethod === 'function') {
      return async (...args) => {
        try {
          await ensureConnection()
          return await origMethod.apply(target, args)
        } catch (error) {
          await handleConnectionError(error)
          throw error
        }
      }
    }
    return origMethod
  },
})
