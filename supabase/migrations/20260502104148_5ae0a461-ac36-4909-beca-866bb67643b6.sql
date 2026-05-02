CREATE TABLE IF NOT EXISTS public.leaderboard_sessions (
  token_hash text PRIMARY KEY,
  game_mode text NOT NULL,
  speed text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  consumed_at timestamp with time zone,
  CONSTRAINT leaderboard_sessions_game_mode_check CHECK (game_mode IN ('classic', 'modern', 'chaos', 'timeattack', 'survival')),
  CONSTRAINT leaderboard_sessions_speed_check CHECK (speed IN ('slow', 'normal', 'fast'))
);

ALTER TABLE public.leaderboard_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leaderboard_sessions_no_select" ON public.leaderboard_sessions;
DROP POLICY IF EXISTS "leaderboard_sessions_no_insert" ON public.leaderboard_sessions;
DROP POLICY IF EXISTS "leaderboard_sessions_no_update" ON public.leaderboard_sessions;
DROP POLICY IF EXISTS "leaderboard_sessions_no_delete" ON public.leaderboard_sessions;

CREATE POLICY "leaderboard_sessions_no_select"
ON public.leaderboard_sessions
FOR SELECT
TO public
USING (false);

CREATE POLICY "leaderboard_sessions_no_insert"
ON public.leaderboard_sessions
FOR INSERT
TO public
WITH CHECK (false);

CREATE POLICY "leaderboard_sessions_no_update"
ON public.leaderboard_sessions
FOR UPDATE
TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "leaderboard_sessions_no_delete"
ON public.leaderboard_sessions
FOR DELETE
TO public
USING (false);

CREATE INDEX IF NOT EXISTS idx_leaderboard_sessions_expires_at
ON public.leaderboard_sessions (expires_at);

CREATE INDEX IF NOT EXISTS idx_leaderboard_sessions_consumed_at
ON public.leaderboard_sessions (consumed_at);