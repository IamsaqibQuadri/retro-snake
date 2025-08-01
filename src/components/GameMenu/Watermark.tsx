import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Watermark = () => {
  const { theme } = useTheme();

  const themeColors = {
    primary: 'text-primary',
    secondary: 'text-muted-foreground',
    border: 'border-primary',
    background: 'bg-primary/10',
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