import { useState, useEffect, useCallback } from 'react';

const LEADERBOARD_KEY = 'snake-leaderboard-global';

export interface LeaderboardEntry {
  score: number;
  date: string;
  gameMode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival';
  speed: 'slow' | 'normal' | 'fast';
  timestamp: number;
  playerId: string;
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load leaderboard with comprehensive testing
  const loadLeaderboard = useCallback(() => {
    try {
      const saved = localStorage.getItem(LEADERBOARD_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Validate the data structure
        if (Array.isArray(parsed)) {
          const validEntries = parsed.filter(entry => {
            const isValid = entry && 
              typeof entry.score === 'number' && 
              typeof entry.date === 'string' &&
              typeof entry.gameMode === 'string' &&
              typeof entry.speed === 'string' &&
              typeof entry.timestamp === 'number' &&
              (typeof entry.playerId === 'string' || entry.playerId === undefined);
            
            
            // Add playerId to legacy entries
            if (isValid && !entry.playerId) {
              entry.playerId = 'Legacy_Player';
            }
            
            return isValid;
          });
          
          // Sort by score descending and keep only top 5
          const sortedEntries = validEntries
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
          
          setLeaderboard(sortedEntries);
        } else {
          localStorage.removeItem(LEADERBOARD_KEY);
          setLeaderboard([]);
        }
      } else {
        setLeaderboard([]);
      }
    } catch (error) {
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

  const addScore = useCallback((score: number, gameMode: 'classic' | 'modern' | 'obstacles' | 'timeattack' | 'survival', speed: 'slow' | 'normal' | 'fast') => {
    
    // Generate or get persistent player ID
    let playerId = localStorage.getItem('snake-player-id');
    if (!playerId) {
      playerId = `Player_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('snake-player-id', playerId);
    }
    
    const newEntry: LeaderboardEntry = {
      score,
      date: new Date().toLocaleDateString(),
      gameMode,
      speed,
      timestamp: Date.now(),
      playerId,
    };

    setLeaderboard(prev => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Keep only top 5
      
      try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
      } catch (error) {
        // Silent fail
      }
      
      return updated;
    });
  }, []);

  const clearLeaderboard = useCallback(() => {
    setLeaderboard([]);
    try {
      localStorage.removeItem(LEADERBOARD_KEY);
    } catch (error) {
      // Silent fail
    }
  }, []);

  return {
    leaderboard,
    addScore,
    clearLeaderboard,
  };
};
