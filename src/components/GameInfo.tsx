import React from 'react';
import { GameMode, GameSpeed } from '../types/gameTypes';

interface GameInfoProps {
  speed: GameSpeed;
  gameMode: GameMode;
  chaosPhase?: number;
}

const GameInfo = ({ speed, gameMode, chaosPhase }: GameInfoProps) => {
  const getGameModeDescription = () => {
    switch (gameMode) {
      case 'classic': return 'Wall collision enabled';
      case 'modern': return 'Wall wrap-around enabled';
      case 'obstacles': return 'Navigate around barriers';
      case 'timeattack': return '60 second time limit';
      case 'survival': return 'Speed increases over time';
      case 'chaos': 
        if (chaosPhase === 1) return 'Phase 1: Walls wrap around';
        if (chaosPhase === 2) return 'Phase 2: Deadly obstacles appeared!';
        if (chaosPhase === 3) return 'Phase 3: Speed ramping up!';
        return 'Modern → Obstacles → Speed Ramp';
      default: return '';
    }
  };

  return (
    <div className="mt-3 text-center space-y-1">
      <span className="text-muted-foreground text-xs block">
        {speed === 'slow' ? '🐌 SLOW' : speed === 'normal' ? '🏃 NORMAL' : '🚀 FAST'} MODE
      </span>
      <span className="text-muted-foreground text-xs">
        {getGameModeDescription()}
      </span>
    </div>
  );
};

export default GameInfo;
