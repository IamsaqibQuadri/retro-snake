

# Feature Enhancements Plan

## Summary
This plan addresses 6 features/fixes:
1. Logo 360° rotation on tap
2. Replace Gameboy theme with Matrix theme
3. Add Ocean theme with ripple water effect
4. Fix scoreboard (switch to Lovable Cloud)
5. Add new snake skins
6. Add shareable score cards

---

## 1. Interactive Logo Rotation

### Problem
The logo used to rotate 360° when tapped but this functionality is missing in WelcomeScreen.tsx

### Solution
Add click/tap handler with rotation animation state

### Changes
**File:** `src/components/GameMenu/WelcomeScreen.tsx`
- Add `isRotating` state
- Add `onClick` handler to logo image
- Apply CSS `rotate-360` animation class when active
- Works on both mobile (tap) and desktop (click)

---

## 2. Replace Gameboy with Matrix Theme

### Problem
Replace the Gameboy LCD theme with a Matrix falling code theme

### Changes

**File:** `src/contexts/ThemeContext.tsx`
- Change type from `'gameboy'` to `'matrix'`
- Update toggle logic

**File:** `src/index.css`
- Replace `.gameboy` CSS variables with `.matrix` theme:
  - Black background (`--background: 0 0% 0%`)
  - Phosphor green text (`--foreground: 120 100% 50%`)
  - Dark green accents for cards
  - Glowing green effects

**File:** `src/components/ThemeSelector.tsx`
- Update theme option from "Gameboy LCD" to "Matrix" with description "Falling code vibes"

**File:** `src/components/EnhancedBackgroundSnake.tsx`
- Add Matrix falling code animation when theme is 'matrix'
- Random Katakana/symbols falling vertically
- Green phosphor glow effects

---

## 3. Add Ocean Theme with Ripple Effect

### Problem
Add new ocean theme with water ripple effect on mouse hover (home screen only)

### Changes

**File:** `src/contexts/ThemeContext.tsx`
- Add `'ocean'` to Theme type: `'light' | 'dark' | 'pastel' | 'matrix' | 'ocean'`

**File:** `src/index.css`
- Add `.ocean` CSS variables:
  - Deep blue background
  - Light cyan text
  - Wave-like accent colors
  - Water ripple keyframe animation

**File:** `src/components/ThemeSelector.tsx`
- Add Ocean theme option with description "Water ripples"

**New File:** `src/components/OceanRippleEffect.tsx`
- Create ripple effect component
- Track mouse position
- Render expanding circular ripples on hover/move
- Only render on home screen (via prop)

**File:** `src/components/GameMenu.tsx`
- Import and render OceanRippleEffect when theme is 'ocean' and on welcome screen

---

## 4. Fix Scoreboard - Switch to Lovable Cloud

### Problem
The Supabase client points to wrong project (old external Supabase). Need to use Lovable Cloud.

### Solution
The `src/integrations/supabase/client.ts` file is auto-generated and will be updated automatically when I trigger a sync. The Lovable Cloud project already has the `leaderboard` table.

### Verification
- Lovable Cloud project ID: `jmrbjwlkywapnofmyllv`
- Current client points to: `ggdazdzgopinvgdtoqrl` (wrong!)
- Table exists in Lovable Cloud with correct schema

### Action
Regenerate the Supabase client to point to the Lovable Cloud project. No code changes needed - it's auto-managed.

---

## 5. New Snake Skins

### Current Skins
- Remix (gradient)
- Dice (pixelated with numbers)
- Tetris (block-style)

### New Skins to Add

**File:** `src/contexts/SnakeSkinContext.tsx`
- Expand `SnakeSkin` type to include:
  - `'neon'` - Glowing neon outline style
  - `'rainbow'` - Color cycling segments
  - `'pixel'` - 8-bit pixelated retro style
  - `'fire'` - Flame gradient (orange to red)
  - `'ice'` - Frozen blue gradient with frost effect

**File:** `src/components/SnakeSkinSelector.tsx`
- Add new skin options with descriptions

**File:** `src/components/GameBoard.tsx`
- Implement rendering logic for each new skin style

---

## 6. Shareable Score Cards

### Problem
Currently only screenshot functionality exists. Need beautiful shareable score cards.

### Solution
Create styled score card component with share options

**New File:** `src/components/ShareScoreCard.tsx`
- Beautiful card design with:
  - Player name
  - Score prominently displayed
  - Game mode badge
  - Speed indicator
  - Theme-appropriate styling
  - Game logo
  - Date/time stamp
- Share buttons:
  - Download as PNG (using html2canvas)
  - Copy to clipboard
  - Share via Web Share API (mobile)
- QR code linking to game URL

**File:** `src/components/GameOverlay.tsx`
- Replace "TAKE SCREENSHOT" with "SHARE SCORE"
- Open ShareScoreCard modal instead
- Pass score data to card component

---

## Files Summary

| Action | File |
|--------|------|
| Modify | `src/components/GameMenu/WelcomeScreen.tsx` |
| Modify | `src/contexts/ThemeContext.tsx` |
| Modify | `src/index.css` |
| Modify | `src/components/ThemeSelector.tsx` |
| Modify | `src/components/EnhancedBackgroundSnake.tsx` |
| Create | `src/components/OceanRippleEffect.tsx` |
| Modify | `src/components/GameMenu.tsx` |
| Modify | `src/contexts/SnakeSkinContext.tsx` |
| Modify | `src/components/SnakeSkinSelector.tsx` |
| Modify | `src/components/GameBoard.tsx` |
| Create | `src/components/ShareScoreCard.tsx` |
| Modify | `src/components/GameOverlay.tsx` |

Total: **2 new files, 10 modified files**

---

## Implementation Order

1. **Fix Scoreboard** - Critical fix, enable Lovable Cloud sync
2. **Logo Rotation** - Quick win, simple state addition
3. **Theme Changes** - Replace Gameboy with Matrix, add Ocean
4. **Ripple Effect** - Create ocean ripple component
5. **New Skins** - Add 5 new snake skins
6. **Share Cards** - Create shareable score card modal

