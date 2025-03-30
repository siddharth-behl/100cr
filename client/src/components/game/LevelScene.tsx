import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/lib/stores/useGameState';
import { useProgress } from '@/lib/stores/useProgress';
import { levelsData } from '@/lib/gameData';
import { ThreeScene } from './ThreeScene';
import { MissionTracker } from './MissionTracker';
import { SkillTree } from './SkillTree';
import { GameUI } from './GameUI';
import { useAudio } from '@/lib/stores/useAudio';

export function LevelScene() {
  const { currentLevel, setGameMode } = useGameState();
  const { toggleMission, unlockLevel, updateProgress, completedLevels, setShowLevelUp } = useProgress();
  const { playSuccess } = useAudio();
  const [activeTab, setActiveTab] = useState<'missions' | 'skills'>('missions');
  const [showIntro, setShowIntro] = useState(true);

  const levelData = levelsData.find(level => level.id === currentLevel);

  useEffect(() => {
    // Reset intro state when level changes
    setShowIntro(true);
    
    // Auto-hide intro after 5 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentLevel]);

  const handleCompleteLevel = () => {
    if (!levelData) return;
    
    // Add level to completed levels if not already completed
    if (!completedLevels.includes(levelData.id)) {
      unlockLevel(levelData.id + 1);
      playSuccess();
      setShowLevelUp(true);
    }
    
    // Return to level select
    setTimeout(() => {
      setGameMode('level-select');
    }, 1000);
  };

  if (!levelData) return null;

  const allMissionsCompleted = levelData.missions.every(mission => 
    mission.isCompleted || mission.isOptional
  );

  const completedMissionCount = levelData.missions.filter(m => m.isCompleted).length;
  const totalRequiredMissions = levelData.missions.filter(m => !m.isOptional).length;
  const progress = (completedMissionCount / totalRequiredMissions) * 100;

  return (
    <div className="relative h-full w-full bg-black">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <ThreeScene level={currentLevel} />
      </div>
      
      {/* Level Introduction Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="mx-auto max-w-3xl p-8 text-center text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="mb-4 text-4xl font-bold text-yellow-400">LEVEL {levelData.id}: {levelData.name}</h1>
              <h2 className="mb-6 text-2xl">{levelData.timeframe}</h2>
              <p className="mb-8 text-xl">{levelData.description}</p>
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="text-lg">Mission: </span>
                <span className="text-xl font-bold text-green-400">{levelData.mission}</span>
              </div>
              <div className="mb-8 flex items-center justify-center gap-3">
                <span className="text-lg">Goal: </span>
                <span className="text-xl font-bold text-blue-400">{levelData.goal}</span>
              </div>
              
              <button 
                className="rounded-lg bg-blue-600 px-6 py-2 text-lg font-bold text-white transition-all hover:bg-blue-700"
                onClick={() => setShowIntro(false)}
              >
                START LEVEL
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game Interface */}
      <div className="absolute bottom-0 left-0 z-10 h-1/2 w-full">
        <GameUI 
          level={levelData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          progress={progress}
        >
          {activeTab === 'missions' ? (
            <MissionTracker 
              missions={levelData.missions}
              toggleMission={toggleMission}
            />
          ) : (
            <SkillTree skills={levelData.skills} />
          )}
        </GameUI>
      </div>
      
      {/* Complete Level Button */}
      {allMissionsCompleted && (
        <motion.div 
          className="absolute bottom-4 right-4 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={handleCompleteLevel}
            className="rounded-lg bg-green-600 px-6 py-3 text-lg font-bold text-white transition-all hover:bg-green-700"
          >
            COMPLETE LEVEL
          </button>
        </motion.div>
      )}
    </div>
  );
}
