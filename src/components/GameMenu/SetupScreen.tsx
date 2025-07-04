import React from 'react';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import GameModeSelector from './GameModeSelector';
import SpeedSelector from './SpeedSelector';
import GlobalLeaderboardSection from './GlobalLeaderboardSection';

interface SetupScreenProps {
  highScore: number;
  showLeaderboard: boolean;
  gameMode: 'classic' | 'modern';
  selectedSpeed: 'slow' | 'normal' | 'fast' | null;
  onBackToWelcome: () => void;
  onToggleLeaderboard: () => void;
  onModeSelect: (mode: 'classic' | 'modern') => void;
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

  const themeColors = {
    primary: theme === 'light' ? 'text-green-600' : 'text-green-400',
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
    hover: theme === 'light' ? 'hover:bg-green-600/20' : 'hover:bg-green-400/20',
  };

  return (
    <>
      {/* Back Button */}
      <div className="mb-6 flex justify-start">
        <button
          onClick={onBackToWelcome}
          className={`flex items-center gap-2 px-3 py-2 border ${themeColors.border.replace('border-', 'border-').replace('-400', '-400/50').replace('-600', '-600/50')} ${themeColors.background.replace('bg-', 'bg-').replace('/10', '/5')} ${themeColors.primary} ${themeColors.hover.replace('hover:bg-', 'hover:bg-').replace('/20', '/10')} transition-all duration-200 rounded-lg text-sm`}
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
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 border-2 ${themeColors.border} ${themeColors.background} ${themeColors.primary} ${themeColors.hover} transition-all duration-200 rounded-lg text-lg font-bold animate-pulse`}
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