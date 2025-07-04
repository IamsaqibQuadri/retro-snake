
import React, { useEffect, useState } from 'react';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useLeaderboard } from '../hooks/useLeaderboard';
import EnhancedBackgroundSnake from './EnhancedBackgroundSnake';
import GameSettingsPanel from './GameSettingsPanel';
import WelcomeScreen from './GameMenu/WelcomeScreen';
import SetupScreen from './GameMenu/SetupScreen';
import TopControls from './GameMenu/TopControls';
import Watermark from './GameMenu/Watermark';

interface GameMenuProps {
  onStartGame: (speed: 'slow' | 'normal' | 'fast', gameMode: 'classic' | 'modern') => void;
}

const GameMenu = ({ onStartGame }: GameMenuProps) => {
  const [highScore, setHighScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'setup'>('welcome');
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'normal' | 'fast' | null>(null);
  const [gameMode, setGameMode] = useState<'classic' | 'modern'>('classic');
  const { settings, toggleSound } = useGameSettings();
  const { theme, toggleTheme } = useTheme();
  const { leaderboard, clearLeaderboard } = useLeaderboard();

  // Background music
  useBackgroundMusic(true);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    console.log('GameMenu: High score loaded:', savedHighScore);
  }, []);

  // Theme-based background classes
  const backgroundClass = theme === 'light' 
    ? 'bg-white text-gray-900' 
    : 'bg-black text-green-400';

  const handleProceedToSetup = () => {
    console.log('GameMenu: Proceeding to setup screen');
    setCurrentStep('setup');
  };

  const handleBackToWelcome = () => {
    console.log('GameMenu: Going back to welcome screen');
    setCurrentStep('welcome');
    setSelectedSpeed(null);
  };

  const handleStartGame = () => {
    if (selectedSpeed) {
      console.log('GameMenu: Starting game with:', { speed: selectedSpeed, mode: gameMode });
      onStartGame(selectedSpeed, gameMode);
    }
  };

  const handleSpeedSelection = (speed: 'slow' | 'normal' | 'fast') => {
    console.log('GameMenu: Speed selected:', speed);
    setSelectedSpeed(speed);
  };

  const handleModeSelection = (mode: 'classic' | 'modern') => {
    console.log('GameMenu: Game mode selected:', mode);
    setGameMode(mode);
  };

  return (
    <div className={`flex flex-col items-center justify-center h-full px-4 py-4 text-center relative transition-colors duration-300 ${backgroundClass}`}>
      {/* Enhanced Background Snake */}
      <EnhancedBackgroundSnake />

      <TopControls onShowSettings={() => setShowSettings(true)} />
      <Watermark />

      {/* Content Container with higher z-index */}
      <div className="relative z-10 w-full max-w-md">
        {currentStep === 'welcome' ? (
          <WelcomeScreen onProceedToSetup={handleProceedToSetup} />
        ) : (
          <SetupScreen
            highScore={highScore}
            showLeaderboard={showLeaderboard}
            gameMode={gameMode}
            selectedSpeed={selectedSpeed}
            onBackToWelcome={handleBackToWelcome}
            onToggleLeaderboard={() => {
              console.log('GameMenu: Toggling leaderboard:', !showLeaderboard);
              setShowLeaderboard(!showLeaderboard);
            }}
            onModeSelect={handleModeSelection}
            onSpeedSelect={handleSpeedSelection}
            onStartGame={handleStartGame}
          />
        )}
      </div>

      {/* Settings Panel */}
      <GameSettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default GameMenu;
