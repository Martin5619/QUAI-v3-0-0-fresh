import { MongoClient } from 'mongodb'

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    }
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable')
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI)
  const db = client.db('quai') // Use the same database name as in the MongoDB URI

  cachedClient = client
  cachedDb = db

  return {
    client,
    db,
  }
}
