// Game phase types
export type GamePhase = "menu" | "playing" | "paused" | "levelComplete" | "gameOver";

// Level types
export type LevelId = 1 | 2 | 3 | 4 | 5;

export interface Level {
  id: LevelId;
  name: string;
  description: string;
  timeframe: string;
  goal: string;
  missions: Mission[];
  skills: Skill[];
  unlockRequirements: string[];
  rewards: string[];
  isUnlocked: boolean;
  isCompleted: boolean;
}

// Mission types
export interface Mission {
  id: string;
  name: string;
  description: string;
  reward: number; // Money or experience points
  isCompleted: boolean;
  progress: number; // 0-100
  requirements: string[];
  levelId: LevelId;
}

// Skill types
export interface Skill {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  icon: string;
  requiredSkills: string[];
  levelId: LevelId;
}

// User progress
export interface UserProgress {
  currentLevel: LevelId;
  money: number;
  experience: number;
  completedMissions: string[];
  unlockedSkills: string[];
  lastSaved: string;
}

// Achievement type
export interface Achievement {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  icon: string;
  reward: number;
}

// Game statistics
export interface GameStats {
  totalPlayTime: number;
  moneyEarned: number;
  missionsCompleted: number;
  skillsUnlocked: number;
  levelsCompleted: LevelId[];
}

// Action performed by user
export type GameAction = 
  | { type: 'COMPLETE_MISSION'; missionId: string }
  | { type: 'UNLOCK_SKILL'; skillId: string }
  | { type: 'LEVEL_UP'; levelId: LevelId }
  | { type: 'EARN_MONEY'; amount: number }
  | { type: 'SPEND_MONEY'; amount: number }
  | { type: 'GAIN_EXPERIENCE'; amount: number }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_GAME'; state: any };
