CREATE OR REPLACE FUNCTION public.submit_leaderboard_score(
  _player_name text,
  _score integer,
  _game_mode text,
  _speed text,
  _session_started_at timestamp with time zone DEFAULT NULL
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
  elapsed_ms numeric;
  minimum_ms_per_food integer;
  submitted_food_count integer;
  startup_grace_ms integer := 5000;
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

  IF _score IS NULL OR _score < 0 OR _score > max_allowed OR (_score % 10) <> 0 THEN
    RAISE EXCEPTION 'Invalid score';
  END IF;

  IF _session_started_at IS NULL THEN
    RAISE EXCEPTION 'Missing score session';
  END IF;

  elapsed_ms := extract(epoch from (clock_timestamp() - _session_started_at)) * 1000;
  submitted_food_count := _score / 10;
  minimum_ms_per_food := CASE
    WHEN _game_mode IN ('chaos', 'survival') THEN 50
    WHEN _speed = 'fast' THEN 120
    WHEN _speed = 'normal' THEN 180
    ELSE 300
  END;

  IF (elapsed_ms + startup_grace_ms) < (submitted_food_count * minimum_ms_per_food) THEN
    RAISE EXCEPTION 'Score submitted too quickly';
  END IF;

  INSERT INTO public.leaderboard (player_name, score, game_mode, speed)
  VALUES (left(sanitized_name, 50), _score, _game_mode, _speed)
  RETURNING * INTO inserted_row;

  RETURN inserted_row;
END;
$$;