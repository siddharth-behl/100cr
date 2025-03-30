import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/lib/stores/useGameState';
import { useProgress } from '@/lib/stores/useProgress';
import { levelsData } from '@/lib/gameData';
import { useAudio } from '@/lib/stores/useAudio';

export function LevelSelect() {
  const { setGameMode, setCurrentLevel } = useGameState();
  const { unlockedLevels } = useProgress();
  const { playSuccess } = useAudio();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const handleLevelSelect = (levelId: number) => {
    if (!unlockedLevels.includes(levelId)) return;
    
    setSelectedLevel(levelId);
    playSuccess();
    
    // Short delay before starting level
    setTimeout(() => {
      setCurrentLevel(levelId);
      setGameMode('level-play');
    }, 500);
  };

  return (
    <div className="h-full w-full overflow-auto bg-gradient-to-b from-slate-900 to-blue-900 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          THE ₹100Cr GAME: LEVEL SELECT
        </h1>
        
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {levelsData.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            const isSelected = selectedLevel === level.id;
            
            return (
              <motion.div
                key={level.id}
                variants={item}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                className={`relative cursor-pointer overflow-hidden rounded-lg border-4 ${
                  isSelected 
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/30'
                    : isUnlocked 
                      ? 'border-green-500 shadow-lg shadow-green-500/20' 
                      : 'border-gray-700 opacity-50'
                }`}
                onClick={() => handleLevelSelect(level.id)}
              >
                <div className="bg-black bg-opacity-70 p-6">
                  <h2 className={`mb-2 text-2xl font-bold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    LEVEL {level.id}: {level.name}
                  </h2>
                  <p className="mb-4 text-gray-300">{level.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded bg-blue-900 px-3 py-1 text-sm text-white">
                      {level.timeframe}
                    </span>
                    
                    <span className={`rounded px-3 py-1 text-sm ${
                      isUnlocked ? 'bg-green-800 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                  
                  {!isUnlocked && (
                    <div className="mt-4 text-center text-sm text-red-400">
                      Complete previous level to unlock
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
