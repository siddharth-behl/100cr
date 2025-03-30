import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Skill } from '@/lib/gameData';
import { useProgress } from '@/lib/stores/useProgress';
import { toast } from 'sonner';
import { useAudio } from '@/lib/stores/useAudio';
import { useGame } from '@/lib/stores/useGame';
import { TrashIcon, LockOpenIcon } from 'lucide-react';

interface SkillTreeProps {
  skills: Skill[];
}

export function SkillTree({ skills }: SkillTreeProps) {
  const { unlockedSkills, unlockSkill, removeSkill } = useProgress();
  const { playHit, playSuccess } = useAudio();
  const { triggerStarCelebration } = useGame();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const skillRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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
    hidden: { scale: 0.8, opacity: 0 },
    show: { scale: 1, opacity: 1 }
  };

  const handleSkillClick = (skill: Skill) => {
    const isUnlocked = unlockedSkills.includes(skill.id);
    
    if (!isUnlocked) {
      // Unlock the skill
      unlockSkill(skill.id);
      playSuccess();
      
      // Get the DOM element for this skill card to find its position
      const skillEl = skillRefs.current.get(skill.id);
      if (skillEl) {
        const rect = skillEl.getBoundingClientRect();
        
        // Convert screen coordinates to normalized device coordinates (-1 to +1)
        const targetPosition: [number, number, number] = [
          (rect.left / window.innerWidth) * 2 - 1,
          -(rect.top / window.innerHeight) * 2 + 1,
          0.5  // Use a small z value to position it in front of camera
        ];
        
        // Trigger star celebration
        triggerStarCelebration(skill.id, targetPosition);
      }
      
      toast.success(`Skill Unlocked: ${skill.name}`);
    } else {
      playHit();
      toast.info(`Skill already unlocked: ${skill.name}`);
    }
  };
  
  const handleRemoveSkill = (e: React.MouseEvent, skill: Skill) => {
    e.stopPropagation(); // Prevent the card click event from triggering
    removeSkill(skill.id);
    playHit();
    toast.success(`Skill Removed: ${skill.name}`);
  };

  return (
    <div className="h-full w-full overflow-auto p-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <h2 className="col-span-full text-xl font-bold text-white">Skills To Unlock</h2>
        
        {skills.map((skill) => {
          const isUnlocked = unlockedSkills.includes(skill.id);
          const isHovered = hoveredSkill === skill.id;
          
          return (
            <motion.div
              key={skill.id}
              variants={item}
              ref={(el) => {
                if (el) skillRefs.current.set(skill.id, el);
              }}
              className={`relative cursor-pointer overflow-hidden rounded-lg transition-all ${
                isUnlocked 
                  ? 'border-2 border-green-500 bg-black bg-opacity-40' 
                  : 'border border-gray-700 bg-gray-900 bg-opacity-50'
              }`}
              onMouseEnter={() => setHoveredSkill(skill.id)}
              onMouseLeave={() => setHoveredSkill(null)}
              onClick={() => handleSkillClick(skill)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${
                    isUnlocked ? 'text-green-400' : 'text-white'
                  }`}>
                    {skill.name}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    {isUnlocked && (
                      <button 
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-red-800 text-white transition-colors hover:bg-red-700"
                        onClick={(e) => handleRemoveSkill(e, skill)}
                        title="Remove skill"
                      >
                        <TrashIcon size={14} />
                      </button>
                    )}
                    
                    <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                      isUnlocked ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {isUnlocked && <LockOpenIcon size={12} />}
                      {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </div>
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-gray-300">
                  {skill.description}
                </p>
                
                {/* Show details on hover */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: isHovered ? 'auto' : 0,
                    opacity: isHovered ? 1 : 0
                  }}
                  className="overflow-hidden"
                >
                  {skill.details && (
                    <div className="mt-4 rounded-lg bg-blue-900 bg-opacity-30 p-3 text-sm text-blue-200">
                      <strong>How to master:</strong>
                      <p className="mt-1">{skill.details}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
