import { useState, useEffect, useCallback } from 'react';
import { GameMode } from '../types/gameTypes';
import { logger } from '@/utils/logger';

const LEADERBOARD_KEY = 'snake-leaderboard-global';

export interface LeaderboardEntry {
  score: number;
  date: string;
  gameMode: GameMode;
  speed: 'slow' | 'normal' | 'fast';
  timestamp: number;
  playerId: string;
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load leaderboard with comprehensive testing
  const loadLeaderboard = useCallback(() => {
    logger.log('useLeaderboard: Loading leaderboard from localStorage...');
    try {
      const saved = localStorage.getItem(LEADERBOARD_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        logger.log('useLeaderboard: Raw data from localStorage:', parsed);
        
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
            
            if (!isValid) {
              logger.warn('useLeaderboard: Invalid entry found:', entry);
            }
            
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
          
          logger.log('useLeaderboard: Valid entries loaded:', sortedEntries.length);
          setLeaderboard(sortedEntries);
        } else {
          logger.warn('useLeaderboard: Data is not an array, clearing...');
          localStorage.removeItem(LEADERBOARD_KEY);
          setLeaderboard([]);
        }
      } else {
        logger.log('useLeaderboard: No saved data found');
        setLeaderboard([]);
      }
    } catch (error) {
      logger.error('useLeaderboard: Error loading leaderboard:', error);
      localStorage.removeItem(LEADERBOARD_KEY);
      setLeaderboard([]);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
    
    // Listen for storage changes (when another tab updates the leaderboard)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LEADERBOARD_KEY) {
        logger.log('useLeaderboard: Storage change detected, reloading...');
        loadLeaderboard();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadLeaderboard]);

  const addScore = useCallback((score: number, gameMode: GameMode, speed: 'slow' | 'normal' | 'fast') => {
    logger.log('useLeaderboard: Adding new score:', { score, gameMode, speed });
    
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
      
      logger.log('useLeaderboard: Updated leaderboard:', updated);
      
      try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
        logger.log('useLeaderboard: Successfully saved to localStorage');
      } catch (error) {
        logger.error('useLeaderboard: Error saving to localStorage:', error);
      }
      
      return updated;
    });
  }, []);

  const clearLeaderboard = useCallback(() => {
    logger.log('useLeaderboard: Clearing all leaderboard data');
    setLeaderboard([]);
    try {
      localStorage.removeItem(LEADERBOARD_KEY);
      logger.log('useLeaderboard: Successfully cleared localStorage');
    } catch (error) {
      logger.error('useLeaderboard: Error clearing localStorage:', error);
    }
  }, []);

  return {
    leaderboard,
    addScore,
    clearLeaderboard,
  };
};
