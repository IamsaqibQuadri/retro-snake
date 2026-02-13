-- Document the existing service-role-only INSERT policy for leaderboard
-- This policy already exists but was not tracked in migrations
-- Using CREATE IF NOT EXISTS pattern via DO block
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leaderboard' 
    AND policyname = 'leaderboard_service_insert_only'
  ) THEN
    CREATE POLICY "leaderboard_service_insert_only"
    ON public.leaderboard
    FOR INSERT
    WITH CHECK (
      (SELECT (current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text
    );
  END IF;
END
$$;