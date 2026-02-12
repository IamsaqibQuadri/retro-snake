-- Explicitly deny UPDATE on leaderboard
CREATE POLICY "Prevent score updates"
ON public.leaderboard
FOR UPDATE
USING (false);

-- Explicitly deny DELETE on leaderboard
CREATE POLICY "Prevent score deletion"
ON public.leaderboard
FOR DELETE
USING (false);