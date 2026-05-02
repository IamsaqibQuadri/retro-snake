import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { GameMode } from '../types/gameTypes';
import { logger } from '@/utils/logger';

// Create a direct client using environment variables to ensure correct backend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export interface GlobalLeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  game_mode: GameMode;
  speed: 'slow' | 'normal' | 'fast';
  created_at: string;
}

export const useGlobalLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<GlobalLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(50); // Top 50 scores

      if (error) throw error;
      setLeaderboard((data || []) as GlobalLeaderboardEntry[]);
      setError(null);
    } catch (err) {
      logger.error('Failed to load global leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const addScore = useCallback(async (
    playerName: string,
    score: number, 
    gameMode: GameMode, 
    speed: 'slow' | 'normal' | 'fast',
    sessionToken?: string | null
  ) => {
    try {
      if (!sessionToken) {
        return { success: false, error: 'Score session expired. Please start a new game.' };
      }

      // Use edge function to submit score (service role inserts only)
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          player_name: playerName,
          score,
          game_mode: gameMode,
          speed,
          session_token: sessionToken
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save score');
      }
      
      // Reload leaderboard after adding new score
      await loadLeaderboard();
      return { success: true };
    } catch (err) {
      logger.error('Failed to add score to global leaderboard:', err);
      return { success: false, error: 'Failed to save score' };
    }
  }, [loadLeaderboard]);

  const startScoreSession = useCallback(async (
    gameMode: GameMode,
    speed: 'slow' | 'normal' | 'fast'
  ) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: 'start',
          game_mode: gameMode,
          speed
        }),
      });

      const result = await response.json();

      if (!response.ok || typeof result.session_token !== 'string') {
        throw new Error(result.error || 'Failed to start score session');
      }

      return { success: true, sessionToken: result.session_token as string };
    } catch (err) {
      logger.error('Failed to start score session:', err);
      return { success: false, error: 'Failed to start score session' };
    }
  }, []);

  return {
    leaderboard,
    loading,
    error,
    addScore,
    startScoreSession,
    reload: loadLeaderboard,
  };
};
