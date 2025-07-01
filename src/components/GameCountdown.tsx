
import React, { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import GameSettingsPanel from './GameSettingsPanel';

interface GameCountdownProps {
  onCountdownComplete: () => void;
  gameMode: 'classic' | 'modern';
  speed: 'slow' | 'normal' | 'fast';
}

const GameCountdown = ({ onCountdownComplete, gameMode, speed }: GameCountdownProps) => {
  const [count, setCount] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  const { theme } = useTheme();

  console.log('GameCountdown: Starting countdown with:', { gameMode, speed });

  // Theme-based background classes
  const backgroundClass = theme === 'light' 
    ? 'bg-white/95 text-gray-900' 
    : 'bg-black/95 text-green-400';

  // Theme-based colors
  const themeColors = {
    primary: theme === 'light' ? 'text-green-600' : 'text-green-400',
    secondary: theme === 'light' ? 'text-gray-600' : 'text-green-300',
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
    hover: theme === 'light' ? 'hover:bg-green-600/20' : 'hover:bg-green-400/20',
  };

  useEffect(() => {
    console.log('GameCountdown: Starting countdown timer');
    const timer = setInterval(() => {
      setCount(prev => {
        console.log('GameCountdown: Count:', prev);
        if (prev <= 1) {
          console.log('GameCountdown: Countdown complete!');
          clearInterval(timer);
          setTimeout(() => {
            console.log('GameCountdown: Calling onCountdownComplete');
            onCountdownComplete();
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log('GameCountdown: Cleaning up timer');
      clearInterval(timer);
    };
  }, [onCountdownComplete]);

  const getSpeedEmoji = (speed: string) => {
    switch (speed) {
      case 'slow': return '🐌';
      case 'normal': return '🏃';
      case 'fast': return '🚀';
      default: return '⚡';
    }
  };

  const getModeEmoji = (mode: string) => {
    return mode === 'classic' ? '🏛️' : '🌐';
  };

  if (count === 0) {
    console.log('GameCountdown: Displaying GO! message');
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 ${backgroundClass}`}>
        {/* Top-left settings button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg border-2 ${themeColors.border} ${themeColors.background} ${themeColors.primary} ${themeColors.hover} transition-all duration-200`}
            title="Game Settings"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="text-center">
          <div className={`text-6xl md:text-8xl font-bold animate-pulse mb-4 ${themeColors.primary}`}>
            GO!
          </div>
          <div className={`text-lg ${themeColors.secondary}`}>
            {getModeEmoji(gameMode)} {gameMode.toUpperCase()} • {getSpeedEmoji(speed)} {speed.toUpperCase()}
          </div>
        </div>

        {/* Settings Panel */}
        <GameSettingsPanel 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 ${backgroundClass}`}>
      {/* Top-left settings button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setShowSettings(true)}
          className={`p-2 rounded-lg border-2 ${themeColors.border} ${themeColors.background} ${themeColors.primary} ${themeColors.hover} transition-all duration-200`}
          title="Game Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="text-center">
        <div className={`text-8xl md:text-9xl font-bold animate-pulse mb-6 ${themeColors.primary}`}>
          {count}
        </div>
        <div className={`text-xl mb-4 ${themeColors.secondary}`}>Get Ready!</div>
        <div className={`text-lg ${themeColors.secondary}`}>
          {getModeEmoji(gameMode)} {gameMode.toUpperCase()} • {getSpeedEmoji(speed)} {speed.toUpperCase()}
        </div>
      </div>

      {/* Settings Panel */}
      <GameSettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default GameCountdown;
