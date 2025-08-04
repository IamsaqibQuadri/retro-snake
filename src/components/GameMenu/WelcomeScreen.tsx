import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface WelcomeScreenProps {
  onProceedToSetup: () => void;
}

const WelcomeScreen = ({ onProceedToSetup }: WelcomeScreenProps) => {
  const { theme } = useTheme();
  const [isRotating, setIsRotating] = useState(false);

  const handleLogoClick = () => {
    if (!isRotating) {
      setIsRotating(true);
      setTimeout(() => setIsRotating(false), 800);
    }
  };

  const themeColors = {
    primary: 'text-primary',
    secondary: 'text-muted-foreground',
    border: 'border-primary',
    background: 'bg-primary/10',
    hover: 'hover:bg-primary/20',
  };

  return (
    <>
      {/* Logo and Title with New Transparent Logo */}
      <div className="mb-8">
        <div className="relative">
          <img 
            src="/lovable-uploads/fac2201e-f8a2-4cac-8ebc-c735a61174d1.png" 
            alt="Snake Game Logo" 
            className={`w-64 md:w-80 h-auto mx-auto relative z-10 drop-shadow-2xl cursor-pointer transition-transform duration-200 hover:scale-105 ${isRotating ? 'animate-spin-360' : ''}`}
            style={{
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))',
            }}
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
            aria-label="Click to rotate logo"
          />
        </div>
        
        <p className={`${themeColors.secondary} text-sm tracking-wide mt-2 mb-1`}>🎮 Snake Retro Edition 🎮</p>
        <p className={`${themeColors.secondary} text-xs tracking-wide`}>Fast. Offline. Classic fun</p>
      </div>

      {/* Start Game Button */}
      <div className="mb-8">
        <button
          onClick={onProceedToSetup}
          className={`w-full flex items-center justify-center gap-3 py-4 px-6 border-2 ${themeColors.border} ${themeColors.background} ${themeColors.primary} ${themeColors.hover} transition-all duration-200 rounded-lg text-lg font-bold animate-pulse relative z-10`}
        >
          <Play size={20} />
          <span>START GAME</span>
        </button>
      </div>

      {/* Instructions */}
      <div className={`${themeColors.secondary} text-xs space-y-1 mb-4`}>
        <p>🎮 Use arrow keys or control buttons</p>
        <p>🍎 Eat food to grow and score</p>
        <p>💀 Don't hit walls or yourself!</p>
        <p>📸 Take screenshot to save your score</p>
      </div>
    </>
  );
};

export default WelcomeScreen;