import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface GameModeSelectorProps {
  gameMode: 'classic' | 'modern';
  onModeSelect: (mode: 'classic' | 'modern') => void;
}

const GameModeSelector = ({ gameMode, onModeSelect }: GameModeSelectorProps) => {
  const { theme } = useTheme();

  const themeColors = {
    primary: 'text-primary',
    border: 'border-primary',
    background: 'bg-primary/10',
  };

  return (
    <div className="mb-6">
      <h2 className={`text-lg font-bold ${themeColors.primary} mb-4`}>GAME MODE</h2>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onModeSelect('classic')}
          className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${
            gameMode === 'classic'
              ? `${themeColors.border} ${themeColors.background.replace('/10', '/20')} ${themeColors.primary}`
              : `border-muted-foreground bg-muted text-muted-foreground hover:border-primary/50`
          }`}
        >
          🏛️ CLASSIC
        </button>
        <button
          onClick={() => onModeSelect('modern')}
          className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${
            gameMode === 'modern'
              ? 'border-secondary bg-secondary/20 text-secondary'
              : 'border-muted-foreground bg-muted text-muted-foreground hover:border-secondary/50'
          }`}
        >
          🌐 MODERN
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;