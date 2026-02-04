# Rattle Rush - Development Case Study

## Semantic Versioning History

### v0.1.0 - Foundation (Initial Release)
- Initial Snake game implementation with canvas rendering
- Basic game loop with collision detection
- Arrow key controls for desktop
- Score tracking system

### v0.2.0 - Game Modes
- Added **Classic mode** (wall collision = game over)
- Added **Modern mode** (wall wrapping - snake teleports through walls)
- Mode selection UI on start screen

### v0.3.0 - Mobile Support
- Touch/swipe controls for mobile devices
- Mobile D-pad button controls
- Responsive layout for all screen sizes
- Improved touch gesture detection

### v0.4.0 - Theme System
- **Light theme** (default) - clean white/black contrast
- **Dark theme** - black background with green accents
- **Pastel Dreams theme** - soft pastel colors with high readability
- Theme persistence via localStorage

### v0.5.0 - Snake Customization
- 8 unique snake skins:
  - Remix, Dice, Tetris, Neon, Rainbow, Fire, Ice, Wind
- 8 color palette options
- Unified settings panel with grid layout
- Skin preview in selector

### v0.6.0 - Advanced Game Modes
- **Chaos mode** - Ultimate challenge with 3 progressive phases:
  - Phase 1: Random obstacles spawn
  - Phase 2: Moving obstacles
  - Phase 3: Maximum chaos with increased spawn rates
- **Time Attack mode** - 60-second timer, score as much as possible
- **Survival mode** - Progressive speed increase after each food eaten
- Mode-specific UI indicators and timers

### v0.7.0 - Leaderboard Integration
- Lovable Cloud database integration
- Global leaderboard with top 10 scores
- Score saving with player names
- Edge function for secure score submission
- Leaderboard filtering by game mode and speed

### v0.8.0 - Enhanced Themes
- **Matrix theme** - Falling code animation with Katakana characters
  - CRT scanline effects
  - Green phosphor glow
- **Ocean theme** - Deep blue with animated elements
  - Swimming fish background animation
  - Water ripple effect on hover/touch
  - Bubble particle effects
- Theme-aware background music system

### v0.9.0 - UI/UX Improvements
- Share score card with PNG download
- High-resolution image export (scale 3x)
- Settings grid layout optimization
- Game over 2x2 button layout
- Auto-return to home screen after score save
- Improved button uniformity across screens

### v0.10.0 - Polish & Fixes (Current)
- **Wind skin canvas rendering fix** - Resolved blur/pattern issues
- **Theme color consistency** - Replaced hardcoded colors with design tokens
  - Fixed text-gray-400 invisible on Ocean/Matrix themes
  - Fixed text-accent invisible on Light/Pastel themes
  - Standardized button styling with border-border, bg-card, text-foreground
- **Share card quality improvements**
  - Increased export resolution to 3x scale
  - Fixed dimensions (400x300) for consistent output
  - Removed noisy background patterns
  - Improved visual hierarchy

---

## Technical Architecture

### Frontend Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool
- **shadcn/ui** - Component library

### Backend (Lovable Cloud)
- **Database** - Score persistence and leaderboard
- **Edge Functions** - Secure score submission
- **Row Level Security** - Data protection

### Key Features
| Feature | Technology |
|---------|------------|
| Game Rendering | HTML5 Canvas |
| State Management | React Context + Custom Hooks |
| Animations | Framer Motion + CSS Animations |
| Theming | CSS Variables + Tailwind |
| Audio | Web Audio API |
| Image Export | html2canvas |

---

## Component Structure

```
src/
├── components/
│   ├── GameBoard.tsx        # Canvas rendering
│   ├── GameControls.tsx     # D-pad + keyboard handling
│   ├── GameHeader.tsx       # Score display + mode indicator
│   ├── GameOverlay.tsx      # Game over screen + actions
│   ├── ShareScoreCard.tsx   # PNG export dialog
│   ├── SnakeGame.tsx        # Main game container
│   └── GameMenu/
│       ├── WelcomeScreen.tsx
│       ├── SetupScreen.tsx
│       ├── GameModeSelector.tsx
│       ├── SpeedSelector.tsx
│       └── SettingsScreen.tsx
├── contexts/
│   ├── ThemeContext.tsx
│   ├── GameSettingsContext.tsx
│   └── SnakeSkinContext.tsx
├── hooks/
│   ├── useSnakeGame.ts      # Core game logic
│   ├── useChaosMode.ts
│   ├── useTimeAttack.ts
│   ├── useSurvivalMode.ts
│   ├── useGlobalLeaderboard.ts
│   └── useGameSounds.ts
└── types/
    └── gameTypes.ts
```

---

## Design System

### Semantic Color Tokens
- `--primary` / `--primary-foreground` - Brand colors
- `--secondary` / `--secondary-foreground` - Alternate accent
- `--muted` / `--muted-foreground` - Subdued elements
- `--accent` / `--accent-foreground` - Highlights
- `--destructive` - Error states
- `--border` - Consistent borders
- `--card` / `--card-foreground` - Card backgrounds

### Theme-Aware Classes
```typescript
// ✅ Correct - uses design tokens
className="border-border bg-card text-foreground"

// ❌ Avoid - hardcoded colors break themes
className="border-gray-600 bg-gray-600/10 text-gray-400"
```

---

## Performance Optimizations

1. **Canvas Rendering** - Direct pixel manipulation for smooth animations
2. **RequestAnimationFrame** - Synchronized game loop
3. **Memoization** - React.memo and useMemo for expensive calculations
4. **Lazy Loading** - Theme backgrounds loaded on demand
5. **Event Debouncing** - Keyboard/touch input optimization

---

## Future Roadmap

- [ ] Multiplayer mode (WebSocket)
- [ ] Achievement system
- [ ] Weekly challenges
- [ ] Power-ups (speed boost, invincibility, magnet)
- [ ] Custom snake skin creator
- [ ] Social sharing to Twitter/Instagram
