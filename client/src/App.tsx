import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { GameContainer } from './components/game/GameContainer';
import { useAudio } from './lib/stores/useAudio';
import { useProgress } from './lib/stores/useProgress';
import { Toaster } from 'sonner';
import '@fontsource/inter';
import './index.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const { loadFromServer } = useProgress();

  // Load game progress from MongoDB
  useEffect(() => {
    const userId = 1; // Default to first user, can be updated with auth system
    loadFromServer(userId)
      .catch(error => console.error('Failed to load progress:', error));
  }, [loadFromServer]);

  // Load audio assets
  useEffect(() => {
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    setBackgroundMusic(bgMusic);

    const hit = new Audio('/sounds/hit.mp3');
    setHitSound(hit);

    const success = new Audio('/sounds/success.mp3');
    setSuccessSound(success);

    setIsLoaded(true);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-background">
        {isLoaded ? (
          <GameContainer />
        ) : (
          <div className="flex h-screen w-full items-center justify-center">
            <div className="text-2xl font-bold">Loading game assets...</div>
          </div>
        )}
        <Toaster position="top-right" richColors closeButton />
      </div>
    </QueryClientProvider>
  );
}

export default App;
