import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/lib/stores/useGameState';
import { useProgress } from '@/lib/stores/useProgress';
import { LevelSelect } from './LevelSelect';
import { LevelScene } from './LevelScene';
import { Dashboard } from './Dashboard';
import { Navigation } from './Navigation';
import { LevelUpModal } from './LevelUpModal';
import { useAudio } from '@/lib/stores/useAudio';

export function GameContainer() {
  const { gameMode, setGameMode, currentLevel } = useGameState();
  const { showLevelUp, setShowLevelUp, completedLevels } = useProgress();
  const { toggleMute, isMuted } = useAudio();
  const [firstLoad, setFirstLoad] = useState(true);

  // Welcome screen animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFirstLoad(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle sound toggle
  const handleSoundToggle = () => {
    toggleMute();
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#111111]">
      {/* Welcome Screen Animation */}
      <AnimatePresence>
        {firstLoad && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="mb-2 text-4xl font-bold">₹100Cr GAME</h1>
              <p className="text-xl">LEVEL UP OR STAY BROKE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound control */}
      <button
        onClick={handleSoundToggle}
        className="absolute right-4 top-4 z-40 rounded-full bg-gray-800 p-2 text-white"
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="h-full w-full pb-16 pt-14">
        {gameMode === 'level-select' && <LevelSelect />}
        {gameMode === 'level-play' && <LevelScene />}
        {gameMode === 'dashboard' && <Dashboard />}
      </div>

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpModal
            level={completedLevels[completedLevels.length - 1]}
            onClose={() => setShowLevelUp(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
