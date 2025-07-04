
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
  
  // Using design system tokens for consistent theming
  const buttonClasses = "border border-border bg-card text-card-foreground hover:bg-muted transition-all duration-200 rounded text-sm";

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <button
          onClick={onShowSettings}
          className={`flex items-center gap-1 px-2 py-2 ${buttonClasses}`}
        >
          <Settings size={16} />
        </button>
        
        <div className="text-center">
          <div className="font-bold text-lg text-primary">SCORE: {score}</div>
          <div className="text-xs text-muted-foreground">HIGH: {highScore}</div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1 px-2 py-2 border border-secondary bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 transition-colors rounded text-sm"
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
            ? 'border-primary text-primary bg-primary/10' 
            : 'border-secondary text-secondary-foreground bg-secondary/10'
        }`}>
          {gameMode === 'classic' ? '🏛️ CLASSIC MODE' : '🚀 MODERN MODE'}
        </span>
      </div>
    </>
  );
};

export default GameHeader;
