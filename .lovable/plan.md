

# Fix Uneven Game Mode Buttons Layout

## Problem
The five game mode buttons have inconsistent sizing and descriptions:
- CHAOS is large with full-width and a description
- TIME ATTACK & SURVIVAL are medium-sized with descriptions
- CLASSIC & MODERN are smaller with no descriptions

## Solution
Make all 5 game mode buttons uniform with consistent styling:

**Option 1: Grid Layout (Recommended)**
All 5 modes in a consistent 2-column grid, with CHAOS spanning full width at the top:

```
┌─────────────────────────────────────┐
│    🌀 CHAOS (⭐ RECOMMENDED)        │
│    Ultimate challenge - 3 phases!   │
├──────────────────┬──────────────────┤
│  ⏱️ TIME ATTACK  │   💀 SURVIVAL    │
│    60 seconds!   │  Speed increases!│
├──────────────────┼──────────────────┤
│   🏛️ CLASSIC    │    🌐 MODERN     │
│  Wall collision  │   Wall wrapping  │
└──────────────────┴──────────────────┘
```

## Changes Required

**File:** `src/components/GameMenu/GameModeSelector.tsx`

1. **Add descriptions to CLASSIC and MODERN buttons:**
   - CLASSIC: "Wall collision"
   - MODERN: "Wall wrapping"

2. **Make all side-by-side buttons the same height and structure:**
   - Add `flex-1` to all paired buttons
   - Ensure consistent padding: `px-3 py-3` for all
   - Add `flex flex-col items-center` wrapper to all

3. **Standardize the button internal structure:**
   All non-CHAOS buttons should follow this pattern:
   ```jsx
   <button className="flex-1 px-3 py-3 ...">
     <div className="flex flex-col items-center">
       <span>🏛️ CLASSIC</span>
       <span className="text-xs opacity-70">Wall collision</span>
     </div>
   </button>
   ```

4. **Add `min-h-[60px]`** to ensure consistent button heights

## Technical Implementation

Lines 84-98 need to be updated to match the pattern used for TIME ATTACK and SURVIVAL (lines 62-82):

```jsx
{/* Classic & Modern */}
<div className="flex justify-center gap-2">
  <button
    onClick={() => onModeSelect('classic')}
    className={`flex-1 px-3 py-3 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${getModeButtonClass('classic')}`}
  >
    <div className="flex flex-col items-center">
      <span>🏛️ CLASSIC</span>
      <span className="text-xs opacity-70">Wall collision</span>
    </div>
  </button>
  <button
    onClick={() => onModeSelect('modern')}
    className={`flex-1 px-3 py-3 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${getModeButtonClass('modern')}`}
  >
    <div className="flex flex-col items-center">
      <span>🌐 MODERN</span>
      <span className="text-xs opacity-70">Wall wrapping</span>
    </div>
  </button>
</div>
```

## Result
All 5 game mode buttons will have:
- Consistent padding and height
- Descriptive subtitles explaining what each mode does
- Uniform visual appearance while maintaining the featured CHAOS mode at the top

