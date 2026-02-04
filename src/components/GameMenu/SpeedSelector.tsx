import React from 'react';

interface SpeedSelectorProps {
  selectedSpeed: 'slow' | 'normal' | 'fast' | null;
  onSpeedSelect: (speed: 'slow' | 'normal' | 'fast') => void;
}

const SpeedSelector = ({ selectedSpeed, onSpeedSelect }: SpeedSelectorProps) => {
  // Use design system tokens for consistent theming
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
          className={`w-20 h-20 text-sm font-bold border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 bg-card ${
            selectedSpeed === 'slow'
              ? `${themeColors.border} bg-primary/20 ${themeColors.primary}`
              : `${themeColors.border} ${themeColors.background} ${themeColors.primary} ${themeColors.hover}`
          }`}
        >
          <span className="text-lg">🐌</span>
          <span className="text-xs">SLOW</span>
        </button>
        
        <button
          onClick={() => onSpeedSelect('normal')}
          className={`w-20 h-20 text-sm font-bold border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 bg-card ${
            selectedSpeed === 'normal'
              ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
              : 'border-yellow-500 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
          }`}
        >
          <span className="text-lg">🏃</span>
          <span className="text-xs">NORMAL</span>
        </button>
        
        <button
          onClick={() => onSpeedSelect('fast')}
          className={`w-20 h-20 text-sm font-bold border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 bg-card ${
            selectedSpeed === 'fast'
              ? 'border-red-500 bg-red-500/20 text-red-500'
              : 'border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20'
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