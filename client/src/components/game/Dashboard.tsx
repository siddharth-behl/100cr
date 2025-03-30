import { useState } from 'react';
import { motion } from 'framer-motion';
import { levelsData } from '@/lib/gameData';
import { useProgress } from '@/lib/stores/useProgress';
import { useGameState } from '@/lib/stores/useGameState';

export function Dashboard() {
  const { unlockedLevels, completedLevels, unlockedSkills } = useProgress();
  const { setGameMode, setCurrentLevel } = useGameState();
  
  // Calculate overall progress
  const totalLevels = levelsData.length;
  const completedLevelsCount = completedLevels.length;
  const overallProgress = Math.round((completedLevelsCount / totalLevels) * 100);
  
  // Calculate total skills unlocked
  const totalSkills = levelsData.reduce((acc, level) => acc + level.skills.length, 0);
  const unlockedSkillsPercent = Math.round((unlockedSkills.length / totalSkills) * 100);
  
  // Get all skills from all levels
  const allSkills = levelsData.flatMap(level => level.skills);
  
  return (
    <div className="h-full w-full overflow-auto bg-gradient-to-br from-gray-900 to-blue-900 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-black bg-opacity-50 p-6 md:flex-row">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">Business Empire Dashboard</h1>
            <p className="mt-2 text-gray-300">Track your journey from startup to ₹100Cr empire</p>
          </div>
          
          <button
            onClick={() => setGameMode('level-select')}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
          >
            Back to Level Select
          </button>
        </div>
        
        {/* Progress overview */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <ProgressCard
            title="Overall Progress"
            percent={overallProgress}
            label={`${completedLevelsCount}/${totalLevels} Levels`}
            color="from-blue-600 to-blue-400"
          />
          
          <ProgressCard
            title="Skills Unlocked"
            percent={unlockedSkillsPercent}
            label={`${unlockedSkills.length}/${totalSkills} Skills`}
            color="from-green-600 to-green-400"
          />
          
          <div className="flex rounded-xl bg-black bg-opacity-50 p-6">
            <div className="w-full">
              <h3 className="mb-4 text-xl font-bold text-white">Empire Status</h3>
              
              <div className="space-y-2">
                <StatusItem
                  label="Current Level"
                  value={unlockedLevels.length > 0 
                    ? `Level ${Math.max(...unlockedLevels)}: ${levelsData.find(l => l.id === Math.max(...unlockedLevels))?.name}`
                    : "Not started"}
                />
                
                <StatusItem
                  label="Business Stage"
                  value={completedLevelsCount >= 3 
                    ? "Scaling Business" 
                    : completedLevelsCount >= 1 
                      ? "Growing Business" 
                      : "Startup Phase"}
                />
                
                <StatusItem
                  label="Net Worth"
                  value={completedLevelsCount >= 4 
                    ? "₹10Cr+" 
                    : completedLevelsCount >= 3 
                      ? "₹2Cr+" 
                      : completedLevelsCount >= 2 
                        ? "₹20L+" 
                        : completedLevelsCount >= 1 
                          ? "₹5L+" 
                          : "₹0"}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Level Progress */}
        <div className="mb-8 rounded-xl bg-black bg-opacity-50 p-6">
          <h3 className="mb-6 text-xl font-bold text-white">Level Progress</h3>
          
          <div className="space-y-4">
            {levelsData.map(level => {
              const isUnlocked = unlockedLevels.includes(level.id);
              const isCompleted = completedLevels.includes(level.id);
              
              return (
                <div 
                  key={level.id}
                  className={`rounded-lg p-4 ${
                    isCompleted 
                      ? 'bg-green-900 bg-opacity-20' 
                      : isUnlocked 
                        ? 'bg-blue-900 bg-opacity-20' 
                        : 'bg-gray-800 bg-opacity-20'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        Level {level.id}: {level.name}
                      </h4>
                      <p className="text-sm text-gray-300">{level.timeframe}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full px-3 py-1 text-sm ${
                        isCompleted 
                          ? 'bg-green-900 text-green-300' 
                          : isUnlocked 
                            ? 'bg-blue-900 text-blue-300' 
                            : 'bg-gray-800 text-gray-400'
                      }`}>
                        {isCompleted 
                          ? 'COMPLETED' 
                          : isUnlocked 
                            ? 'UNLOCKED' 
                            : 'LOCKED'}
                      </div>
                      
                      {isUnlocked && !isCompleted && (
                        <button
                          onClick={() => {
                            setCurrentLevel(level.id);
                            setGameMode('level-play');
                          }}
                          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                        >
                          Continue
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Unlocked Skills */}
        <div className="rounded-xl bg-black bg-opacity-50 p-6">
          <h3 className="mb-6 text-xl font-bold text-white">Unlocked Skills</h3>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allSkills
              .filter(skill => unlockedSkills.includes(skill.id))
              .map(skill => (
                <div 
                  key={skill.id}
                  className="rounded-lg border border-green-500 bg-green-900 bg-opacity-10 p-4"
                >
                  <h4 className="text-lg font-bold text-green-400">{skill.name}</h4>
                  <p className="mt-1 text-sm text-gray-300">{skill.description}</p>
                </div>
              ))}
              
            {unlockedSkills.length === 0 && (
              <div className="col-span-full text-center text-gray-400">
                No skills unlocked yet. Complete missions to unlock skills.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressCard({ title, percent, label, color }: { 
  title: string, 
  percent: number, 
  label: string, 
  color: string 
}) {
  return (
    <div className="flex rounded-xl bg-black bg-opacity-50 p-6">
      <div className="w-full">
        <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>
        
        <div className="relative h-4 w-full rounded-full bg-gray-800">
          <motion.div 
            className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="mt-3 flex justify-between">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          <span className="text-sm font-medium text-white">{percent}%</span>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-400">{label}:</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
