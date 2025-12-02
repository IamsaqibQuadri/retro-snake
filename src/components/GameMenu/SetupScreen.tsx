import React from 'react';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import GameModeSelector from './GameModeSelector';
import SpeedSelector from './SpeedSelector';
import GlobalLeaderboardSection from './GlobalLeaderboardSection';

interface SetupScreenProps {
  highScore: number;
  showLeaderboard: boolean;
  gameMode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival';
  selectedSpeed: 'slow' | 'normal' | 'fast' | null;
  onBackToWelcome: () => void;
  onToggleLeaderboard: () => void;
  onModeSelect: (mode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival') => void;
  onSpeedSelect: (speed: 'slow' | 'normal' | 'fast') => void;
  onStartGame: () => void;
}

const SetupScreen = ({
  highScore,
  showLeaderboard,
  gameMode,
  selectedSpeed,
  onBackToWelcome,
  onToggleLeaderboard,
  onModeSelect,
  onSpeedSelect,
  onStartGame
}: SetupScreenProps) => {
  const { theme } = useTheme();

  // Using design system tokens for consistent theming
  const buttonClasses = "border border-border bg-card text-card-foreground hover:bg-muted transition-all duration-200 rounded-lg";

  return (
    <>
      {/* Back Button */}
      <div className="mb-6 flex justify-start">
        <button
          onClick={onBackToWelcome}
          className={`flex items-center gap-2 px-3 py-2 ${buttonClasses} text-sm`}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <GlobalLeaderboardSection
        highScore={highScore}
        showLeaderboard={showLeaderboard}
        onToggleLeaderboard={onToggleLeaderboard}
      />

      <GameModeSelector
        gameMode={gameMode}
        onModeSelect={onModeSelect}
      />

      <SpeedSelector
        selectedSpeed={selectedSpeed}
        onSpeedSelect={onSpeedSelect}
      />

      {/* Start Game Button */}
      {selectedSpeed && (
        <div className="mb-6">
          <button
            onClick={onStartGame}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 rounded-lg text-lg font-bold animate-pulse"
          >
            <Gamepad2 size={20} />
            <span>PLAY NOW</span>
          </button>
        </div>
      )}
    </>
  );
};

export default SetupScreen;