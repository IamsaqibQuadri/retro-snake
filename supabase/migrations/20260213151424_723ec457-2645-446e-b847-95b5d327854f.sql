
-- Drop the misconfigured RESTRICTIVE SELECT policy
DROP POLICY IF EXISTS "leaderboard_select_policy" ON public.leaderboard;

-- Create a proper PERMISSIVE SELECT policy for public read access
CREATE POLICY "leaderboard_public_read"
ON public.leaderboard
FOR SELECT
TO anon, authenticated
USING (true);
