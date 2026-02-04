import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { GameMode } from '../../types/gameTypes';

interface GameModeSelectorProps {
  gameMode: GameMode;
  onModeSelect: (mode: GameMode) => void;
}

const GameModeSelector = ({ gameMode, onModeSelect }: GameModeSelectorProps) => {
  const { theme } = useTheme();

  const getModeButtonClass = (mode: GameMode) => {
    const isSelected = gameMode === mode;
    const unselectedBase = 'border-border bg-card text-muted-foreground';
    
    if (mode === 'chaos') {
      return isSelected
        ? 'border-purple-500 bg-purple-500/20 text-purple-400 ring-2 ring-purple-400/50'
        : `${unselectedBase} hover:border-purple-400/50`;
    }
    
    if (mode === 'modern') {
      return isSelected
        ? 'border-blue-400 bg-blue-400/20 text-blue-400'
        : `${unselectedBase} hover:border-blue-400/50`;
    }

    if (mode === 'timeattack') {
      return isSelected
        ? 'border-orange-400 bg-orange-400/20 text-orange-400'
        : `${unselectedBase} hover:border-orange-400/50`;
    }

    if (mode === 'survival') {
      return isSelected
        ? 'border-red-400 bg-red-400/20 text-red-400'
        : `${unselectedBase} hover:border-red-400/50`;
    }
    
    // Classic mode
    return isSelected
      ? 'border-primary bg-primary/20 text-primary'
      : `${unselectedBase} hover:border-primary/50`;
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-primary mb-4">GAME MODE</h2>
      <div className="flex flex-col gap-3">
        {/* Classic & Modern - First Row */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onModeSelect('classic')}
            className={`flex-1 px-3 py-3 text-sm font-bold border-2 rounded-lg transition-all duration-200 min-h-[60px] ${getModeButtonClass('classic')}`}
          >
            <div className="flex flex-col items-center">
              <span>🏛️ CLASSIC</span>
              <span className="text-xs opacity-70">Wall collision</span>
            </div>
          </button>
          <button
            onClick={() => onModeSelect('modern')}
            className={`flex-1 px-3 py-3 text-sm font-bold border-2 rounded-lg transition-all duration-200 min-h-[60px] ${getModeButtonClass('modern')}`}
          >
            <div className="flex flex-col items-center">
              <span>🌐 MODERN</span>
              <span className="text-xs opacity-70">Wall wrapping</span>
            </div>
          </button>
        </div>

        {/* Time Attack & Survival - Second Row */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onModeSelect('timeattack')}
            className={`flex-1 px-3 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${getModeButtonClass('timeattack')}`}
          >
            <div className="flex flex-col items-center">
              <span>⏱️ TIME ATTACK</span>
              <span className="text-xs opacity-70">60 seconds!</span>
            </div>
          </button>
          <button
            onClick={() => onModeSelect('survival')}
            className={`flex-1 px-3 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${getModeButtonClass('survival')}`}
          >
            <div className="flex flex-col items-center">
              <span>💀 SURVIVAL</span>
              <span className="text-xs opacity-70">Speed increases!</span>
            </div>
          </button>
        </div>

        {/* Chaos Mode - Featured at Bottom */}
        <button
          onClick={() => onModeSelect('chaos')}
          className={`relative px-4 py-3 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${getModeButtonClass('chaos')}`}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
            ⭐ RECOMMENDED
          </div>
          <span className="text-lg">🌀</span> CHAOS
          <div className="text-xs opacity-70 mt-1">Ultimate challenge - 3 phases!</div>
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;