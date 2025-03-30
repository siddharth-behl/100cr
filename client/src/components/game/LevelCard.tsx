import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { LevelId, Level } from '../../types/game';
import { LockIcon, CheckIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useBusinessGame } from '../../lib/stores/useBusinessGame';

interface LevelCardProps {
  level: Level;
  onClick: () => void;
  isSelected: boolean;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, onClick, isSelected }) => {
  const { isLevelCompleted } = useBusinessGame();
  
  // Determine card status
  const isCompleted = level.isCompleted;
  const isUnlocked = level.isUnlocked;
  
  // Card style based on status
  const getCardStyle = () => {
    if (isSelected) return 'border-primary shadow-lg';
    if (isCompleted) return 'border-green-500 bg-green-50';
    if (!isUnlocked) return 'border-gray-300 bg-gray-50 opacity-80';
    return 'border-gray-200';
  };
  
  return (
    <motion.div
      whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "w-full cursor-pointer transition-all duration-300",
          getCardStyle(),
          isSelected && "transform scale-105"
        )}
        onClick={isUnlocked ? onClick : undefined}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Badge variant={isCompleted ? "success" : isUnlocked ? "default" : "outline"}>
              {level.timeframe}
            </Badge>
            
            {isCompleted ? (
              <CheckIcon className="h-5 w-5 text-green-500" />
            ) : !isUnlocked ? (
              <LockIcon className="h-5 w-5 text-gray-500" />
            ) : null}
          </div>
          
          <CardTitle className="text-xl font-bold mt-2">
            {`Level ${level.id}: ${level.name}`}
          </CardTitle>
          
          <CardDescription>
            {level.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-sm font-medium mb-2">
            <span className="text-gray-700">Goal:</span> {level.goal}
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">Missions:</span> {level.missions.length}
            {isUnlocked && (
              <span className="ml-2">
                ({level.missions.filter(m => m.isCompleted).length} completed)
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Skills:</span> {level.skills.length}
            {isUnlocked && (
              <span className="ml-2">
                ({level.skills.filter(s => s.isUnlocked).length} unlocked)
              </span>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant={isCompleted ? "outline" : "default"}
            size="sm"
            className="w-full"
            disabled={!isUnlocked}
            onClick={onClick}
          >
            {isCompleted ? (
              <span>Review Level</span>
            ) : isUnlocked ? (
              <span>Play Level</span>
            ) : (
              <span>Locked</span>
            )}
            {isUnlocked && <ChevronRightIcon className="h-4 w-4 ml-2" />}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LevelCard;
