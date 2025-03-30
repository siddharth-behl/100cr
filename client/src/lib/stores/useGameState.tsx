import { create } from 'zustand';

export type GameMode = 'level-select' | 'level-play' | 'dashboard';

interface GameState {
  gameMode: GameMode;
  currentLevel: number;
  
  // Actions
  setGameMode: (mode: GameMode) => void;
  setCurrentLevel: (level: number) => void;
}

export const useGameState = create<GameState>((set) => ({
  gameMode: 'level-select',
  currentLevel: 1,
  
  setGameMode: (mode) => set({ gameMode: mode }),
  setCurrentLevel: (level) => set({ currentLevel: level })
}));
