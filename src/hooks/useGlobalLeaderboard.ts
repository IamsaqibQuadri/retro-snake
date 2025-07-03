import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GlobalLeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  game_mode: 'classic' | 'modern';
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
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(50); // Top 50 scores

      if (error) throw error;
      setLeaderboard((data || []) as GlobalLeaderboardEntry[]);
      setError(null);
    } catch (err) {
      console.error('Failed to load global leaderboard:', err);
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
    gameMode: 'classic' | 'modern', 
    speed: 'slow' | 'normal' | 'fast'
  ) => {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert({
          player_name: playerName,
          score,
          game_mode: gameMode,
          speed
        });

      if (error) throw error;
      
      // Reload leaderboard after adding new score
      await loadLeaderboard();
      return { success: true };
    } catch (err) {
      console.error('Failed to add score to global leaderboard:', err);
      return { success: false, error: 'Failed to save score' };
    }
  }, [loadLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    addScore,
    reload: loadLeaderboard,
  };
};