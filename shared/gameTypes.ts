// Game progress interface
export interface GameProgress {
  userId: number;
  unlockedLevels: number[];
  completedLevels: number[];
  completedMissions: string[];
  unlockedSkills: string[];
  lastUpdated: string;
}

// Level interfaces
export interface GameLevel {
  id: number;
  name: string;
  description: string;
  timeframe: string;
  requirements: string[];
  rewards: string[];
}

// Mission interface
export interface GameMission {
  id: string;
  levelId: number;
  description: string;
  isRequired: boolean;
  isCompleted: boolean;
}

// Skill interface
export interface GameSkill {
  id: string;
  levelId: number;
  name: string;
  description: string;
  isUnlocked: boolean;
}
