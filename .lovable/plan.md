

# Comprehensive Fixes Plan

## Summary
5 issues to fix:
1. Set light as default theme
2. Fix Wind skin crash and rendering
3. Fix uneven game over buttons
4. Make share card logo bigger
5. Navigate home after save (already working - verify)

---

## 1. Set Light as Base Theme

### Current Behavior
The theme defaults to `'light'` only if nothing is saved in localStorage (line 15-17 in ThemeContext.tsx). This is already correct, but we should verify the fallback.

### Changes
**File:** `src/contexts/ThemeContext.tsx`
- Keep the default as `'light'` (already set correctly)
- No code change needed - just verification

---

## 2. Fix Wind Skin Crash

### Root Cause Analysis
The Wind skin canvas rendering in `GameBoard.tsx` has several issues:

1. **Boundary condition bug (lines 63-66):** The loop `for (let i = 1; i < points.length - 1; i++)` doesn't execute when there are exactly 2 points, but then line 70-71 tries to draw to the last point - this can cause visual glitches

2. **Canvas context race condition:** The useEffect runs on every snake position change, but canvas operations can be interrupted by React's render cycle

3. **Missing error handling:** No try-catch around canvas operations

### Fix
**File:** `src/components/GameBoard.tsx`

Replace the Wind skin rendering logic with a more robust implementation:

```text
Changes:
1. Add proper boundary checks for snake length
2. Handle edge case when snake has exactly 2 segments
3. Wrap canvas operations in try-catch
4. Add requestAnimationFrame for smoother rendering
5. Clear canvas properly before each draw
6. Ensure canvas ref is valid before operations
```

### Technical Implementation
```
- Check if snake.length < 2: return early (already done, keep)
- If snake.length === 2: draw a simple line instead of curve
- If snake.length >= 3: use quadraticCurveTo for smooth curves
- Wrap all ctx operations in try-catch
- Add null checks for canvas and context
```

---

## 3. Fix Uneven Game Over Buttons

### Current Issue
Looking at `GameOverlay.tsx`:
- Primary buttons (lines 91-102): `px-4 py-3` padding, `text-sm` font
- Secondary buttons (lines 107-118): `px-3 py-2` padding, `text-xs` font

This creates visual inconsistency where the top row is larger than the bottom.

### Solution
Make all 4 buttons the same size and style for a clean 2x2 grid.

**File:** `src/components/GameOverlay.tsx`

Changes:
- Use consistent padding: `px-4 py-3` for all buttons
- Use consistent font size: `text-sm` for all buttons
- Keep the visual distinction through colors (primary vs secondary styles)
- Ensure all buttons have the same min-height

### New Layout
```
┌────────────────┬────────────────┐
│   🔄 RETRY     │    🏠 HOME     │  (same size)
├────────────────┼────────────────┤
│   🌐 SAVE      │    📤 SHARE    │  (same size)
└────────────────┴────────────────┘
```

---

## 4. Make Share Card Logo Bigger

### Current Issue
In `ShareScoreCard.tsx` line 141-145, the logo has:
```jsx
<img 
  src={LOGO_PATH} 
  alt="Rattle Rush" 
  className="h-12 w-auto mb-2 drop-shadow-lg"  // h-12 = 48px - too small
  crossOrigin="anonymous"
/>
```

### Solution
**File:** `src/components/ShareScoreCard.tsx`

Change logo size from `h-12` to `h-20` or `h-24` for better visibility:
- Current: `h-12` (48px height)
- New: `h-20` (80px height) - significantly larger while fitting the card

Also adjust margins to accommodate larger logo.

---

## 5. Auto-Navigate Home After Save (Verification)

### Current Implementation
Looking at `GameOverlay.tsx` lines 46-68, the `handleNameSave` function already calls `onBackToMenu()` on success (line 61).

This should already work. If it's not working, we need to check:
1. Is `addScore` returning `success: true`?
2. Is the toast showing success message?
3. Is `onBackToMenu` being called?

### Verification Steps
- Check the global leaderboard hook's `addScore` function
- Ensure it properly returns `{ success: true }` on successful save
- Add console logging if needed

---

## Files to Modify

| Action | File | Changes |
|--------|------|---------|
| Modify | `src/components/GameBoard.tsx` | Fix Wind skin canvas rendering with proper boundary checks |
| Modify | `src/components/GameOverlay.tsx` | Make all 4 buttons equal size |
| Modify | `src/components/ShareScoreCard.tsx` | Increase logo size from h-12 to h-20 |

Total: **3 files modified**

---

## Technical Details

### Wind Skin Fix (GameBoard.tsx)

The corrected useEffect for Wind skin:

```typescript
useEffect(() => {
  if (snakeSkin !== 'wind' || !canvasRef.current) return;
  
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  try {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    
    // Need at least 2 points to draw
    if (snake.length < 2) {
      // Draw single point as a circle
      const point = snake[0];
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255, 255, 255, 1)';
      ctx.beginPath();
      ctx.arc(
        point.x * gridSize + gridSize / 2,
        point.y * gridSize + gridSize / 2,
        gridSize * 0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
      return;
    }

    const points = snake.map(seg => ({
      x: seg.x * gridSize + gridSize / 2,
      y: seg.y * gridSize + gridSize / 2,
    }));

    // Multiple passes for glow effect
    const passes = [
      { blur: 20, alpha: 0.15, width: gridSize * 1.8 },
      { blur: 12, alpha: 0.25, width: gridSize * 1.4 },
      { blur: 6, alpha: 0.4, width: gridSize * 1.0 },
      { blur: 2, alpha: 0.7, width: gridSize * 0.7 },
    ];

    passes.forEach(pass => {
      ctx.save();
      ctx.shadowBlur = pass.blur;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.strokeStyle = `rgba(255, 255, 255, ${pass.alpha})`;
      ctx.lineWidth = pass.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      // Handle exactly 2 points (straight line)
      if (points.length === 2) {
        ctx.lineTo(points[1].x, points[1].y);
      } else {
        // 3+ points: use smooth curves
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        // Connect to last point
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      }

      ctx.stroke();
      ctx.restore();
    });

    // Draw head glow
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(255, 255, 255, 1)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, gridSize * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } catch (error) {
    console.error('Wind skin rendering error:', error);
  }
}, [snake, snakeSkin, gridSize, gameWidth, gameHeight]);
```

### Button Uniformity (GameOverlay.tsx)

All buttons will use:
- `px-4 py-3` padding
- `text-sm` font size
- Same border width and radius
- Only colors differentiate primary from secondary

