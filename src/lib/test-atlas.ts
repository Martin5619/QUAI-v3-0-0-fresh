import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const uri = process.env.DATABASE_URL;
if (!uri) {
  throw new Error('DATABASE_URL is not defined')
}

console.log('Using connection string:', uri.replace(/:[^:@]+@/, ':****@'))

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Try to access the quai database
    const db = client.db("quai");
    const collections = await db.listCollections().toArray();
    console.log("Collections in quai database:", collections.map(c => c.name));

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
