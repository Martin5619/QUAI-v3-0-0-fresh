import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function testConnection() {
  let uri = process.env.DATABASE_URL
  if (!uri) {
    throw new Error('DATABASE_URL is not defined')
  }

  // Add authSource=admin to the connection string if not present
  if (!uri.includes('authSource=')) {
    uri = uri.includes('?') 
      ? `${uri}&authSource=admin` 
      : `${uri}?authSource=admin`
  }

  // Encode the password in the connection string
  const [prefix, rest] = uri.split('://')
  const [auth, remainder] = rest.split('@')
  const [username, password] = auth.split(':')
  const encodedPassword = encodeURIComponent(password)
  uri = `${prefix}://${username}:${encodedPassword}@${remainder}`

  console.log('Testing MongoDB connection...')
  console.log('URI:', uri.replace(/:[^:@]+@/, ':****@')) // Hide password in logs

  const client = new MongoClient(uri, {
    connectTimeoutMS: 10000, // 10 seconds
    socketTimeoutMS: 45000,  // 45 seconds
  })

  try {
    console.log('Attempting to connect to MongoDB...')
    await client.connect()
    console.log('Successfully connected to MongoDB')

    const adminDb = client.db('admin')
    console.log('Checking admin database access...')
    const adminInfo = await adminDb.command({ buildInfo: 1 })
    console.log('MongoDB version:', adminInfo.version)

    const db = client.db('quai')
    console.log('Checking quai database access...')
    const collections = await db.listCollections().toArray()
    console.log('Available collections:', collections.map(c => c.name))

    const userCount = await db.collection('users').countDocuments()
    console.log('Number of users:', userCount)

  } catch (err) {
    console.error('MongoDB connection error:', err)
    if (err.message?.includes('bad auth')) {
      console.error('Authentication failed. Please check:')
      console.error('1. Username is correct (current: quai-admin)')
      console.error('2. Password is correct')
      console.error('3. User has proper permissions (current: atlasAdmin@admin)')
      console.error('4. Database name is correct (current: quai)')
    }
    throw err
  } finally {
    await client.close()
    console.log('Closed MongoDB connection')
  }
}

testConnection().catch(console.error)
