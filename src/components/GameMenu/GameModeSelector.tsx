import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface GameModeSelectorProps {
  gameMode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival';
  onModeSelect: (mode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival') => void;
}

const GameModeSelector = ({ gameMode, onModeSelect }: GameModeSelectorProps) => {
  const { theme } = useTheme();

  const themeColors = {
    primary: 'text-primary',
    border: 'border-primary',
    background: 'bg-primary/10',
  };

  const modes = [
    { id: 'classic' as const, emoji: '🏛️', label: 'CLASSIC', description: 'Walls = death' },
    { id: 'modern' as const, emoji: '🌐', label: 'MODERN', description: 'Walls wrap' },
    { id: 'obstacles' as const, emoji: '🧱', label: 'OBSTACLES', description: 'Navigate barriers' },
    { id: 'timeattack' as const, emoji: '⏱️', label: 'TIME ATTACK', description: '60 seconds' },
    { id: 'survival' as const, emoji: '🔥', label: 'SURVIVAL', description: 'Speed increases' },
  ];

  return (
    <div className="mb-6">
      <h2 className={`text-lg font-bold ${themeColors.primary} mb-4`}>GAME MODE</h2>
      <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeSelect(mode.id)}
            className={`px-3 py-2 text-xs font-bold border-2 rounded-lg transition-all duration-200 ${
              gameMode === mode.id
                ? `${themeColors.border} ${themeColors.background.replace('/10', '/20')} ${themeColors.primary}`
                : `border-muted-foreground bg-muted text-muted-foreground hover:border-primary/50`
            }`}
          >
            <div className="text-lg mb-1">{mode.emoji}</div>
            <div>{mode.label}</div>
            <div className="text-[10px] opacity-70 mt-1">{mode.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameModeSelector;