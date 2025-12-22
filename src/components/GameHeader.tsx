import React, { useCallback } from 'react';
import { Home, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { GameMode } from '../types/gameTypes';

interface GameHeaderProps {
  score: number;
  highScore: number;
  gameMode: GameMode;
  onBackToMenu: () => void;
  onShowSettings: () => void;
  timeRemaining?: number;
  speedLevel?: string;
  chaosPhase?: string;
  chaosElapsedTime?: string;
}

const GameHeader = ({ 
  score, 
  highScore, 
  gameMode, 
  onBackToMenu, 
  onShowSettings, 
  timeRemaining, 
  speedLevel,
  chaosPhase,
  chaosElapsedTime 
}: GameHeaderProps) => {
  const { theme } = useTheme();
  
  const buttonClasses = "border border-border bg-card text-card-foreground hover:bg-muted transition-all duration-200 rounded text-sm";

  const handleBackToMenu = useCallback(() => {
    onBackToMenu();
  }, [onBackToMenu]);

  const handleShowSettings = useCallback(() => {
    onShowSettings();
  }, [onShowSettings]);

  const getModeBadge = () => {
    switch (gameMode) {
      case 'classic': return { emoji: '🏛️', label: 'CLASSIC', color: 'border-primary text-primary bg-primary/10' };
      case 'modern': return { emoji: '🌐', label: 'MODERN', color: 'border-secondary text-secondary-foreground bg-secondary/10' };
      case 'obstacles': return { emoji: '🧱', label: 'OBSTACLES', color: 'border-accent text-accent bg-accent/10' };
      case 'timeattack': return { emoji: '⏱️', label: 'TIME ATTACK', color: 'border-destructive text-destructive bg-destructive/10' };
      case 'survival': return { emoji: '🔥', label: 'SURVIVAL', color: 'border-accent text-accent bg-accent/10' };
      case 'chaos': return { emoji: '🌀', label: 'CHAOS', color: 'border-destructive text-destructive bg-destructive/10' };
      default: return { emoji: '🎮', label: 'GAME', color: 'border-primary text-primary bg-primary/10' };
    }
  };

  const modeBadge = getModeBadge();

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <button
          onClick={handleShowSettings}
          className={`flex items-center gap-1 px-2 py-2 ${buttonClasses}`}
        >
          <Settings size={16} />
        </button>
        
        <div className="text-center">
          <div className="font-bold text-lg text-primary">SCORE: {score}</div>
          <div className="text-xs text-muted-foreground">HIGH: {highScore}</div>
          {timeRemaining !== undefined && (
            <div className="text-sm font-bold text-destructive mt-1">
              ⏱️ {timeRemaining}s
            </div>
          )}
          {speedLevel && (
            <div className="text-xs text-accent mt-1">
              🔥 {speedLevel}
            </div>
          )}
          {/* Chaos mode specific display */}
          {gameMode === 'chaos' && chaosElapsedTime && chaosPhase && (
            <div className="mt-1 space-y-0.5">
              <div className="text-sm font-bold text-destructive">
                ⏱️ {chaosElapsedTime}
              </div>
              <div className="text-xs font-bold text-accent animate-pulse">
                {chaosPhase}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={handleBackToMenu}
            className="flex items-center gap-1 px-2 py-2 border border-secondary bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 transition-colors rounded text-sm"
          >
            <Home size={16} />
            <span className="text-xs">Menu</span>
          </button>
        </div>
      </div>

      {/* Game Mode Indicator */}
      <div className="mb-2">
        <span className={`text-xs font-bold px-2 py-1 rounded border ${modeBadge.color}`}>
          {modeBadge.emoji} {modeBadge.label}
        </span>
      </div>
    </>
  );
};

export default React.memo(GameHeader);
