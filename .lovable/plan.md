
# Fix Plan: Wind Skin, Share Card Overlap, and Image Layout

## Summary
Three distinct issues to fix:
1. Wind skin looks like "white neon" instead of smoky - needs color change and proper smoke effect
2. Wind skin has excessive growth animation when eating - the `scale-110` and `animate-bounce` classes affect rendering
3. Share card (400x300px) overflows its container (max-w-sm = 336px)
4. Downloaded image: score too large, pills text not centered

---

## Issue 1: Wind Skin Appearance

### Root Cause
The Wind skin uses pure white color:
```typescript
ctx.strokeStyle = `rgba(255, 255, 255, ${pass.alpha})`;
ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
```

This creates a "white neon" effect rather than the intended "smoky flow" appearance.

### Solution
Change colors to create a smoke/wind effect:
- Use soft gray-blue tones instead of pure white
- Reduce glow intensity for softer, smokier look
- Add slight transparency variation for depth

**Before (white neon):**
```typescript
ctx.strokeStyle = `rgba(255, 255, 255, ${pass.alpha})`;
ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
```

**After (smoky flow):**
```typescript
// Smoky gray-blue colors
ctx.strokeStyle = `rgba(180, 200, 220, ${pass.alpha})`;
ctx.shadowColor = 'rgba(150, 170, 190, 0.6)';
```

---

## Issue 2: Wind Skin Excessive Growth Animation

### Root Cause
When food is eaten, the `foodEaten` prop triggers CSS classes on all snake segments:
```tsx
className={`... ${foodEaten ? 'animate-pulse scale-110' : ''}`}  // Head
className={`... ${foodEaten ? 'animate-bounce' : ''}`}  // Body
```

For the Wind skin, while these DOM elements are hidden (`opacity: 0`), the underlying state changes still occur. The visual "growth" bug is because the canvas is re-rendering during the 300ms `foodEaten` animation period where the snake array has just grown by one segment.

### Solution
For the Wind skin specifically, skip the scale/bounce animations since it renders via canvas:
```tsx
// Head - don't apply scale-110 for wind skin
className={`... ${foodEaten && snakeSkin !== 'wind' ? 'animate-pulse scale-110' : ''}`}

// Body - don't apply animate-bounce for wind skin
className={`... ${foodEaten && snakeSkin !== 'wind' ? 'animate-bounce' : ''}`}
```

---

## Issue 3: Share Card Overflow

### Root Cause
The card has fixed dimensions:
```tsx
style={{ width: '400px', height: '300px' }}
```

But its container uses:
```tsx
className="... max-w-sm ..."  // max-w-sm = 336px
```

400px > 336px = overflow

### Solution
Increase the container width to accommodate the card:
```tsx
// Before
className="bg-card border border-border rounded-lg p-6 max-w-sm w-full"

// After - use max-w-md (448px) to fit 400px card + padding
className="bg-card border border-border rounded-lg p-4 max-w-md w-full"
```

Also reduce padding from `p-6` to `p-4` to maximize card display area.

---

## Issue 4: Downloaded Image Layout

### Root Cause
Looking at uploaded image 2:
1. Score font (`text-7xl`) is disproportionately large vs logo (`h-16`)
2. The mode/speed pills have text aligned to bottom, not centered

### Solution

**Balance score and logo:**
- Reduce score size from `text-7xl` to `text-5xl`
- Keep logo at `h-16` for good visibility
- This creates better visual hierarchy

**Center text in pills:**
The pills use `px-3 py-1.5` but text appears bottom-aligned. Add explicit vertical centering:
```tsx
// Before
<span className="px-3 py-1.5 bg-white/20 rounded-full font-medium backdrop-blur-sm">

// After - add flex centering
<span className="px-3 py-1.5 bg-white/20 rounded-full font-medium backdrop-blur-sm flex items-center justify-center">
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/GameBoard.tsx` | 1. Change Wind skin colors from white to smoky gray-blue. 2. Skip scale/bounce animations for Wind skin |
| `src/components/ShareScoreCard.tsx` | 1. Change container from `max-w-sm p-6` to `max-w-md p-4`. 2. Reduce score from `text-7xl` to `text-5xl`. 3. Add flex centering to pills |

---

## Technical Details

### Wind Skin Color Palette (GameBoard.tsx)

Replace the white-neon effect with a smoky appearance:

```typescript
const passes = [
  { blur: 25, alpha: 0.12, width: gridSize * 2.0 },  // Outer smoke
  { blur: 15, alpha: 0.2, width: gridSize * 1.5 },   // Mid smoke  
  { blur: 8, alpha: 0.35, width: gridSize * 1.1 },   // Inner smoke
  { blur: 3, alpha: 0.5, width: gridSize * 0.8 },    // Core
];

// Use smoky gray-blue colors instead of pure white
passes.forEach(pass => {
  ctx.save();
  ctx.shadowBlur = pass.blur;
  ctx.shadowColor = 'rgba(150, 170, 190, 0.5)';  // Soft gray-blue glow
  ctx.strokeStyle = `rgba(180, 200, 220, ${pass.alpha})`;  // Smoky gray-blue
  ctx.lineWidth = pass.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // ...
});

// Head glow - softer, smokier
ctx.shadowColor = 'rgba(200, 215, 230, 0.7)';
ctx.fillStyle = 'rgba(200, 215, 230, 0.8)';
```

### Animation Skip for Wind Skin (GameBoard.tsx)

```tsx
// Line 212 - Head
className={`absolute transition-all duration-300 ${foodEaten && snakeSkin !== 'wind' ? 'animate-pulse scale-110' : ''}`}

// Line 320 - Body
className={`absolute transition-all duration-200 ${foodEaten && snakeSkin !== 'wind' ? 'animate-bounce' : ''}`}
```

### ShareScoreCard Container Fix

```tsx
// Line 118 - Container
<div className="bg-card border border-border rounded-lg p-4 max-w-md w-full">
```

### Score and Pills Layout Fix

```tsx
// Line 156 - Score (smaller)
<div className="text-5xl font-black mb-2 drop-shadow-lg tracking-tight">{score}</div>

// Lines 163-164 - Pills (centered text)
<span className="px-3 py-1.5 bg-white/20 rounded-full font-medium backdrop-blur-sm flex items-center justify-center">{gameModeLabels[gameMode]}</span>
<span className="px-3 py-1.5 bg-white/20 rounded-full font-medium backdrop-blur-sm flex items-center justify-center">{speedLabels[speed]}</span>
```
