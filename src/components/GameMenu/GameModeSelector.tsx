import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface GameModeSelectorProps {
  gameMode: 'classic' | 'modern';
  onModeSelect: (mode: 'classic' | 'modern') => void;
}

const GameModeSelector = ({ gameMode, onModeSelect }: GameModeSelectorProps) => {
  const { theme } = useTheme();

  const themeColors = {
    primary: theme === 'light' ? 'text-green-600' : 'text-green-400',
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
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
              : `border-gray-600 bg-gray-600/10 text-gray-400 hover:border-green-400/50`
          }`}
        >
          🏛️ CLASSIC
        </button>
        <button
          onClick={() => onModeSelect('modern')}
          className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${
            gameMode === 'modern'
              ? 'border-blue-400 bg-blue-400/20 text-blue-400'
              : 'border-gray-600 bg-gray-600/10 text-gray-400 hover:border-blue-400/50'
          }`}
        >
          🌐 MODERN
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;