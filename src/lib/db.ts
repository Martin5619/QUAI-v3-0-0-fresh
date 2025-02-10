import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty'
})

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma
}

// Ensure database connection
let isConnected = false
let connectionAttempts = 0
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export const ensureConnection = async () => {
  if (isConnected) return

  while (connectionAttempts < MAX_RETRIES) {
    try {
      await prisma.$connect()
      isConnected = true
      console.log("Successfully connected to database")
      return
    } catch (e) {
      connectionAttempts++
      console.error(`Failed to connect to database (attempt ${connectionAttempts}/${MAX_RETRIES}):`, e)
      
      if (connectionAttempts < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY}ms...`)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      } else {
        throw new Error("Failed to connect to database after multiple attempts")
      }
    }
  }
}

// Reset connection state on errors
const handleConnectionError = async (error: any) => {
  if (error?.message?.includes('MongoNotConnectedError') || 
      error?.message?.includes('Connection lost') ||
      error?.message?.includes('topology was destroyed')) {
    console.log("Detected connection error, resetting connection state")
    isConnected = false
    connectionAttempts = 0
  }
  throw error
}

export const db = new Proxy(prisma, {
  get: (target, prop) => {
    // Ensure connection before any operation
    const ensureConnectedOperation = async () => {
      await ensureConnection()
      return target[prop]
    }

    if (typeof target[prop] === 'function') {
      return new Proxy(target[prop], {
        apply: async (fn, thisArg, args) => {
          await ensureConnection()
          try {
            return await fn.apply(target, args)
          } catch (error) {
            console.error(`Database operation failed:`, {
              operation: String(prop),
              error
            })
            await handleConnectionError(error)
            throw error
          }
        }
      })
    }

    return ensureConnectedOperation()
  }
})
