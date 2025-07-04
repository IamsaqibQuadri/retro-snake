
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

  // Using design system tokens for consistent theming
  const backgroundClass = 'bg-background/95 text-foreground';
  const buttonClasses = "p-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-muted transition-all duration-200";

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
            className={buttonClasses}
            title="Game Settings"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="text-center">
          <div className="text-6xl md:text-8xl font-bold animate-pulse mb-4 text-primary">
            GO!
          </div>
          <div className="text-lg text-muted-foreground">
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
          className={buttonClasses}
          title="Game Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="text-center">
        <div className="text-8xl md:text-9xl font-bold animate-pulse mb-6 text-primary">
          {count}
        </div>
        <div className="text-xl mb-4 text-muted-foreground">Get Ready!</div>
        <div className="text-lg text-muted-foreground">
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
