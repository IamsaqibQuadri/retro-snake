
import React from 'react';

interface GameInfoProps {
  speed: 'slow' | 'normal' | 'fast';
  gameMode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival';
}

const GameInfo = ({ speed, gameMode }: GameInfoProps) => {
  const getGameModeDescription = () => {
    switch (gameMode) {
      case 'classic': return 'Wall collision enabled';
      case 'modern': return 'Wall wrap-around enabled';
      case 'obstacles': return 'Navigate around barriers';
      case 'timeattack': return '60 second time limit';
      case 'survival': return 'Speed increases over time';
      default: return '';
    }
  };

  return (
    <div className="mt-3 text-center space-y-1">
      <span className="text-muted-foreground text-xs block">
        {speed === 'slow' ? '🐌 SLOW' : speed === 'normal' ? '🏃 NORMAL' : '🚀 FAST'} MODE
      </span>
      <span className="text-gray-400 text-xs">
        {getGameModeDescription()}
      </span>
    </div>
  );
};

export default GameInfo;
