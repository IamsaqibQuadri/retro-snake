import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Watermark = () => {
  const { theme } = useTheme();

  const themeColors = {
    primary: theme === 'light' ? 'text-green-600' : 'text-green-400',
    secondary: theme === 'light' ? 'text-gray-600' : 'text-green-300',
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
  };

  return (
    <div className="absolute bottom-2 right-2 z-20 md:bottom-4 md:right-4">
      <div className={`${themeColors.background} border ${themeColors.border.replace('border-', 'border-').replace('-400', '-400/20').replace('-600', '-600/20')} rounded-lg p-2`}>
        <p className={`${themeColors.primary} text-xs font-bold`}>Classic Edition</p>
        <p className={`${themeColors.secondary} text-xs opacity-70`}>Made by Saqib!</p>
      </div>
    </div>
  );
};

export default Watermark;