import mongodb, { MongoClient } from 'mongodb';

const url = process.env.DB_URL;
const dbName = process.env.DB_NAME || 'results';

// Only create MongoClient if URL is available (not during build time)
let mongoClient: MongoClient | null = null;
if (url) {
  mongoClient = new MongoClient(url);
} else {
  // During build time or when DB_URL is not set, we'll handle this gracefully
  console.warn('DB_URL not available - database operations will be skipped during build');
}

let cachedDb: mongodb.Db | null = null;

export async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  if (!mongoClient) {
    throw new Error(
      'Database client not initialized. Please ensure DB_URL environment variable is set.'
    );
  }

  const client = await mongoClient.connect();
  const db = client.db(dbName);
  cachedDb = db;
  return db;
}
