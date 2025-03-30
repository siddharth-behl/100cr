import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GAME_LEVELS, INITIAL_USER_PROGRESS, ACHIEVEMENTS } from '../constants';
import { 
  GamePhase, 
  Level, 
  Mission, 
  Skill, 
  UserProgress, 
  Achievement, 
  GameStats,
  GameAction,
  LevelId 
} from '../../types/game';

interface BusinessGameState {
  // Game state
  phase: GamePhase;
  levels: Level[];
  currentLevelId: LevelId;
  achievements: Achievement[];
  userProgress: UserProgress;
  gameStats: GameStats;
  
  // UI state
  showLevelUpModal: boolean;
  showAchievementModal: boolean;
  lastAchievement: Achievement | null;
  isSidebarOpen: boolean;
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setCurrentLevel: (levelId: LevelId) => void;
  toggleSidebar: () => void;
  
  // Game mechanics
  completeMission: (missionId: string) => void;
  updateMissionProgress: (missionId: string, progress: number) => void;
  unlockSkill: (skillId: string) => void;
  earnMoney: (amount: number) => void;
  spendMoney: (amount: number) => void;
  gainExperience: (amount: number) => void;
  
  // Modal actions
  closeLevelUpModal: () => void;
  closeAchievementModal: () => void;
  
  // Game management
  resetGame: () => void;
  saveGame: () => void;
  isSkillUnlockable: (skillId: string) => boolean;
  isLevelCompleted: (levelId: LevelId) => boolean;
  isLevelUnlockable: (levelId: LevelId) => boolean;
  
  // Helper methods
  getMissionById: (missionId: string) => Mission | undefined;
  getSkillById: (skillId: string) => Skill | undefined;
  getLevelById: (levelId: LevelId) => Level | undefined;
  
  // Debug
  debugCompleteCurrentLevel: () => void;
}

// Helper to check if all missions in a level are completed
const areAllMissionsCompleted = (levelId: LevelId, completedMissions: string[]) => {
  const level = GAME_LEVELS.find(l => l.id === levelId);
  if (!level) return false;
  
  return level.missions.every(mission => completedMissions.includes(mission.id));
};

// Helper to find prerequisites for a skill
const hasUnlockedPrerequisites = (skillId: string, unlockedSkills: string[]) => {
  // Find the skill
  let targetSkill: Skill | undefined;
  
  for (const level of GAME_LEVELS) {
    const skill = level.skills.find(s => s.id === skillId);
    if (skill) {
      targetSkill = skill;
      break;
    }
  }
  
  if (!targetSkill) return false;
  
  // If no prerequisites, it's unlockable
  if (targetSkill.requiredSkills.length === 0) return true;
  
  // Check if all prerequisites are unlocked
  return targetSkill.requiredSkills.every(req => unlockedSkills.includes(req));
};

// Create the store
export const useBusinessGame = create<BusinessGameState>()(
  persist(
    (set, get) => ({
      // Initial state
      phase: 'menu',
      levels: GAME_LEVELS,
      currentLevelId: 1,
      achievements: ACHIEVEMENTS,
      userProgress: INITIAL_USER_PROGRESS,
      gameStats: {
        totalPlayTime: 0,
        moneyEarned: 0,
        missionsCompleted: 0,
        skillsUnlocked: 0,
        levelsCompleted: []
      },
      
      // UI state
      showLevelUpModal: false,
      showAchievementModal: false,
      lastAchievement: null,
      isSidebarOpen: true,
      
      // Actions
      setPhase: (phase) => set({ phase }),
      
      setCurrentLevel: (levelId) => {
        const { levels } = get();
        const targetLevel = levels.find(l => l.id === levelId);
        
        if (targetLevel && (targetLevel.isUnlocked || levelId === 1)) {
          set({ currentLevelId: levelId });
        }
      },
      
      toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      // Game mechanics
      completeMission: (missionId) => {
        const { userProgress, levels, achievements } = get();
        const updatedLevels = [...levels];
        let mission: Mission | undefined;
        let levelIndex = -1;
        
        // Find the mission and its level
        for (let i = 0; i < updatedLevels.length; i++) {
          const missionIndex = updatedLevels[i].missions.findIndex(m => m.id === missionId);
          if (missionIndex !== -1) {
            mission = updatedLevels[i].missions[missionIndex];
            levelIndex = i;
            updatedLevels[i].missions[missionIndex].isCompleted = true;
            updatedLevels[i].missions[missionIndex].progress = 100;
            break;
          }
        }
        
        if (!mission || levelIndex === -1) return;
        
        // Update user progress
        const updatedProgress = {
          ...userProgress,
          completedMissions: [...userProgress.completedMissions, missionId],
          money: userProgress.money + mission.reward,
          experience: userProgress.experience + Math.floor(mission.reward / 10),
          lastSaved: new Date().toISOString()
        };
        
        // Check for first mission achievement
        let updatedAchievements = [...achievements];
        let newlyUnlockedAchievement: Achievement | null = null;
        
        // First mission achievement
        if (updatedProgress.completedMissions.length === 1) {
          const achievementIndex = updatedAchievements.findIndex(a => a.id === 'achievement_first_mission');
          if (achievementIndex !== -1 && !updatedAchievements[achievementIndex].isUnlocked) {
            updatedAchievements[achievementIndex].isUnlocked = true;
            newlyUnlockedAchievement = updatedAchievements[achievementIndex];
            updatedProgress.money += newlyUnlockedAchievement.reward;
          }
        }
        
        // Check if level is completed
        const isLevelCompleted = areAllMissionsCompleted(updatedLevels[levelIndex].id, updatedProgress.completedMissions);
        
        if (isLevelCompleted) {
          updatedLevels[levelIndex].isCompleted = true;
          
          // Unlock next level if available
          if (levelIndex < updatedLevels.length - 1) {
            updatedLevels[levelIndex + 1].isUnlocked = true;
            
            // Check for level up achievement
            const achievementIndex = updatedAchievements.findIndex(a => a.id === 'achievement_level_up');
            if (achievementIndex !== -1 && !updatedAchievements[achievementIndex].isUnlocked) {
              updatedAchievements[achievementIndex].isUnlocked = true;
              newlyUnlockedAchievement = updatedAchievements[achievementIndex];
              updatedProgress.money += newlyUnlockedAchievement.reward;
            }
            
            // Show level up modal
            set({ showLevelUpModal: true });
          }
        }
        
        // Update game stats
        const updatedStats = {
          ...get().gameStats,
          moneyEarned: get().gameStats.moneyEarned + mission.reward,
          missionsCompleted: get().gameStats.missionsCompleted + 1
        };
        
        if (isLevelCompleted) {
          updatedStats.levelsCompleted = [...updatedStats.levelsCompleted, updatedLevels[levelIndex].id];
        }
        
        // Show achievement modal if needed
        if (newlyUnlockedAchievement) {
          set({
            showAchievementModal: true,
            lastAchievement: newlyUnlockedAchievement
          });
        }
        
        set({
          levels: updatedLevels,
          userProgress: updatedProgress,
          achievements: updatedAchievements,
          gameStats: updatedStats
        });
      },
      
      updateMissionProgress: (missionId, progress) => {
        const { levels } = get();
        const updatedLevels = [...levels];
        
        // Find and update the mission
        for (let i = 0; i < updatedLevels.length; i++) {
          const missionIndex = updatedLevels[i].missions.findIndex(m => m.id === missionId);
          if (missionIndex !== -1) {
            updatedLevels[i].missions[missionIndex].progress = progress;
            
            // Auto-complete if progress reaches 100
            if (progress >= 100 && !updatedLevels[i].missions[missionIndex].isCompleted) {
              get().completeMission(missionId);
              return;
            }
            break;
          }
        }
        
        set({ levels: updatedLevels });
      },
      
      unlockSkill: (skillId) => {
        const { userProgress, levels, achievements } = get();
        const updatedLevels = [...levels];
        let skill: Skill | undefined;
        let levelIndex = -1;
        
        // Find the skill and its level
        for (let i = 0; i < updatedLevels.length; i++) {
          const skillIndex = updatedLevels[i].skills.findIndex(s => s.id === skillId);
          if (skillIndex !== -1) {
            skill = updatedLevels[i].skills[skillIndex];
            levelIndex = i;
            updatedLevels[i].skills[skillIndex].isUnlocked = true;
            break;
          }
        }
        
        if (!skill || levelIndex === -1) return;
        
        // Update user progress
        const updatedProgress = {
          ...userProgress,
          unlockedSkills: [...userProgress.unlockedSkills, skillId],
          lastSaved: new Date().toISOString()
        };
        
        // Check for first skill achievement
        let updatedAchievements = [...achievements];
        let newlyUnlockedAchievement: Achievement | null = null;
        
        if (updatedProgress.unlockedSkills.length === 1) {
          const achievementIndex = updatedAchievements.findIndex(a => a.id === 'achievement_first_skill');
          if (achievementIndex !== -1 && !updatedAchievements[achievementIndex].isUnlocked) {
            updatedAchievements[achievementIndex].isUnlocked = true;
            newlyUnlockedAchievement = updatedAchievements[achievementIndex];
            updatedProgress.money += newlyUnlockedAchievement.reward;
          }
        }
        
        // Update game stats
        const updatedStats = {
          ...get().gameStats,
          skillsUnlocked: get().gameStats.skillsUnlocked + 1
        };
        
        // Show achievement modal if needed
        if (newlyUnlockedAchievement) {
          set({
            showAchievementModal: true,
            lastAchievement: newlyUnlockedAchievement
          });
        }
        
        set({
          levels: updatedLevels,
          userProgress: updatedProgress,
          achievements: updatedAchievements,
          gameStats: updatedStats
        });
      },
      
      earnMoney: (amount) => {
        const { userProgress, achievements } = get();
        const newBalance = userProgress.money + amount;
        
        // Check for first lakh achievement
        let updatedAchievements = [...achievements];
        let newlyUnlockedAchievement: Achievement | null = null;
        
        if (userProgress.money < 100000 && newBalance >= 100000) {
          const achievementIndex = updatedAchievements.findIndex(a => a.id === 'achievement_first_lakh');
          if (achievementIndex !== -1 && !updatedAchievements[achievementIndex].isUnlocked) {
            updatedAchievements[achievementIndex].isUnlocked = true;
            newlyUnlockedAchievement = updatedAchievements[achievementIndex];
          }
        }
        
        // Check for first crore achievement
        if (userProgress.money < 10000000 && newBalance >= 10000000) {
          const achievementIndex = updatedAchievements.findIndex(a => a.id === 'achievement_first_crore');
          if (achievementIndex !== -1 && !updatedAchievements[achievementIndex].isUnlocked) {
            updatedAchievements[achievementIndex].isUnlocked = true;
            newlyUnlockedAchievement = updatedAchievements[achievementIndex];
          }
        }
        
        // Update game stats
        const updatedStats = {
          ...get().gameStats,
          moneyEarned: get().gameStats.moneyEarned + amount
        };
        
        // Show achievement modal if needed
        if (newlyUnlockedAchievement) {
          set({
            showAchievementModal: true,
            lastAchievement: newlyUnlockedAchievement
          });
          
          // Add achievement reward to balance
          newBalance += newlyUnlockedAchievement.reward;
        }
        
        set({
          userProgress: {
            ...userProgress,
            money: newBalance,
            lastSaved: new Date().toISOString()
          },
          achievements: updatedAchievements,
          gameStats: updatedStats
        });
      },
      
      spendMoney: (amount) => {
        const { userProgress } = get();
        
        if (userProgress.money < amount) return;
        
        set({
          userProgress: {
            ...userProgress,
            money: userProgress.money - amount,
            lastSaved: new Date().toISOString()
          }
        });
      },
      
      gainExperience: (amount) => {
        const { userProgress } = get();
        
        set({
          userProgress: {
            ...userProgress,
            experience: userProgress.experience + amount,
            lastSaved: new Date().toISOString()
          }
        });
      },
      
      // Modal actions
      closeLevelUpModal: () => set({ showLevelUpModal: false }),
      closeAchievementModal: () => set({ showAchievementModal: false }),
      
      // Game management
      resetGame: () => set({
        levels: GAME_LEVELS.map(level => ({
          ...level,
          isCompleted: false,
          isUnlocked: level.id === 1,
          missions: level.missions.map(mission => ({
            ...mission,
            isCompleted: false,
            progress: 0
          })),
          skills: level.skills.map(skill => ({
            ...skill,
            isUnlocked: false
          }))
        })),
        currentLevelId: 1,
        userProgress: INITIAL_USER_PROGRESS,
        achievements: ACHIEVEMENTS.map(achievement => ({
          ...achievement,
          isUnlocked: false
        })),
        gameStats: {
          totalPlayTime: 0,
          moneyEarned: 0,
          missionsCompleted: 0,
          skillsUnlocked: 0,
          levelsCompleted: []
        },
        phase: 'menu'
      }),
      
      saveGame: () => {
        // The persist middleware handles this automatically
        set(state => ({
          userProgress: {
            ...state.userProgress,
            lastSaved: new Date().toISOString()
          }
        }));
      },
      
      isSkillUnlockable: (skillId) => {
        const { userProgress } = get();
        return hasUnlockedPrerequisites(skillId, userProgress.unlockedSkills);
      },
      
      isLevelCompleted: (levelId) => {
        const { levels } = get();
        const level = levels.find(l => l.id === levelId);
        return level ? level.isCompleted : false;
      },
      
      isLevelUnlockable: (levelId) => {
        const { levels, userProgress } = get();
        
        // Level 1 is always unlocked
        if (levelId === 1) return true;
        
        // Previous level must be completed
        const prevLevel = levels.find(l => l.id === levelId - 1);
        if (!prevLevel || !prevLevel.isCompleted) return false;
        
        return true;
      },
      
      // Helper methods
      getMissionById: (missionId) => {
        const { levels } = get();
        for (const level of levels) {
          const mission = level.missions.find(m => m.id === missionId);
          if (mission) return mission;
        }
        return undefined;
      },
      
      getSkillById: (skillId) => {
        const { levels } = get();
        for (const level of levels) {
          const skill = level.skills.find(s => s.id === skillId);
          if (skill) return skill;
        }
        return undefined;
      },
      
      getLevelById: (levelId) => {
        const { levels } = get();
        return levels.find(l => l.id === levelId);
      },
      
      // Debug
      debugCompleteCurrentLevel: () => {
        const { currentLevelId, levels } = get();
        const level = levels.find(l => l.id === currentLevelId);
        
        if (!level) return;
        
        // Complete all missions
        level.missions.forEach(mission => {
          if (!mission.isCompleted) {
            get().completeMission(mission.id);
          }
        });
      }
    }),
    {
      name: "business-empire-game",
      partialize: (state) => ({
        levels: state.levels,
        userProgress: state.userProgress,
        achievements: state.achievements,
        gameStats: state.gameStats
      })
    }
  )
);
