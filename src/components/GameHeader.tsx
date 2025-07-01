
import React from 'react';
import { Home, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface GameHeaderProps {
  score: number;
  highScore: number;
  gameMode: 'classic' | 'modern';
  onBackToMenu: () => void;
  onShowSettings: () => void;
}

const GameHeader = ({ score, highScore, gameMode, onBackToMenu, onShowSettings }: GameHeaderProps) => {
  const { theme } = useTheme();
  
  // Theme-based colors
  const themeColors = {
    primary: theme === 'light' ? 'text-green-600' : 'text-green-400',
    secondary: theme === 'light' ? 'text-gray-600' : 'text-green-300',
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
    hover: theme === 'light' ? 'hover:bg-green-600/20' : 'hover:bg-green-400/20',
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <button
          onClick={onShowSettings}
          className={`flex items-center gap-1 px-2 py-2 border-2 ${themeColors.border} ${themeColors.background} ${themeColors.primary} ${themeColors.hover} transition-all duration-200 rounded text-sm`}
        >
          <Settings size={16} />
        </button>
        
        <div className="text-center">
          <div className={`font-bold text-lg ${themeColors.primary}`}>SCORE: {score}</div>
          <div className={`text-xs ${themeColors.secondary}`}>HIGH: {highScore}</div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={onBackToMenu}
            className={`flex items-center gap-1 px-2 py-2 border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition-colors rounded text-sm`}
          >
            <Home size={16} />
            <span className="text-xs">Menu</span>
          </button>
        </div>
      </div>

      {/* Game Mode Indicator */}
      <div className="mb-2">
        <span className={`text-xs font-bold px-2 py-1 rounded border ${
          gameMode === 'classic' 
            ? `${themeColors.border} ${themeColors.primary} ${themeColors.background}` 
            : 'border-blue-400 text-blue-400 bg-blue-400/10'
        }`}>
          {gameMode === 'classic' ? '🏛️ CLASSIC MODE' : '🚀 MODERN MODE'}
        </span>
      </div>
    </>
  );
};

export default GameHeader;
