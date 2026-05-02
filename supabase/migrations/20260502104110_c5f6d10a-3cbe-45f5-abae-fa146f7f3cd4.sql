-- Harden leaderboard writes by removing direct table creation access
DROP POLICY IF EXISTS "leaderboard_service_insert_only" ON public.leaderboard;
DROP POLICY IF EXISTS "leaderboard_no_direct_insert" ON public.leaderboard;

CREATE POLICY "leaderboard_no_direct_insert"
ON public.leaderboard
FOR INSERT
TO public
WITH CHECK (false);

-- Backend-only function used by the score submission function.
-- Direct app/browser writes remain denied by RLS.
CREATE OR REPLACE FUNCTION public.submit_leaderboard_score(
  _player_name text,
  _score integer,
  _game_mode text,
  _speed text
)
RETURNS public.leaderboard
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted_row public.leaderboard;
  sanitized_name text;
  max_allowed integer;
BEGIN
  sanitized_name := btrim(regexp_replace(coalesce(_player_name, ''), '[<>"''&]', '', 'g'));

  IF sanitized_name = '' OR length(sanitized_name) > 50 THEN
    RAISE EXCEPTION 'Invalid player name';
  END IF;

  IF _game_mode NOT IN ('classic', 'modern', 'chaos', 'timeattack', 'survival') THEN
    RAISE EXCEPTION 'Invalid game mode';
  END IF;

  IF _speed NOT IN ('slow', 'normal', 'fast') THEN
    RAISE EXCEPTION 'Invalid speed';
  END IF;

  max_allowed := CASE _game_mode
    WHEN 'classic' THEN 500
    WHEN 'modern' THEN 800
    WHEN 'chaos' THEN 600
    WHEN 'timeattack' THEN 300
    WHEN 'survival' THEN 400
    ELSE 0
  END;

  IF _score IS NULL OR _score < 0 OR _score > max_allowed THEN
    RAISE EXCEPTION 'Invalid score';
  END IF;

  INSERT INTO public.leaderboard (player_name, score, game_mode, speed)
  VALUES (left(sanitized_name, 50), _score, _game_mode, _speed)
  RETURNING * INTO inserted_row;

  RETURN inserted_row;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_leaderboard_score(text, integer, text, text) FROM public;
REVOKE ALL ON FUNCTION public.submit_leaderboard_score(text, integer, text, text) FROM anon;
REVOKE ALL ON FUNCTION public.submit_leaderboard_score(text, integer, text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.submit_leaderboard_score(text, integer, text, text) TO service_role;