import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

// Restrict CORS to known origins
const allowedOrigins = [
  'https://rattlerush.lovable.app',
  'https://id-preview--a22e23e1-24fd-49b9-9b3d-107f8ad1fea3.lovable.app',
  'http://localhost:8080',
  'http://localhost:5173',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  };
}

// In-memory per-IP rate limiting (resets on cold start, but good enough for edge)
const ipSubmissions = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 5; // max 5 per IP per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipSubmissions.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  ipSubmissions.set(ip, timestamps);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  return false;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Per-IP rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     req.headers.get('cf-connecting-ip') ||
                     'unknown';

    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { player_name, score, game_mode, speed } = body;

    // Validate player name
    if (!player_name || typeof player_name !== 'string' || player_name.trim().length === 0 || player_name.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Invalid player name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize player name: strip dangerous characters to prevent XSS
    const sanitizedName = player_name
      .trim()
      .replace(/[<>"'&]/g, '')
      .substring(0, 50);

    if (sanitizedName.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid player name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate game mode
    const validModes = ['classic', 'modern', 'obstacles', 'timeattack', 'survival', 'chaos'];
    if (!validModes.includes(game_mode)) {
      return new Response(
        JSON.stringify({ error: 'Invalid game mode' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate speed
    const validSpeeds = ['slow', 'normal', 'fast'];
    if (!validSpeeds.includes(speed)) {
      return new Response(
        JSON.stringify({ error: 'Invalid speed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Game-mode-specific score caps
    const maxScores: Record<string, number> = {
      classic: 500,
      modern: 800,
      chaos: 600,
      timeattack: 300,
      survival: 400,
      obstacles: 500,
    };

    const maxAllowed = maxScores[game_mode] || 1000;

    if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > maxAllowed) {
      return new Response(
        JSON.stringify({ error: 'Invalid score' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert score
    const { data, error } = await supabase
      .from('leaderboard')
      .insert({
        player_name: sanitizedName,
        score,
        game_mode,
        speed
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save score' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
