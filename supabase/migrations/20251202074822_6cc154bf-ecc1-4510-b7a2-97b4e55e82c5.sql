-- Create leaderboard table with RLS policies
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL DEFAULT 'Anonymous',
  score INTEGER NOT NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('classic', 'modern', 'obstacles', 'timeattack', 'survival')),
  speed TEXT NOT NULL CHECK (speed IN ('slow', 'normal', 'fast')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS with public read/insert policies
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY leaderboard_select_policy ON public.leaderboard FOR SELECT USING (true);

CREATE POLICY leaderboard_insert_policy ON public.leaderboard FOR INSERT WITH CHECK (true);

-- Performance indexes
CREATE INDEX idx_leaderboard_score ON public.leaderboard(score DESC);
CREATE INDEX idx_leaderboard_mode_speed ON public.leaderboard(game_mode, speed);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leaderboard_updated_at
BEFORE UPDATE ON public.leaderboard
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();