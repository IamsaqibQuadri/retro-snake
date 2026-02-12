-- Drop the legacy permissive INSERT policy that bypasses edge function validation
DROP POLICY IF EXISTS "Anyone can insert scores" ON public.leaderboard;