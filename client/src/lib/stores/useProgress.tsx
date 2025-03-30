import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { levelsData } from '../gameData';
import { apiRequest } from '../queryClient';

interface ProgressState {
  // User info
  userId: number;
  
  // Level progression
  unlockedLevels: number[];
  completedLevels: number[];
  
  // Missions and skills
  completedMissions: string[];
  unlockedSkills: string[];
  
  // Level up modal
  showLevelUp: boolean;
  
  // Sync status
  isSyncing: boolean;
  
  // Actions
  unlockLevel: (levelId: number) => void;
  completeLevel: (levelId: number) => void;
  toggleMission: (missionId: string) => void;
  unlockSkill: (skillId: string) => void;
  removeSkill: (skillId: string) => void;
  updateProgress: () => void;
  setShowLevelUp: (show: boolean) => void;
  
  // Sync with server
  syncWithServer: () => Promise<void>;
  loadFromServer: (userId: number) => Promise<void>;
  
  // Reset progress (for testing)
  resetProgress: () => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      userId: 1, // Default to first user
      unlockedLevels: [1], // Start with first level unlocked
      completedLevels: [],
      completedMissions: [],
      unlockedSkills: [],
      showLevelUp: false,
      isSyncing: false,
      
      unlockLevel: (levelId) => {
        set((state) => {
          // Only add the level if it's not already unlocked
          if (!state.unlockedLevels.includes(levelId)) {
            return { 
              unlockedLevels: [...state.unlockedLevels, levelId].sort((a, b) => a - b)
            };
          }
          return {};
        });
        
        // Sync the level unlock with the server
        get().syncWithServer();
      },
      
      completeLevel: (levelId) => {
        set((state) => {
          // Only add the level if it's not already completed
          if (!state.completedLevels.includes(levelId)) {
            // Unlock the next level if it exists
            const nextLevelId = levelId + 1;
            const nextLevelExists = levelsData.some(level => level.id === nextLevelId);
            
            if (nextLevelExists && !state.unlockedLevels.includes(nextLevelId)) {
              return {
                completedLevels: [...state.completedLevels, levelId].sort((a, b) => a - b),
                unlockedLevels: [...state.unlockedLevels, nextLevelId].sort((a, b) => a - b),
                showLevelUp: true
              };
            }
            
            return { 
              completedLevels: [...state.completedLevels, levelId].sort((a, b) => a - b),
              showLevelUp: true
            };
          }
          return {};
        });
        
        // Sync the level completion with the server
        get().syncWithServer();
      },
      
      toggleMission: (missionId) => {
        set((state) => {
          const isMissionCompleted = state.completedMissions.includes(missionId);
          
          if (isMissionCompleted) {
            // Remove from completed missions
            return {
              completedMissions: state.completedMissions.filter(id => id !== missionId)
            };
          } else {
            // Add to completed missions
            return {
              completedMissions: [...state.completedMissions, missionId]
            };
          }
        });
        
        // Update missions in level data
        get().updateProgress();
        
        // Sync the mission toggle with the server
        get().syncWithServer();
      },
      
      unlockSkill: (skillId) => {
        set((state) => {
          // Only add the skill if it's not already unlocked
          if (!state.unlockedSkills.includes(skillId)) {
            return { 
              unlockedSkills: [...state.unlockedSkills, skillId]
            };
          }
          return {};
        });
        
        // Sync the skill unlock with the server
        get().syncWithServer();
      },
      
      removeSkill: (skillId) => {
        set((state) => {
          // Only remove the skill if it's in the unlocked skills array
          if (state.unlockedSkills.includes(skillId)) {
            return {
              unlockedSkills: state.unlockedSkills.filter(id => id !== skillId)
            };
          }
          return {};
        });
        
        // Sync the skill removal with the server
        get().syncWithServer();
      },
      
      updateProgress: () => {
        // Update the missions in the level data based on completed missions
        levelsData.forEach(level => {
          level.missions.forEach(mission => {
            const isMissionCompleted = get().completedMissions.includes(mission.id);
            mission.isCompleted = isMissionCompleted;
          });
          
          // Check if all required missions are completed
          const allRequiredMissionsCompleted = level.missions
            .filter(mission => !mission.isOptional)
            .every(mission => mission.isCompleted);
          
          // Auto-complete level if all required missions are done
          if (allRequiredMissionsCompleted && !get().completedLevels.includes(level.id)) {
            get().completeLevel(level.id);
          }
        });
      },
      
      setShowLevelUp: (show) => {
        set({ showLevelUp: show });
      },
      
      // Sync with MongoDB server
      syncWithServer: async () => {
        try {
          // Don't sync if already syncing
          if (get().isSyncing) return;
          
          set({ isSyncing: true });
          
          const userId = get().userId;
          const progress = {
            userId,
            unlockedLevels: get().unlockedLevels,
            completedLevels: get().completedLevels,
            completedMissions: get().completedMissions,
            unlockedSkills: get().unlockedSkills,
            lastUpdated: new Date().toISOString()
          };
          
          // Send progress to the server
          const response = await apiRequest('PUT', `/api/progress/${userId}`, progress);
          if (!response.ok) {
            console.error('Failed to sync progress with server');
          } else {
            console.log('Progress synced with server');
          }
        } catch (error) {
          console.error('Error syncing with server:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
      
      // Load progress from the server
      loadFromServer: async (userId) => {
        try {
          set({ isSyncing: true, userId });
          
          // Get progress from the server
          const response = await fetch(`/api/progress/${userId}`);
          
          if (!response.ok) {
            // If not found, create a new progress record
            if (response.status === 404) {
              await get().syncWithServer();
            } else {
              console.error('Failed to load progress from server');
            }
            return;
          }
          
          const data = await response.json();
          const { progress } = data;
          
          // Update local state with server data
          set({
            unlockedLevels: progress.unlockedLevels,
            completedLevels: progress.completedLevels,
            completedMissions: progress.completedMissions,
            unlockedSkills: progress.unlockedSkills
          });
          
          // Update missions in level data
          get().updateProgress();
          
          console.log('Progress loaded from server');
        } catch (error) {
          console.error('Error loading from server:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
      
      resetProgress: () => {
        const userId = get().userId;
        
        set({
          userId,
          unlockedLevels: [1],
          completedLevels: [],
          completedMissions: [],
          unlockedSkills: [],
          showLevelUp: false,
          isSyncing: false
        });
        
        // Reset mission completion status
        levelsData.forEach(level => {
          level.missions.forEach(mission => {
            mission.isCompleted = false;
          });
        });
        
        // Sync the reset with the server
        get().syncWithServer();
      }
    }),
    {
      name: 'game-progress' // localStorage key
    }
  )
);
