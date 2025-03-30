import { motion } from 'framer-motion';
import { useGameState } from '@/lib/stores/useGameState';

export function Navigation() {
  const { gameMode, setGameMode } = useGameState();

  return (
    <motion.div
      className="fixed left-0 top-0 z-40 flex w-full items-center justify-center bg-gray-900 bg-opacity-90 px-4 py-3 text-white shadow-md"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">₹100Cr GAME</h1>
        </div>

        <div className="flex gap-4">
          <NavButton
            label="Levels"
            icon={(
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
            isActive={gameMode === 'level-select'}
            onClick={() => setGameMode('level-select')}
          />

          <NavButton
            label="Dashboard"
            icon={(
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            )}
            isActive={gameMode === 'dashboard'}
            onClick={() => setGameMode('dashboard')}
          />
        </div>
      </div>
    </motion.div>
  );
}

function NavButton({ 
  label, 
  icon, 
  isActive, 
  onClick 
}: { 
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-700 text-white'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
