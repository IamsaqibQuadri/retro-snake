
import React from 'react';
import { Home, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { GameMode, ChaosPhase } from '../types/gameTypes';

interface GameHeaderProps {
  score: number;
  highScore: number;
  gameMode: GameMode;
  chaosPhase?: ChaosPhase;
  chaosElapsedTime?: number;
  chaosPhaseLabel?: string;
  timeAttackRemaining?: number;
  survivalSpeedMultiplier?: number;
  survivalFoodsEaten?: number;
  onBackToMenu: () => void;
  onShowSettings: () => void;
}

const GameHeader = ({ 
  score, 
  highScore, 
  gameMode, 
  chaosPhase,
  chaosElapsedTime,
  chaosPhaseLabel,
  timeAttackRemaining,
  survivalSpeedMultiplier,
  survivalFoodsEaten,
  onBackToMenu, 
  onShowSettings 
}: GameHeaderProps) => {
  const { theme } = useTheme();
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Using design system tokens for consistent theming
  const buttonClasses = "border border-border bg-card text-card-foreground hover:bg-muted transition-all duration-200 rounded text-sm";

  const getModeLabel = () => {
    switch (gameMode) {
      case 'classic':
        return 'CLASSIC MODE';
      case 'modern':
        return ' MODERN MODE';
      case 'chaos':
        return '🌀 CHAOS MODE';
      case 'timeattack':
        return ' TIME ATTACK';
      case 'survival':
        return ' SURVIVAL';
    }
  };

  const getModeClass = () => {
    if (gameMode === 'chaos') {
      return 'border-purple-500 text-purple-400 bg-purple-500/10';
    }
    if (gameMode === 'modern') {
      return 'border-secondary text-secondary-foreground bg-secondary/10';
    }
    if (gameMode === 'timeattack') {
      return 'border-orange-400 text-orange-400 bg-orange-400/10';
    }
    if (gameMode === 'survival') {
      return 'border-red-400 text-red-400 bg-red-400/10';
    }
    return 'border-primary text-primary bg-primary/10';
  };

  const getSurvivalSpeedLabel = () => {
    if (!survivalSpeedMultiplier) return '';
    if (survivalSpeedMultiplier >= 4) return '🔥 INSANE';
    if (survivalSpeedMultiplier >= 3) return '⚡ VERY FAST';
    if (survivalSpeedMultiplier >= 2) return '🏃 FAST';
    if (survivalSpeedMultiplier >= 1.5) return '💨 QUICK';
    return '🐌 NORMAL';
  };

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
      <div className="mb-2 flex flex-col items-center gap-1">
        <span className={`text-xs font-bold px-2 py-1 rounded border ${getModeClass()}`}>
          {getModeLabel()}
        </span>
        
        {/* Chaos Mode Phase & Timer */}
        {gameMode === 'chaos' && chaosPhaseLabel && chaosElapsedTime !== undefined && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-purple-400">{chaosPhaseLabel}</span>
            <span className="text-muted-foreground">⏱️ {formatTime(chaosElapsedTime)}</span>
          </div>
        )}

        {/* Time Attack Countdown */}
        {gameMode === 'timeattack' && timeAttackRemaining !== undefined && (
          <div className={`flex items-center gap-2 text-sm font-bold ${timeAttackRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-400'}`}>
            <span>⏱️ {formatTime(timeAttackRemaining)}</span>
          </div>
        )}

        {/* Survival Mode Speed Indicator */}
        {gameMode === 'survival' && survivalSpeedMultiplier !== undefined && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-red-400">{getSurvivalSpeedLabel()}</span>
            <span className="text-muted-foreground">🍎 {survivalFoodsEaten || 0} eaten</span>
          </div>
        )}
      </div>
    </>
  );
};

export default GameHeader;
