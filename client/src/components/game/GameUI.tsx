import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Level } from '@/lib/gameData';

interface GameUIProps {
  level: Level;
  activeTab: 'missions' | 'skills';
  setActiveTab: (tab: 'missions' | 'skills') => void;
  progress: number;
  children: ReactNode;
}

export function GameUI({ level, activeTab, setActiveTab, progress, children }: GameUIProps) {
  return (
    <motion.div 
      className="h-full w-full bg-gradient-to-t from-black to-transparent"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="flex h-full flex-col">
        {/* Progress bar and level info */}
        <div className="flex w-full items-center justify-between bg-gray-900 bg-opacity-80 p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-900 bg-opacity-60 px-3 py-1 text-sm font-bold text-white">
              LEVEL {level.id}
            </div>
            <h2 className="text-lg font-bold text-white">{level.name}</h2>
          </div>
          
          <div className="flex w-1/2 items-center gap-4">
            <div className="flex-1 rounded-full bg-gray-800">
              <motion.div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'missions' 
                ? 'border-b-2 border-blue-500 bg-gray-900 bg-opacity-60 text-blue-400' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('missions')}
          >
            MISSIONS
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'skills' 
                ? 'border-b-2 border-green-500 bg-gray-900 bg-opacity-60 text-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('skills')}
          >
            SKILLS
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-900 bg-opacity-30">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
