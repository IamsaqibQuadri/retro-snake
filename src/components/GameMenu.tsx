
import React, { useEffect, useState } from 'react';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useLeaderboard } from '../hooks/useLeaderboard';
import EnhancedBackgroundSnake from './EnhancedBackgroundSnake';
import OceanBackground from './backgrounds/OceanBackground';
import MatrixBackground from './backgrounds/MatrixBackground';
import GameSettingsPanel from './GameSettingsPanel';
import WelcomeScreen from './GameMenu/WelcomeScreen';
import SetupScreen from './GameMenu/SetupScreen';
import TopControls from './GameMenu/TopControls';
import Watermark from './GameMenu/Watermark';

interface GameMenuProps {
  onStartGame: (speed: 'slow' | 'normal' | 'fast', gameMode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival' | 'chaos') => void;
}

const GameMenu = ({ onStartGame }: GameMenuProps) => {
  const [highScore, setHighScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'setup'>('welcome');
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'normal' | 'fast' | null>(null);
  const [gameMode, setGameMode] = useState<'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival' | 'chaos'>('classic');
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
    
  }, []);

  // Using design system tokens for consistent theming
  const backgroundClass = 'bg-background text-foreground';

  const handleProceedToSetup = () => {
    setCurrentStep('setup');
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
    setSelectedSpeed(null);
  };

  const handleStartGame = () => {
    if (selectedSpeed) {
      onStartGame(selectedSpeed, gameMode);
    }
  };

  const handleSpeedSelection = (speed: 'slow' | 'normal' | 'fast') => {
    setSelectedSpeed(speed);
  };

  const handleModeSelection = (mode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival' | 'chaos') => {
    setGameMode(mode);
  };

  return (
    <div className={`flex flex-col items-start h-full px-4 py-4 text-center relative transition-colors duration-300 overflow-y-auto ${backgroundClass}`}>
      {/* Theme-specific backgrounds */}
      {theme === 'ocean' && <OceanBackground />}
      {theme === 'matrix' && <MatrixBackground />}
      {theme !== 'ocean' && theme !== 'matrix' && <EnhancedBackgroundSnake />}

      <TopControls onShowSettings={() => setShowSettings(true)} />
      <Watermark />

      {/* Content Container with higher z-index */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto">
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
