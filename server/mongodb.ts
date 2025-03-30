import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb';
import { User } from '../shared/schema';
import { GameProgress } from '../shared/gameTypes';

// Connection URI - use in-memory MongoDB for testing if no URI is provided
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
let isInMemory = false;

// Create a new MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and collection references
let db: Db;
let usersCollection: Collection<User>;
let gameProgressCollection: Collection<GameProgress>;

// In-memory data
const inMemoryUsers: User[] = [];
const inMemoryProgress: GameProgress[] = [];

// Initialize in-memory data
function initializeInMemoryData() {
  console.log('Initializing in-memory data');
  isInMemory = true;
  
  // Clear existing data
  inMemoryUsers.length = 0;
  inMemoryProgress.length = 0;
  
  // Add default user
  inMemoryUsers.push({ id: 1, username: 'player', password: 'password' });
  
  // Add default progress
  inMemoryProgress.push({
    userId: 1,
    unlockedLevels: [1],
    completedLevels: [],
    completedMissions: [],
    unlockedSkills: [],
    lastUpdated: new Date().toISOString()
  });
}

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    // Initialize in-memory first to ensure we always have data available
    initializeInMemoryData();
    
    // Try to connect to MongoDB with timeout
    const connectionPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 5000);
    });
    
    await Promise.race([connectionPromise, timeoutPromise]);
    console.log('Connected to MongoDB');
    isInMemory = false;
    
    // Get database reference
    db = client.db('gameDb');
    
    // Get collections
    usersCollection = db.collection<User>('users');
    gameProgressCollection = db.collection<GameProgress>('gameProgress');
    
    // Create indexes for faster queries
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await gameProgressCollection.createIndex({ userId: 1 }, { unique: true });
    
    // Create a default user if not exists
    const defaultUser = await usersCollection.findOne({ id: 1 });
    if (!defaultUser) {
      console.log('Creating default user');
      await usersCollection.insertOne({ id: 1, username: 'player', password: 'password' });
    }
    
    // Create default game progress if not exists
    const defaultProgress = await gameProgressCollection.findOne({ userId: 1 });
    if (!defaultProgress) {
      console.log('Creating default game progress');
      await gameProgressCollection.insertOne({
        userId: 1,
        unlockedLevels: [1],
        completedLevels: [],
        completedMissions: [],
        unlockedSkills: [],
        lastUpdated: new Date().toISOString()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.log('Using in-memory fallback');
    return true; // We still return true since in-memory mode is already set up
  }
}

// Helper function to create in-memory collections
function createInMemoryCollection<T>() {
  const data: T[] = [];
  
  return {
    findOne: async (query: any) => {
      return data.find(item => {
        for (const key in query) {
          if (Array.isArray(query[key])) {
            if (!Array.isArray((item as any)[key])) return false;
            if (!query[key].every((val: any) => (item as any)[key].includes(val))) return false;
          } else if ((item as any)[key] !== query[key]) {
            return false;
          }
        }
        return true;
      }) || null;
    },
    insertOne: async (item: T) => {
      data.push(item);
      return { acknowledged: true, insertedId: Date.now() };
    },
    updateOne: async (query: any, update: any, options: any) => {
      const index = data.findIndex(item => {
        for (const key in query) {
          if ((item as any)[key] !== query[key]) return false;
        }
        return true;
      });
      
      if (index === -1) {
        if (options?.upsert) {
          const newItem = { ...query, ...update.$set };
          data.push(newItem as T);
        }
      } else {
        data[index] = { ...data[index], ...update.$set };
      }
      
      return { acknowledged: true, modifiedCount: index !== -1 ? 1 : 0 };
    },
    countDocuments: async () => data.length,
    createIndex: async () => 'index-name',
  } as unknown as Collection<T>;
}

// User operations
export async function getUser(id: number): Promise<User | null> {
  try {
    // Use in-memory data if MongoDB is not connected
    if (isInMemory) {
      return inMemoryUsers.find(user => user.id === id) || null;
    }
    
    return await usersCollection.findOne({ id });
  } catch (error) {
    console.error('Error getting user:', error);
    // Fallback to in-memory
    return inMemoryUsers.find(user => user.id === id) || null;
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    // Use in-memory data if MongoDB is not connected
    if (isInMemory) {
      return inMemoryUsers.find(user => user.username === username) || null;
    }
    
    return await usersCollection.findOne({ username });
  } catch (error) {
    console.error('Error getting user by username:', error);
    // Fallback to in-memory
    return inMemoryUsers.find(user => user.username === username) || null;
  }
}

export async function createUser(user: Omit<User, 'id'>): Promise<User | null> {
  try {
    // Use in-memory data if MongoDB is not connected
    if (isInMemory) {
      const count = inMemoryUsers.length;
      const newUser: User = { ...user, id: count + 1 };
      
      // Add the user
      inMemoryUsers.push(newUser);
      
      // Create initial game progress
      inMemoryProgress.push({
        userId: newUser.id,
        unlockedLevels: [1],
        completedLevels: [],
        completedMissions: [],
        unlockedSkills: [],
        lastUpdated: new Date().toISOString()
      });
      
      return newUser;
    }
    
    // Get the next id
    const count = await usersCollection.countDocuments();
    const newUser: User = { ...user, id: count + 1 };
    
    // Insert the user
    await usersCollection.insertOne(newUser);
    
    // Create initial game progress
    await gameProgressCollection.insertOne({
      userId: newUser.id,
      unlockedLevels: [1],
      completedLevels: [],
      completedMissions: [],
      unlockedSkills: [],
      lastUpdated: new Date().toISOString()
    });
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Game progress operations
export async function getGameProgress(userId: number): Promise<GameProgress | null> {
  try {
    // Use in-memory data if MongoDB is not connected
    if (isInMemory) {
      return inMemoryProgress.find(progress => progress.userId === userId) || null;
    }
    
    return await gameProgressCollection.findOne({ userId });
  } catch (error) {
    console.error('Error getting game progress:', error);
    // Fallback to in-memory
    return inMemoryProgress.find(progress => progress.userId === userId) || null;
  }
}

export async function updateGameProgress(progress: GameProgress): Promise<boolean> {
  try {
    progress.lastUpdated = new Date().toISOString();
    
    // Use in-memory data if MongoDB is not connected
    if (isInMemory) {
      const index = inMemoryProgress.findIndex(p => p.userId === progress.userId);
      
      if (index === -1) {
        inMemoryProgress.push(progress);
      } else {
        inMemoryProgress[index] = progress;
      }
      
      return true;
    }
    
    const result = await gameProgressCollection.updateOne(
      { userId: progress.userId },
      { $set: progress },
      { upsert: true }
    );
    
    return result.acknowledged;
  } catch (error) {
    console.error('Error updating game progress:', error);
    
    // Fallback to in-memory
    try {
      const index = inMemoryProgress.findIndex(p => p.userId === progress.userId);
      
      if (index === -1) {
        inMemoryProgress.push(progress);
      } else {
        inMemoryProgress[index] = progress;
      }
      
      return true;
    } catch (innerError) {
      console.error('Error with in-memory fallback:', innerError);
      return false;
    }
  }
}

// Close the connection when the application terminates
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// Export the MongoDB client
export { client };