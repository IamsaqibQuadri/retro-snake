import React from 'react';
import { Play } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface WelcomeScreenProps {
  onProceedToSetup: () => void;
}

const WelcomeScreen = ({ onProceedToSetup }: WelcomeScreenProps) => {
  const { theme } = useTheme();

  const themeColors = {
    primary: theme === 'light' ? 'text-green-600' : 'text-green-400',
    secondary: theme === 'light' ? 'text-gray-600' : 'text-green-300',
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
    hover: theme === 'light' ? 'hover:bg-green-600/20' : 'hover:bg-green-400/20',
  };

  return (
    <>
      {/* Logo and Title with New Transparent Logo */}
      <div className="mb-8">
        <div className="relative">
          <img 
            src="/lovable-uploads/fac2201e-f8a2-4cac-8ebc-c735a61174d1.png" 
            alt="Snake Game Logo" 
            className="w-64 md:w-80 h-auto mx-auto relative z-10 drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))',
            }}
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