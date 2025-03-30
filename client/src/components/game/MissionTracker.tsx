import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useProgress } from '@/lib/stores/useProgress';
import { Mission } from '@/lib/gameData';
import { useAudio } from '@/lib/stores/useAudio';
import { toast } from 'sonner';
import { useGame } from '@/lib/stores/useGame';

interface MissionTrackerProps {
  missions: Mission[];
  toggleMission: (missionId: string) => void;
}

export function MissionTracker({ missions, toggleMission }: MissionTrackerProps) {
  const { playHit } = useAudio();
  const { triggerStarCelebration } = useGame();
  const missionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleToggleMission = (mission: Mission) => {
    if (!mission.isCompleted) {
      playHit();
      toggleMission(mission.id);
      
      // Get the DOM element for this mission card to find its position
      const missionEl = missionRefs.current.get(mission.id);
      if (missionEl) {
        const rect = missionEl.getBoundingClientRect();
        
        // Convert screen coordinates to normalized device coordinates (-1 to +1)
        const targetPosition: [number, number, number] = [
          (rect.left / window.innerWidth) * 2 - 1,
          -(rect.top / window.innerHeight) * 2 + 1,
          0.5  // Use a small z value to position it in front of camera
        ];
        
        // Trigger star celebration
        triggerStarCelebration(mission.id, targetPosition);
      }
      
      toast.success(`Mission completed: ${mission.description}`);
    } else {
      toggleMission(mission.id);
      toast.info(`Mission marked as incomplete: ${mission.description}`);
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="h-full w-full overflow-auto p-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-white">Mission Objectives</h2>
        
        {missions.map((mission) => (
          <motion.div
            key={mission.id}
            variants={item}
            ref={(el) => {
              if (el) missionRefs.current.set(mission.id, el);
            }}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all hover:border-blue-500 ${
              mission.isCompleted 
                ? 'border-green-500 bg-green-900 bg-opacity-20' 
                : 'border-gray-700 bg-gray-800 bg-opacity-50'
            } ${
              mission.isOptional ? 'border-dashed' : ''
            }`}
            onClick={() => handleToggleMission(mission)}
          >
            <div className="mt-0.5">
              <div 
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                  mission.isCompleted 
                    ? 'border-green-500 bg-green-500 text-white' 
                    : 'border-gray-400'
                }`}
              >
                {mission.isCompleted && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className={`text-lg font-semibold ${
                mission.isCompleted ? 'text-green-300' : 'text-white'
              }`}>
                {mission.description}
              </div>
              {mission.details && (
                <div className="mt-1 text-sm text-gray-400">{mission.details}</div>
              )}
              {mission.isOptional && (
                <div className="mt-2 rounded-full bg-yellow-900 bg-opacity-50 px-2 py-0.5 text-xs text-yellow-300">
                  Bonus
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
