import { create } from 'zustand';

interface StarCelebration {
  id: string;
  targetPosition: [number, number, number];
}

interface GameState {
  // Player position for star celebrations
  playerPosition: [number, number, number];
  
  // Star celebrations
  starCelebrations: StarCelebration[];
  
  // Functions
  setPlayerPosition: (position: [number, number, number]) => void;
  triggerStarCelebration: (id: string, targetPosition: [number, number, number]) => void;
  completeCelebration: (id: string) => void;
}

export const useGame = create<GameState>((set) => ({
  // Initial state
  playerPosition: [0, 0.5, 0],
  starCelebrations: [],
  
  // Update player position
  setPlayerPosition: (position) => {
    set({ playerPosition: position });
  },
  
  // Trigger a star celebration
  triggerStarCelebration: (id, targetPosition) => {
    set((state) => ({
      starCelebrations: [
        ...state.starCelebrations,
        { id, targetPosition }
      ]
    }));
  },
  
  // Complete a celebration and remove it
  completeCelebration: (id) => {
    set((state) => ({
      starCelebrations: state.starCelebrations.filter(
        (celebration) => celebration.id !== id
      )
    }));
  }
}));