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
    
    if (mode === 'chaos') {
      return isSelected
        ? 'border-purple-500 bg-purple-500/20 text-purple-400 ring-2 ring-purple-400/50'
        : 'border-gray-600 bg-gray-600/10 text-gray-400 hover:border-purple-400/50';
    }
    
    if (mode === 'modern') {
      return isSelected
        ? 'border-blue-400 bg-blue-400/20 text-blue-400'
        : 'border-gray-600 bg-gray-600/10 text-gray-400 hover:border-blue-400/50';
    }
    
    // Classic mode
    return isSelected
      ? 'border-primary bg-primary/20 text-primary'
      : 'border-gray-600 bg-gray-600/10 text-gray-400 hover:border-primary/50';
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-primary mb-4">GAME MODE</h2>
      <div className="flex flex-col gap-3">
        {/* Chaos Mode - Featured */}
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

        {/* Classic & Modern */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onModeSelect('classic')}
            className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${getModeButtonClass('classic')}`}
          >
            🏛️ CLASSIC
          </button>
          <button
            onClick={() => onModeSelect('modern')}
            className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${getModeButtonClass('modern')}`}
          >
            🌐 MODERN
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;