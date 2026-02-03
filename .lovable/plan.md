

# UI/UX Improvements Plan

## Summary
6 changes to implement:
1. Fidget spinner logo rotation
2. Improved Matrix theme
3. Fix scoreboard (regenerate Supabase client)
4. Remove pixel skin
5. Grid layout for skin/theme selectors
6. Move Chaos mode below other options

---

## 1. Fidget Spinner Logo Rotation

### Current Behavior
- Logo rotates once at a fixed 1-second duration
- Uses `animate-spin` class with fixed timing

### New Behavior
- Click/tap gives the logo momentum
- Spins multiple times and gradually slows down (deceleration effect)
- Multiple taps add more momentum (like a real fidget spinner)

### Changes
**File:** `src/components/GameMenu/WelcomeScreen.tsx`
- Replace boolean `isRotating` with `rotationSpeed` number state
- Track current rotation angle with `rotation` state
- Use `requestAnimationFrame` for smooth physics-based animation
- Each click adds rotational velocity
- Apply friction to gradually slow down
- Use inline `transform: rotate(${rotation}deg)` style

### Technical Implementation
```
State:
- rotation: number (current angle in degrees)
- velocity: number (rotational speed, degrees per frame)

Physics:
- On click: velocity += 30 (add momentum)
- Each frame: rotation += velocity, velocity *= 0.98 (friction)
- Stop animating when velocity < 0.1
```

---

## 2. Improved Matrix Theme

### Current Issue
- Matrix falling code is simple single characters
- Doesn't match the iconic Matrix movie look

### Improvements
**File:** `src/components/EnhancedBackgroundSnake.tsx`
- Create vertical "streams" of characters (not isolated chars)
- Characters in each stream fade from bright green (head) to dark (tail)
- Varying stream lengths and speeds
- Add subtle CRT flicker effect
- More dense character coverage

### Visual Effect
```
Stream structure (top to bottom):
- Head character: bright green (#00ff00), full opacity
- Body characters: gradually darker green
- Tail: fades to nearly transparent
- Continuous vertical flow
```

**File:** `src/index.css`
- Add subtle CRT scanline overlay for Matrix theme
- Green phosphor glow on text elements

---

## 3. Fix Scoreboard - Regenerate Supabase Client

### Problem
The Supabase client file points to wrong project:
- **Current:** `ggdazdzgopinvgdtoqrl.supabase.co` (old external project)
- **Should be:** `jmrbjwlkywapnofmyllv.supabase.co` (Lovable Cloud)

### Solution
The `src/integrations/supabase/client.ts` file is auto-generated. I need to trigger a sync to regenerate it with the correct Lovable Cloud credentials.

### Verification
Lovable Cloud database already has leaderboard data:
- Saqib: 160 points (timeattack)
- Saqib 1: 140 points (modern)

### Note
The RLS policy currently only allows `service_role` to insert scores. We may need to either:
1. Create a submit-score edge function
2. Or update the RLS policy to allow anonymous inserts

---

## 4. Remove Pixel Snake Skin

### Changes
**File:** `src/contexts/SnakeSkinContext.tsx`
- Remove `'pixel'` from `SnakeSkin` type

**File:** `src/components/SnakeSkinSelector.tsx`
- Remove pixel skin from the list (line 16)

**File:** `src/components/GameBoard.tsx`
- Remove pixel skin rendering logic

### Result
7 skins remain: Remix, Dice, Tetris, Neon, Rainbow, Fire, Ice

---

## 5. Grid Layout for Skin & Theme Selectors

### Current Layout
- Theme selector: 2-column grid ✓ (already good)
- Skin selector: 1-column list (needs change)

### Changes
**File:** `src/components/SnakeSkinSelector.tsx`
- Change `grid-cols-1` to `grid-cols-2`
- Reduce padding from `p-4` to `p-3`
- Make buttons more compact

### Visual Result
```
┌─────────────┬─────────────┐
│   Remix     │    Dice     │
│  (gradient) │  (numbers)  │
├─────────────┼─────────────┤
│   Tetris    │    Neon     │
│   (blocks)  │  (outline)  │
├─────────────┼─────────────┤
│   Rainbow   │    Fire     │
│  (cycling)  │   (flame)   │
├─────────────┴─────────────┤
│           Ice             │
│     (frozen frost)        │
└───────────────────────────┘
```

---

## 6. Move Chaos Mode Below Other Options

### Current Layout
```
┌─────────────────────────────┐
│  🌀 CHAOS (⭐ RECOMMENDED)  │  ← Currently at top
├──────────────┬──────────────┤
│  TIME ATTACK │   SURVIVAL   │
├──────────────┼──────────────┤
│   CLASSIC    │    MODERN    │
└──────────────┴──────────────┘
```

### New Layout
```
┌──────────────┬──────────────┐
│   CLASSIC    │    MODERN    │  ← Standard modes first
├──────────────┼──────────────┤
│  TIME ATTACK │   SURVIVAL   │
├──────────────┴──────────────┤
│  🌀 CHAOS (⭐ RECOMMENDED)  │  ← Featured at bottom
│   Ultimate challenge!       │
└─────────────────────────────┘
```

### Changes
**File:** `src/components/GameMenu/GameModeSelector.tsx`
- Reorder the button groups:
  1. Classic & Modern (first row)
  2. Time Attack & Survival (second row)
  3. Chaos Mode (last, full width, featured)

---

## Files Summary

| Action | File |
|--------|------|
| Modify | `src/components/GameMenu/WelcomeScreen.tsx` |
| Modify | `src/components/EnhancedBackgroundSnake.tsx` |
| Modify | `src/index.css` |
| Regenerate | `src/integrations/supabase/client.ts` |
| Modify | `src/contexts/SnakeSkinContext.tsx` |
| Modify | `src/components/SnakeSkinSelector.tsx` |
| Modify | `src/components/GameBoard.tsx` |
| Modify | `src/components/GameMenu/GameModeSelector.tsx` |

Total: **7 modified files, 1 regenerated file**

