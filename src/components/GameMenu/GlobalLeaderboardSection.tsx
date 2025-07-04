import React from 'react';
import { Trophy, Crown, Globe } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useGlobalLeaderboard } from '../../hooks/useGlobalLeaderboard';

interface GlobalLeaderboardSectionProps {
  highScore: number;
  showLeaderboard: boolean;
  onToggleLeaderboard: () => void;
}

const GlobalLeaderboardSection = ({ 
  highScore, 
  showLeaderboard, 
  onToggleLeaderboard
}: GlobalLeaderboardSectionProps) => {
  const { theme } = useTheme();
  const { leaderboard, loading } = useGlobalLeaderboard();

  const themeColors = {
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
  };

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 1:
        return <Trophy className="w-4 h-4 text-gray-300" />;
      case 2:
        return <Trophy className="w-4 h-4 text-orange-400" />;
      default:
        return <span className="w-4 h-4 flex items-center justify-center text-primary font-bold">#{index + 1}</span>;
    }
  };

  const getModeEmoji = (mode: string) => {
    return mode === 'classic' ? '🏛️' : '🌐';
  };

  const getSpeedEmoji = (speed: string) => {
    switch (speed) {
      case 'slow':
        return '🐌';
      case 'normal':
        return '🏃';
      case 'fast':
        return '🚀';
      default:
        return '⚡';
    }
  };

  return (
    <>
      {/* High Score and Global Leaderboard */}
      <div className="mb-6 flex gap-2">
        {highScore > 0 && (
          <div className={`flex-1 p-3 border-2 ${themeColors.border} ${themeColors.background} rounded-lg`}>
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Trophy size={16} />
              <span className="text-sm font-bold">HIGH: {highScore}</span>
            </div>
          </div>
        )}
        
        <button
          onClick={onToggleLeaderboard}
          className="px-3 py-2 border-2 border-purple-400 bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 transition-all duration-200 rounded-lg"
        >
          <Globe size={16} />
        </button>
      </div>

      {/* Global Leaderboard */}
      {showLeaderboard && (
        <div className="mb-6 p-4 border-2 border-purple-400 bg-purple-400/10 rounded-lg">
          <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
            <Globe size={18} />
            GLOBAL TOP 5
          </h3>
          
          {loading ? (
            <div className="text-center text-primary py-4">
              <p className="text-sm">Loading...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center text-primary py-4">
              <p className="text-sm">No global scores yet!</p>
              <p className="text-xs opacity-70">Be the first to save a score</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 bg-primary/5 border border-primary/20 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getIcon(index)}
                    <div className="flex flex-col">
                      <span className="text-primary font-bold text-sm">{entry.score}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-primary/80 text-xs">{entry.player_name}</span>
                        <span className="text-primary/50 text-xs">• {new Date(entry.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span>{getModeEmoji(entry.game_mode)}</span>
                    <span>{getSpeedEmoji(entry.speed)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GlobalLeaderboardSection;