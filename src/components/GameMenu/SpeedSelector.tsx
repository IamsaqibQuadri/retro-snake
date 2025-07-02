import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface SpeedSelectorProps {
  selectedSpeed: 'slow' | 'normal' | 'fast' | null;
  onSpeedSelect: (speed: 'slow' | 'normal' | 'fast') => void;
}

const SpeedSelector = ({ selectedSpeed, onSpeedSelect }: SpeedSelectorProps) => {
  const { theme } = useTheme();

  const themeColors = {
    primary: theme === 'light' ? 'text-green-600' : 'text-green-400',
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
    hover: theme === 'light' ? 'hover:bg-green-600/20' : 'hover:bg-green-400/20',
  };

  return (
    <div className="mb-6">
      <h2 className={`text-lg font-bold ${themeColors.primary} mb-4`}>SELECT SPEED</h2>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onSpeedSelect('slow')}
          className={`w-20 h-20 text-sm font-bold border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
            selectedSpeed === 'slow'
              ? `${themeColors.border} ${themeColors.background.replace('/10', '/20')} ${themeColors.primary}`
              : `${themeColors.border} ${themeColors.background} ${themeColors.primary} ${themeColors.hover}`
          }`}
        >
          <span className="text-lg">🐌</span>
          <span className="text-xs">SLOW</span>
        </button>
        
        <button
          onClick={() => onSpeedSelect('normal')}
          className={`w-20 h-20 text-sm font-bold border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
            selectedSpeed === 'normal'
              ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
              : 'border-yellow-400 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20'
          }`}
        >
          <span className="text-lg">🏃</span>
          <span className="text-xs">NORMAL</span>
        </button>
        
        <button
          onClick={() => onSpeedSelect('fast')}
          className={`w-20 h-20 text-sm font-bold border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
            selectedSpeed === 'fast'
              ? 'border-red-400 bg-red-400/20 text-red-400'
              : 'border-red-400 bg-red-400/10 text-red-400 hover:bg-red-400/20'
          }`}
        >
          <span className="text-lg">🚀</span>
          <span className="text-xs">FAST</span>
        </button>
      </div>
    </div>
  );
};

export default SpeedSelector;