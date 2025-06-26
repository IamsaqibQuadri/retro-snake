
import React from 'react';
import { Home, Settings } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  highScore: number;
  gameMode: 'classic' | 'modern';
  onBackToMenu: () => void;
  onShowSettings: () => void;
}

const GameHeader = ({ score, highScore, gameMode, onBackToMenu, onShowSettings }: GameHeaderProps) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1 px-2 py-2 border border-green-400 text-green-400 hover:bg-green-400/10 transition-colors rounded text-sm"
        >
          <Home size={16} />
          <span className="text-xs">Menu</span>
        </button>
        
        <div className="text-center">
          <div className="text-green-400 font-bold text-lg">SCORE: {score}</div>
          <div className="text-green-300 text-xs">HIGH: {highScore}</div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={onShowSettings}
            className="flex items-center gap-1 px-2 py-2 border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition-colors rounded text-xs"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Game Mode Indicator */}
      <div className="mb-2">
        <span className={`text-xs font-bold px-2 py-1 rounded border ${
          gameMode === 'classic' 
            ? 'border-green-400 text-green-400 bg-green-400/10' 
            : 'border-blue-400 text-blue-400 bg-blue-400/10'
        }`}>
          {gameMode === 'classic' ? '🏛️ CLASSIC MODE' : '🚀 MODERN MODE'}
        </span>
      </div>
    </>
  );
};

export default GameHeader;
