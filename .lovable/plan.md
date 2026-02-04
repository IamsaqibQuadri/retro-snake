
# Fix ShareScoreCard Image Quality

## Problem
The downloaded shareable card image is:
1. **Cluttered** - Too many elements packed into the card area
2. **Low quality** - html2canvas settings aren't optimized for crisp output
3. **Jammed layout** - Content is squeezed together without breathing room

## Root Cause Analysis

Looking at `ShareScoreCard.tsx`:

1. **Low resolution output** (line 74): `scale: 2` is good but combined with a small card size (`max-w-sm` + `aspectRatio: 4/3`) produces a relatively small final image

2. **Cluttered design** (lines 138-153):
   - Logo + score + player name + game mode/speed badges + URL all crammed together
   - Small margins (`mb-2`, `mb-3`) don't give enough visual separation
   - Background pattern adds visual noise to the image

3. **Canvas capture issues**:
   - No explicit dimensions for html2canvas
   - The `aspectRatio: 4/3` CSS might not translate well to canvas

## Solution

### 1. Increase output quality
- Bump `scale` from `2` to `3` for higher resolution
- Set explicit width/height on the card div for consistent sizing
- Use `imageTimeout: 0` to ensure logo loads completely

### 2. Simplify and declutter the card layout
- Remove the background pattern (too noisy for screenshots)
- Increase spacing between elements
- Make the score more prominent (bigger font)
- Use a cleaner, simpler gradient
- Add more padding around edges

### 3. Improve visual hierarchy
- Logo at top (larger with more margin below)
- Giant score number as the hero element
- Player name in smaller text
- Mode/speed as subtle pills at bottom
- URL watermark tucked at the very bottom

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ShareScoreCard.tsx` | Improve html2canvas settings; redesign card layout for cleaner output |

## Implementation Details

### Updated html2canvas Options
```typescript
const canvas = await html2canvas(cardRef.current, {
  backgroundColor: null,
  scale: 3, // Higher resolution (was 2)
  useCORS: true,
  allowTaint: true,
  imageTimeout: 0, // Wait for images to fully load
  logging: false,
  width: 400, // Fixed width for consistent output
  height: 300, // Fixed height (4:3 aspect)
});
```

### Redesigned Card Layout

**Before (cluttered):**
```
┌─────────────────────┐
│ [pattern bg]        │
│ Logo (small)        │
│ SCORE mb-3          │
│ PlayerName mb-2     │
│ [Mode] [Speed]      │
│ url mt-4            │
└─────────────────────┘
```

**After (clean):**
```
┌─────────────────────────────┐
│                             │
│     [LOGO - larger]         │
│                             │
│         SCORE               │  <- Much bigger, hero element
│       (giant text)          │
│                             │
│       by PlayerName         │
│                             │
│   [Mode Pill] [Speed Pill]  │
│                             │
│     rattlerush.lovable.app  │
└─────────────────────────────┘
```

### Key Style Changes
- Remove background pattern SVG (causes noise/artifacts)
- Use solid gradient or subtle radial gradient instead
- Increase score font from `text-5xl` to `text-6xl` or `text-7xl`
- Increase logo from `h-20` to `h-24`
- Add more margin: `mb-4` and `mb-6` instead of `mb-2` and `mb-3`
- Set explicit pixel dimensions on the card container for html2canvas reliability
- Add `font-smoothing` CSS for crisper text rendering
