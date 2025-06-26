
import React from 'react';

interface GameInfoProps {
  speed: 'slow' | 'normal' | 'fast';
  gameMode: 'classic' | 'modern';
}

const GameInfo = ({ speed, gameMode }: GameInfoProps) => {
  return (
    <div className="mt-3 text-center space-y-1">
      <span className="text-green-300 text-xs block">
        {speed === 'slow' ? '🐌 SLOW' : speed === 'normal' ? '🏃 NORMAL' : '🚀 FAST'} MODE
      </span>
      <span className="text-gray-400 text-xs">
        {gameMode === 'classic' ? 'Wall collision enabled' : 'Wall wrap-around enabled'}
      </span>
    </div>
  );
};

export default GameInfo;
