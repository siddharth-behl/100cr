import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { getUser, getUserByUsername, createUser, getGameProgress, updateGameProgress } from "./mongodb";
import gameRoutes from "./gameRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register game routes
  app.use('/api/game', gameRoutes);
  // User routes
  app.post('/api/users', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Check if user already exists
      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      // Create user
      const user = await createUser({ username, password });
      if (!user) {
        return res.status(500).json({ message: 'Failed to create user' });
      }
      
      return res.status(201).json({ user });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await getUser(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.json({ user });
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Game progress routes
  app.get('/api/progress/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await getGameProgress(userId);
      if (!progress) {
        return res.status(404).json({ message: 'Game progress not found' });
      }
      
      return res.json({ progress });
    } catch (error) {
      console.error('Error getting game progress:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.put('/api/progress/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const progressUpdate = req.body;
      
      // Make sure userId matches
      if (userId !== progressUpdate.userId) {
        return res.status(400).json({ message: 'User ID mismatch' });
      }
      
      // Update progress
      const success = await updateGameProgress(progressUpdate);
      if (!success) {
        return res.status(500).json({ message: 'Failed to update game progress' });
      }
      
      return res.json({ message: 'Game progress updated successfully' });
    } catch (error) {
      console.error('Error updating game progress:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
