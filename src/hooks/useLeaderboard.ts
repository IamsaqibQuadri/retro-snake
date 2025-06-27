
import { useState, useEffect } from 'react';

const LEADERBOARD_KEY = 'snake-leaderboard';

export interface LeaderboardEntry {
  score: number;
  date: string;
  gameMode: 'classic' | 'modern';
  speed: 'slow' | 'normal' | 'fast';
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  const addScore = (score: number, gameMode: 'classic' | 'modern', speed: 'slow' | 'normal' | 'fast') => {
    const newEntry: LeaderboardEntry = {
      score,
      date: new Date().toLocaleDateString(),
      gameMode,
      speed,
    };

    setLeaderboard(prev => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Keep only top 5
      
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearLeaderboard = () => {
    setLeaderboard([]);
    localStorage.removeItem(LEADERBOARD_KEY);
  };

  return {
    leaderboard,
    addScore,
    clearLeaderboard,
  };
};
