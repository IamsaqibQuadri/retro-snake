import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Watermark = () => {
  const { theme } = useTheme();

  // Use darker colors for better contrast (WCAG 4.5:1 ratio)
  const themeColors = {
    // Darker greens for better contrast on light backgrounds
    primary: theme === 'light' ? 'text-green-800' : 'text-green-300',
    secondary: theme === 'light' ? 'text-gray-700' : 'text-green-200',
    border: theme === 'light' ? 'border-green-700/30' : 'border-green-400/20',
    background: theme === 'light' ? 'bg-green-700/10' : 'bg-green-400/10',
  };

  return (
    <div className="absolute bottom-2 right-2 z-20 md:bottom-4 md:right-4">
      <div className={`${themeColors.background} border ${themeColors.border} rounded-lg p-2`}>
        <p className={`${themeColors.primary} text-xs font-bold`}>Classic Edition</p>
        <p className={`${themeColors.secondary} text-xs`}>Made by Saqib!</p>
      </div>
    </div>
  );
};

export default Watermark;
