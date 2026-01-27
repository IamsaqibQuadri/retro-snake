
# Fix Chaos Mode - Complete Re-Implementation

## Problem Summary
The **Chaos mode is completely missing** from the codebase. All files have been reverted to an older version that only supports `'classic' | 'modern'` game modes. The `useChaosMode.ts` hook doesn't exist, and none of the components include Chaos mode logic.

---

## What Needs To Be Built

### Core Concept
Chaos mode is a **3-phase combined game mode**:

| Phase | Time | Walls | Obstacles | Speed |
|-------|------|-------|-----------|-------|
| Phase 1 🌐 | 0-40s | Wrap around | None | Normal |
| Phase 2 🧱 | 40s-120s | Wrap around | Deadly | Normal |
| Phase 3 🔥 | 120s+ | Wrap around | Deadly | 2x → 3x → 4x every 60s |

**Game ends only when:** Self-collision OR hitting an obstacle

---

## Implementation Steps

### Step 1: Update Type Definitions
**File:** `src/types/gameTypes.ts`
- Add `GameMode` type: `'classic' | 'modern' | 'chaos'`
- Add `ChaosPhase` type: `1 | 2 | 3`

### Step 2: Create Chaos Mode Hook
**File:** `src/hooks/useChaosMode.ts` (new file)
- Track elapsed time using `setInterval`
- Calculate current phase based on elapsed time
- Generate obstacles when entering Phase 2 (5-8 random obstacle positions)
- Calculate speed multiplier for Phase 3 (increases every 60 seconds)
- Use `useRef` for snake/food to avoid dependency issues
- Return: `phase`, `elapsedTime`, `obstacles`, `speedMultiplier`, `phaseLabel`

### Step 3: Update Game Mode Selector
**File:** `src/components/GameMenu/GameModeSelector.tsx`
- Add Chaos mode button with 🌀 emoji
- Add "⭐ RECOMMENDED" badge on Chaos mode
- Update prop types to include `'chaos'`

### Step 4: Update Main Snake Game Hook
**File:** `src/hooks/useSnakeGame.ts`
- Import and integrate `useChaosMode` when `gameMode === 'chaos'`
- Apply phase-specific logic:
  - All phases: Walls wrap around
  - Phase 2+: Check obstacle collisions
  - Phase 3: Apply speed multiplier to interval
- Return chaos-specific state for UI display

### Step 5: Update Game Header
**File:** `src/components/GameHeader.tsx`
- Accept `chaosPhase` and `chaosElapsedTime` as optional props
- Display phase indicator with appropriate emoji
- Show timer counting up during chaos mode

### Step 6: Update Game Info
**File:** `src/components/GameInfo.tsx`
- Add chaos mode description
- Show dynamic text based on current phase

### Step 7: Update SnakeGame Component
**File:** `src/components/SnakeGame.tsx`
- Update prop types to accept `'chaos'`
- Pass chaos phase/time to GameHeader
- Pass obstacles to GameBoard for rendering

### Step 8: Update GameBoard Component
**File:** `src/components/GameBoard.tsx`
- Add optional `obstacles` prop
- Render obstacles as distinct visual elements (red/orange blocks)

### Step 9: Update Supporting Components
**Files:**
- `src/components/GameOverlay.tsx` - Update gameMode type
- `src/components/GameMenu.tsx` - Update types and state
- `src/components/GameMenu/SetupScreen.tsx` - Update prop types
- `src/pages/Index.tsx` - Update gameMode state type
- `src/hooks/useLeaderboard.ts` - Accept chaos mode
- `src/hooks/useGlobalLeaderboard.ts` - Accept chaos mode

### Step 10: Update Game Utils
**File:** `src/utils/gameUtils.ts`
- Add `generateObstacles(snake, food, count)` function
- Add `checkObstacleCollision(head, obstacles)` function

---

## Technical Details

### Chaos Mode Hook Structure
```text
useChaosMode(isPlaying, gameOver, snakeRef, foodRef)
├── State
│   ├── elapsedTime (number)
│   ├── phase (1 | 2 | 3)
│   └── obstacles (Position[])
├── Effects
│   ├── Timer effect (runs every 1s when playing)
│   ├── Phase calculation effect
│   └── Obstacle generation effect (runs once when phase becomes 2)
└── Returns
    ├── phase, elapsedTime, obstacles
    ├── speedMultiplier (1x, 2x, 3x, 4x)
    ├── phaseLabel ("Phase 1 🌐", etc)
    └── reset() function
```

### Speed Multiplier Calculation
```text
Phase 3 Speed = baseInterval / speedMultiplier

speedMultiplier = floor((elapsedTime - 120) / 60) + 2
  - 120s-180s: 2x speed
  - 180s-240s: 3x speed  
  - 240s-300s: 4x speed
  - etc.
```

### UI Display During Chaos Mode
```text
┌────────────────────────────────────┐
│ ⚙️   SCORE: 150   HIGH: 200  🏠   │
│      🌀 CHAOS | Phase 2 🧱         │
│           ⏱️ 1:45                  │
├────────────────────────────────────┤
│                                    │
│     [Game Board with Obstacles]    │
│                                    │
└────────────────────────────────────┘
```

### Recommended Badge Design
```text
┌─────────────────────────────────────┐
│  ⭐ RECOMMENDED                     │
│              🌀                     │
│            CHAOS                    │
│      Ultimate challenge             │
└─────────────────────────────────────┘
```

---

## Files Summary

| Action | File |
|--------|------|
| Modify | `src/types/gameTypes.ts` |
| Create | `src/hooks/useChaosMode.ts` |
| Modify | `src/components/GameMenu/GameModeSelector.tsx` |
| Modify | `src/hooks/useSnakeGame.ts` |
| Modify | `src/components/GameHeader.tsx` |
| Modify | `src/components/GameInfo.tsx` |
| Modify | `src/components/SnakeGame.tsx` |
| Modify | `src/components/GameBoard.tsx` |
| Modify | `src/components/GameOverlay.tsx` |
| Modify | `src/components/GameMenu.tsx` |
| Modify | `src/components/GameMenu/SetupScreen.tsx` |
| Modify | `src/pages/Index.tsx` |
| Modify | `src/hooks/useLeaderboard.ts` |
| Modify | `src/hooks/useGlobalLeaderboard.ts` |
| Modify | `src/utils/gameUtils.ts` |

Total: **1 new file, 14 modified files**
