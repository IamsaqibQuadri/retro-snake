
import { useState, useEffect, useCallback } from 'react';

const LEADERBOARD_KEY = 'snake-leaderboard';

export interface LeaderboardEntry {
  score: number;
  date: string;
  gameMode: 'classic' | 'modern';
  speed: 'slow' | 'normal' | 'fast';
  timestamp: number; // Add timestamp for better tracking
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load leaderboard with error handling and validation
  const loadLeaderboard = useCallback(() => {
    try {
      const saved = localStorage.getItem(LEADERBOARD_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate the data structure
        if (Array.isArray(parsed)) {
          const validEntries = parsed.filter(entry => 
            entry && 
            typeof entry.score === 'number' && 
            typeof entry.date === 'string' &&
            typeof entry.gameMode === 'string' &&
            typeof entry.speed === 'string'
          );
          setLeaderboard(validEntries);
          console.log('Loaded leaderboard:', validEntries);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // Clear corrupted data
      localStorage.removeItem(LEADERBOARD_KEY);
      setLeaderboard([]);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
    
    // Listen for storage changes (when another tab updates the leaderboard)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LEADERBOARD_KEY) {
        loadLeaderboard();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadLeaderboard]);

  const addScore = useCallback((score: number, gameMode: 'classic' | 'modern', speed: 'slow' | 'normal' | 'fast') => {
    const newEntry: LeaderboardEntry = {
      score,
      date: new Date().toLocaleDateString(),
      gameMode,
      speed,
      timestamp: Date.now(),
    };

    setLeaderboard(prev => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Keep only top 5
      
      try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
        console.log('Saved leaderboard:', updated);
      } catch (error) {
        console.error('Error saving leaderboard:', error);
      }
      
      return updated;
    });
  }, []);

  const clearLeaderboard = useCallback(() => {
    setLeaderboard([]);
    try {
      localStorage.removeItem(LEADERBOARD_KEY);
      console.log('Cleared leaderboard');
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
    }
  }, []);

  return {
    leaderboard,
    addScore,
    clearLeaderboard,
  };
};
