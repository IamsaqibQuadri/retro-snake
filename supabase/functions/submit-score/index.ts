import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limiting: max 5 submissions per IP per 5 minutes
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabase
      .from('leaderboard')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', fiveMinutesAgo);

    // Global rate limit as fallback (since we can't filter by IP in the table)
    // For per-IP limiting we check a reasonable global threshold
    if (recentCount !== null && recentCount > 50) {
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { player_name, score, game_mode, speed } = await req.json();

    // Validate input
    if (!player_name || typeof player_name !== 'string' || player_name.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Invalid player name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Game-mode-specific score caps for better validation
    const maxScores: Record<string, number> = {
      classic: 500,
      modern: 800,
      chaos: 600,
      timeattack: 300,
      survival: 400,
      obstacles: 500,
    };
    
    const maxAllowed = maxScores[game_mode] || 1000;
    
    if (typeof score !== 'number' || score < 0 || score > maxAllowed) {
      return new Response(
        JSON.stringify({ error: 'Invalid score' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validModes = ['classic', 'modern', 'obstacles', 'timeattack', 'survival', 'chaos'];
    if (!validModes.includes(game_mode)) {
      return new Response(
        JSON.stringify({ error: 'Invalid game mode' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validSpeeds = ['slow', 'normal', 'fast'];
    if (!validSpeeds.includes(speed)) {
      return new Response(
        JSON.stringify({ error: 'Invalid speed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize player name
    const sanitizedName = player_name.trim().substring(0, 50);

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
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
