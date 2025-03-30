import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CheckIcon, XIcon, RefreshCwIcon, TrophyIcon } from 'lucide-react';
import { Mission } from '../../types/game';
import { cn } from '../../lib/utils';
import { useBusinessGame } from '../../lib/stores/useBusinessGame';

interface MissionItemProps {
  mission: Mission;
  onComplete?: () => void;
}

const MissionItem: React.FC<MissionItemProps> = ({ mission, onComplete }) => {
  const { completeMission, updateMissionProgress } = useBusinessGame();
  const [isWorking, setIsWorking] = React.useState(false);
  
  // Track if mission is already completed
  const isCompleted = mission.isCompleted;
  const progress = mission.progress;
  
  // Handle the work button click to make progress
  const handleWork = () => {
    if (isCompleted || isWorking) return;
    
    setIsWorking(true);
    
    // Simulate progress update
    const currentProgress = progress;
    const incrementAmount = Math.floor(Math.random() * 20) + 10; // Random progress between 10-30%
    const newProgress = Math.min(currentProgress + incrementAmount, 100);
    
    // Update progress after a short delay
    setTimeout(() => {
      updateMissionProgress(mission.id, newProgress);
      setIsWorking(false);
      
      // If mission is now complete, trigger the callback
      if (newProgress >= 100 && onComplete) {
        onComplete();
      }
    }, 1500);
  };
  
  // Handle direct complete button
  const handleComplete = () => {
    if (isCompleted) return;
    
    completeMission(mission.id);
    if (onComplete) onComplete();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card 
        className={cn(
          "w-full transition-all",
          isCompleted ? "border-green-500 bg-green-50" : "border-gray-200"
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold">
              {mission.name}
            </CardTitle>
            
            {isCompleted && (
              <div className="flex items-center text-green-600">
                <CheckIcon className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
          
          <CardDescription>
            {mission.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1 text-sm font-medium">
                <span>Progress</span>
                <span className="text-right">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full h-2" />
            </div>
            
            <div className="text-sm">
              <div className="font-medium mb-1">Requirements:</div>
              <ul className="list-disc pl-5 space-y-1">
                {mission.requirements.map((req, index) => (
                  <li 
                    key={index}
                    className={cn(
                      "text-sm",
                      isCompleted ? "text-green-600" : "text-gray-600"
                    )}
                  >
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center text-amber-600">
              <TrophyIcon className="h-4 w-4 mr-2" />
              <span className="font-medium">Reward: ₹{mission.reward.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex space-x-2">
          <Button
            variant={isCompleted ? "outline" : "default"}
            size="sm"
            className={cn(
              "flex-1",
              isWorking && "animate-pulse"
            )}
            disabled={isCompleted || isWorking}
            onClick={handleWork}
          >
            {isWorking ? (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                Working...
              </>
            ) : isCompleted ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : (
              "Work on Mission"
            )}
          </Button>
          
          {!isCompleted && progress >= 80 && (
            <Button
              variant="success"
              size="sm"
              className="flex-1"
              onClick={handleComplete}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Complete
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MissionItem;
