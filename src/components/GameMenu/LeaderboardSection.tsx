import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { LeaderboardEntry } from '../../hooks/useLeaderboard';
import Leaderboard from '../Leaderboard';

interface LeaderboardSectionProps {
  highScore: number;
  showLeaderboard: boolean;
  leaderboard: LeaderboardEntry[];
  onToggleLeaderboard: () => void;
  onClearLeaderboard: () => void;
}

const LeaderboardSection = ({ 
  highScore, 
  showLeaderboard, 
  leaderboard, 
  onToggleLeaderboard, 
  onClearLeaderboard 
}: LeaderboardSectionProps) => {
  const { theme } = useTheme();

  const themeColors = {
    border: theme === 'light' ? 'border-green-600' : 'border-green-400',
    background: theme === 'light' ? 'bg-green-600/10' : 'bg-green-400/10',
  };

  return (
    <>
      {/* High Score and Leaderboard */}
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
          <Crown size={16} />
        </button>
      </div>

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="mb-6 p-4 border-2 border-purple-400 bg-purple-400/10 rounded-lg">
          <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
            <Crown size={18} />
            TOP 5 SCORES
          </h3>
          <Leaderboard entries={leaderboard} onClear={onClearLeaderboard} />
        </div>
      )}
    </>
  );
};

export default LeaderboardSection;