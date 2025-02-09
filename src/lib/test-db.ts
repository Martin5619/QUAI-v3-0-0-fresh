import { MongoClient } from 'mongodb'

export async function testConnection() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not defined')
  }

  const client = new MongoClient(url)

  try {
    await client.connect()
    console.log('Successfully connected to MongoDB')
    
    // List databases
    const dbs = await client.db().admin().listDatabases()
    console.log('Available databases:', dbs.databases.map(db => db.name))
    
    // Try to use the quai database specifically
    const db = client.db('quai')
    const collections = await db.listCollections().toArray()
    console.log('Collections in quai database:', collections.map(col => col.name))
    
    return { success: true, databases: dbs.databases, collections }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return { success: false, error }
  } finally {
    await client.close()
  }
}
