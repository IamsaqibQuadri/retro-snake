import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface SpeedSelectorProps {
  selectedSpeed: 'slow' | 'normal' | 'fast' | null;
  onSpeedSelect: (speed: 'slow' | 'normal' | 'fast') => void;
}

const SpeedSelector = ({ selectedSpeed, onSpeedSelect }: SpeedSelectorProps) => {
  const { theme } = useTheme();

  const themeColors = {
    primary: 'text-primary',
    border: 'border-primary',
    background: 'bg-primary/10',
    hover: 'hover:bg-primary/20',
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
              ? 'border-accent bg-accent/20 text-accent'
              : 'border-accent bg-accent/10 text-accent hover:bg-accent/20'
          }`}
        >
          <span className="text-lg">🏃</span>
          <span className="text-xs">NORMAL</span>
        </button>
        
        <button
          onClick={() => onSpeedSelect('fast')}
          className={`w-20 h-20 text-sm font-bold border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
            selectedSpeed === 'fast'
              ? 'border-destructive bg-destructive/20 text-destructive'
              : 'border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20'
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