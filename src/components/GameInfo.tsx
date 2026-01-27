
import React from 'react';
import { GameMode, ChaosPhase } from '../types/gameTypes';

interface GameInfoProps {
  speed: 'slow' | 'normal' | 'fast';
  gameMode: GameMode;
  chaosPhase?: ChaosPhase;
}

const GameInfo = ({ speed, gameMode, chaosPhase }: GameInfoProps) => {
  const getSpeedLabel = () => {
    return speed === 'slow' ? '🐌 SLOW' : speed === 'normal' ? '🏃 NORMAL' : '🚀 FAST';
  };

  const getModeDescription = () => {
    if (gameMode === 'classic') {
      return 'Wall collision enabled';
    }
    if (gameMode === 'modern') {
      return 'Wall wrap-around enabled';
    }
    // Chaos mode
    if (chaosPhase === 1) {
      return 'Phase 1: Walls wrap around, no obstacles';
    }
    if (chaosPhase === 2) {
      return 'Phase 2: Avoid the obstacles!';
    }
    return 'Phase 3: Speed increasing! Survive!';
  };

  return (
    <div className="mt-3 text-center space-y-1">
      <span className="text-green-300 text-xs block">
        {getSpeedLabel()} MODE
      </span>
      <span className="text-gray-400 text-xs">
        {getModeDescription()}
      </span>
    </div>
  );
};

export default GameInfo;
