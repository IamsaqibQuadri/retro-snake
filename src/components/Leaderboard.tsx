
import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { LeaderboardEntry } from '../hooks/useLeaderboard';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onClear: () => void;
}

const Leaderboard = ({ entries, onClear }: LeaderboardProps) => {
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 1:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 2:
        return <Award className="w-4 h-4 text-orange-400" />;
      default:
        return <span className="w-4 h-4 flex items-center justify-center text-green-400 font-bold">#{index + 1}</span>;
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

  if (entries.length === 0) {
    return (
      <div className="text-center text-green-300 py-4">
        <p className="text-sm">No scores yet!</p>
        <p className="text-xs opacity-70">Play a game to see your scores here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div
          key={`${entry.score}-${entry.date}-${index}`}
          className="flex items-center justify-between p-2 bg-green-400/5 border border-green-400/20 rounded-lg"
        >
          <div className="flex items-center gap-2">
            {getIcon(index)}
            <div className="flex flex-col">
              <span className="text-green-400 font-bold text-sm">{entry.score}</span>
              <span className="text-green-300 text-xs">{entry.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>{getModeEmoji(entry.gameMode)}</span>
            <span>{getSpeedEmoji(entry.speed)}</span>
          </div>
        </div>
      ))}
      
      {entries.length > 0 && (
        <button
          onClick={onClear}
          className="w-full text-xs text-red-400 hover:text-red-300 py-1 opacity-50 hover:opacity-100 transition-opacity"
        >
          Clear Leaderboard
        </button>
      )}
    </div>
  );
};

export default React.memo(Leaderboard);
