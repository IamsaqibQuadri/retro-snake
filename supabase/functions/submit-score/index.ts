import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory rate limiting (resets on function cold start, but good enough for basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// Valid game modes and speeds
const VALID_GAME_MODES = ['classic', 'modern', 'obstacles', 'timeattack', 'survival', 'chaos'];
const VALID_SPEEDS = ['slow', 'normal', 'fast'];

// Basic profanity filter (extendable)
const BLOCKED_WORDS = ['fuck', 'shit', 'ass', 'bitch', 'damn', 'crap', 'dick', 'pussy', 'cock', 'nigger', 'faggot'];

function sanitizePlayerName(name: string): string {
  let sanitized = name.trim().slice(0, 20);
  
  // Remove any HTML/script tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Check for blocked words (case insensitive)
  const lowerName = sanitized.toLowerCase();
  for (const word of BLOCKED_WORDS) {
    if (lowerName.includes(word)) {
      return 'Player'; // Replace offensive names
    }
  }
  
  return sanitized || 'Anonymous';
}

function validateInput(body: any): { valid: boolean; error?: string; data?: any } {
  const { player_name, score, game_mode, speed } = body;

  // Validate player_name
  if (typeof player_name !== 'string' || player_name.trim().length === 0) {
    return { valid: false, error: 'Invalid player name' };
  }

  // Validate score
  if (typeof score !== 'number' || !Number.isInteger(score) || score < 0 || score > 99999) {
    return { valid: false, error: 'Invalid score (must be 0-99999)' };
  }

  // Validate game_mode
  if (!VALID_GAME_MODES.includes(game_mode)) {
    return { valid: false, error: 'Invalid game mode' };
  }

  // Validate speed
  if (!VALID_SPEEDS.includes(speed)) {
    return { valid: false, error: 'Invalid speed' };
  }

  return {
    valid: true,
    data: {
      player_name: sanitizePlayerName(player_name),
      score,
      game_mode,
      speed,
    },
  };
}

function checkRateLimit(clientIP: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(clientIP);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';

    // Check rate limit
    const rateCheck = checkRateLimit(clientIP);
    if (!rateCheck.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ 
        error: 'Too many submissions. Please try again later.',
        retryAfter: rateCheck.retryAfter 
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': String(rateCheck.retryAfter),
        },
      });
    }

    // Parse and validate input
    const body = await req.json();
    const validation = validateInput(body);

    if (!validation.valid) {
      console.log(`Validation failed: ${validation.error}`);
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert score
    const { data, error } = await supabase
      .from('leaderboard')
      .insert({
        player_name: validation.data.player_name,
        score: validation.data.score,
        game_mode: validation.data.game_mode,
        speed: validation.data.speed,
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return new Response(JSON.stringify({ error: 'Failed to save score' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Score submitted: ${validation.data.player_name} - ${validation.data.score} (${validation.data.game_mode}/${validation.data.speed})`);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
