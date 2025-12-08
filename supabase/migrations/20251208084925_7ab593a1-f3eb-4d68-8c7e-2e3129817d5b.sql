-- Drop the existing permissive insert policy
DROP POLICY IF EXISTS "leaderboard_insert_policy" ON public.leaderboard;

-- Create new restrictive policy - only service role can insert
-- This blocks direct client inserts via anon key
CREATE POLICY "leaderboard_service_insert_only" ON public.leaderboard
FOR INSERT
WITH CHECK (
  (SELECT current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
);