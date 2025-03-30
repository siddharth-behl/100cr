import { Router, Request, Response } from 'express';
import { getGameProgress, updateGameProgress } from './mongodb';
import { GameProgress } from '../shared/gameTypes';

// Create router
const router = Router();

// Get game progress for a user
router.get('/:userId', async (req: Request, res: Response) => {
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

// Update mission status
router.post('/:userId/mission/:missionId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const missionId = req.params.missionId;
    const { completed } = req.body;
    
    // Get current progress
    const progress = await getGameProgress(userId);
    if (!progress) {
      return res.status(404).json({ message: 'Game progress not found' });
    }
    
    // Update mission status
    const updatedProgress: GameProgress = { ...progress };
    
    if (completed) {
      // Add mission to completed list if not already there
      if (!updatedProgress.completedMissions.includes(missionId)) {
        updatedProgress.completedMissions.push(missionId);
      }
    } else {
      // Remove mission from completed list
      updatedProgress.completedMissions = updatedProgress.completedMissions.filter(
        id => id !== missionId
      );
    }
    
    // Save updated progress
    const success = await updateGameProgress(updatedProgress);
    if (!success) {
      return res.status(500).json({ message: 'Failed to update mission status' });
    }
    
    return res.json({ 
      message: `Mission ${completed ? 'completed' : 'uncompleted'} successfully`,
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Error updating mission status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update skill status
router.post('/:userId/skill/:skillId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const skillId = req.params.skillId;
    const { unlocked } = req.body;
    
    // Get current progress
    const progress = await getGameProgress(userId);
    if (!progress) {
      return res.status(404).json({ message: 'Game progress not found' });
    }
    
    // Update skill status
    const updatedProgress: GameProgress = { ...progress };
    
    if (unlocked) {
      // Add skill to unlocked list if not already there
      if (!updatedProgress.unlockedSkills.includes(skillId)) {
        updatedProgress.unlockedSkills.push(skillId);
      }
    } else {
      // Remove skill from unlocked list
      updatedProgress.unlockedSkills = updatedProgress.unlockedSkills.filter(
        id => id !== skillId
      );
    }
    
    // Save updated progress
    const success = await updateGameProgress(updatedProgress);
    if (!success) {
      return res.status(500).json({ message: 'Failed to update skill status' });
    }
    
    return res.json({ 
      message: `Skill ${unlocked ? 'unlocked' : 'removed'} successfully`,
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Error updating skill status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update level status
router.post('/:userId/level/:levelId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const levelId = parseInt(req.params.levelId);
    const { unlocked, completed } = req.body;
    
    // Get current progress
    const progress = await getGameProgress(userId);
    if (!progress) {
      return res.status(404).json({ message: 'Game progress not found' });
    }
    
    // Update level status
    const updatedProgress: GameProgress = { ...progress };
    
    if (unlocked) {
      // Add level to unlocked list if not already there
      if (!updatedProgress.unlockedLevels.includes(levelId)) {
        updatedProgress.unlockedLevels.push(levelId);
        // Sort the levels in ascending order
        updatedProgress.unlockedLevels.sort((a, b) => a - b);
      }
    }
    
    if (completed) {
      // Add level to completed list if not already there
      if (!updatedProgress.completedLevels.includes(levelId)) {
        updatedProgress.completedLevels.push(levelId);
        // Sort the levels in ascending order
        updatedProgress.completedLevels.sort((a, b) => a - b);
      }
    } else if (completed === false) {
      // Remove level from completed list
      updatedProgress.completedLevels = updatedProgress.completedLevels.filter(
        id => id !== levelId
      );
    }
    
    // Save updated progress
    const success = await updateGameProgress(updatedProgress);
    if (!success) {
      return res.status(500).json({ message: 'Failed to update level status' });
    }
    
    return res.json({ 
      message: 'Level status updated successfully',
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Error updating level status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;