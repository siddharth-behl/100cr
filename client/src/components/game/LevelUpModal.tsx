import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Level } from '@/lib/gameData';
import { levelsData } from '@/lib/gameData';
import { useAudio } from '@/lib/stores/useAudio';
import Confetti from 'react-confetti';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const { playSuccess } = useAudio();
  const levelData = levelsData.find(l => l.id === level);
  const nextLevelData = levelsData.find(l => l.id === level + 1);
  
  useEffect(() => {
    playSuccess();
    
    // Auto-close after 8 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [playSuccess, onClose]);

  if (!levelData) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
        gravity={0.1}
      />
      
      <motion.div
        className="relative mx-4 max-w-xl overflow-hidden rounded-lg bg-gradient-to-b from-blue-900 to-purple-900"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <div className="p-6 text-center">
          <h2 className="mb-2 text-4xl font-bold text-yellow-300">LEVEL COMPLETE!</h2>
          <h3 className="mb-6 text-2xl font-semibold text-white">
            Level {levelData.id}: {levelData.name}
          </h3>
          
          <div className="mb-6 rounded-lg bg-black bg-opacity-30 p-4 text-white">
            <p className="mb-2 text-lg">You have successfully:</p>
            <ul className="list-inside list-disc space-y-1 text-left text-green-300">
              <li>Completed all required missions</li>
              <li>Mastered critical business skills</li>
              <li>{levelData.completionMessage}</li>
            </ul>
          </div>
          
          {nextLevelData && (
            <div className="mb-6">
              <p className="text-lg text-white">Next challenge:</p>
              <div className="mt-2 rounded-lg bg-blue-800 bg-opacity-30 p-3">
                <h4 className="text-xl font-bold text-blue-300">
                  Level {nextLevelData.id}: {nextLevelData.name}
                </h4>
                <p className="mt-1 text-sm text-blue-200">{nextLevelData.description}</p>
              </div>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 rounded-lg bg-green-600 px-6 py-3 text-lg font-bold text-white transition-all hover:bg-green-700"
            onClick={onClose}
          >
            CONTINUE
          </motion.button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-yellow-500 opacity-20 blur-xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-600 opacity-20 blur-xl" />
      </motion.div>
    </motion.div>
  );
}
