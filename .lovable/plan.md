
Goals (what will change)
1) Setup screen: make the “High score” tile and the “Global leaderboard” (globe) tile the same size and feel like two matching tabs.
2) Global scoreboard: reliably save scores for all testers and immediately show updated results.
3) Top-right “paint palette” customization panel: change theme/skin lists into a grid layout (to match the other settings UI).
4) Game over UI: reduce clutter/jammed feeling (especially on mobile).
5) After saving a name: automatically return to the home screen once the score is saved successfully.
6) Add an 8th snake skin: “Wind” with a white smoky, continuous snake body (not box segments).
7) Share score card: replace the generic logo/text with the real Rattle Rush logo used on the home screen.

What I found (root causes)
A) Scoreboard issue is caused by a backend mismatch in the current code:
- The app’s runtime environment variables point to Lovable Cloud.
- But the auto-generated client file used for reading the leaderboard still points to an old backend project.
- The submit-score backend function also appears not deployed to the Lovable Cloud project you’re actually calling (which explains “save score” failing for testers).

B) The top-right palette panel is the UnifiedSettingsPanel component, and it still renders themes/skins as full-width list rows (not grid).

C) The game-over screen feels cluttered because:
- GameOverlay stacks 4 large full-width buttons inside a full-screen overlay.
- Mobile controls + help text are still rendered underneath (even though disabled), making the whole screen feel packed.

Implementation plan (ordered)
1) Fix the global scoreboard end-to-end (saving + reading)
1.1 Deploy the submit-score backend function to the Lovable Cloud backend actually used by the app
- Use the deployment flow so submit-score exists on the Lovable Cloud project.
- Confirm it is reachable at /functions/v1/submit-score and appears in backend logs.

1.2 Make leaderboard READs use the same backend as the app (Lovable Cloud)
- Update src/hooks/useGlobalLeaderboard.ts to stop importing the auto-generated client (which currently points to the wrong backend).
- Instead, create a client using import.meta.env.VITE_SUPABASE_URL and import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY (Lovable Cloud values) inside the hook (or via a small shared helper module).
- Keep the UI behavior the same (top 50 ordering, top 5 display in menu).

1.3 Make leaderboard WRITEs robust and debuggable
- Update src/hooks/useGlobalLeaderboard.ts addScore to:
  - Send both Authorization and apikey headers (some environments require both).
  - Return detailed error messages from the backend function to the UI.
- Update supabase/functions/submit-score/index.ts:
  - Expand CORS allow-headers to the recommended list for web apps.
  - Improve error logging and return messages (keep user-safe errors, log full server-side errors).
- Update GameOverlay to show a toast or inline message when saving fails, instead of silently closing.

Acceptance criteria
- A tester can finish a game, save a name, and their score appears in the global leaderboard list on the setup screen within a few seconds.
- Backend function logs show successful inserts.
- No “Failed to save score” silent failures.

Files touched
- src/hooks/useGlobalLeaderboard.ts
- supabase/functions/submit-score/index.ts
- (optional) src/lib/backendClient.ts (new helper; only if we prefer not to duplicate createClient logic)

2) Setup screen “High score” vs “Globe” tabs same size
2.1 Update GlobalLeaderboardSection layout
- Change the container to a 2-column grid so both tiles are identical width/height.
- Make the globe tile a button with label text (example: “Global”) so it visually matches the “High score” tile.
- Keep current behavior: clicking the globe tile toggles the global leaderboard section.

2.2 Handle highScore = 0 gracefully
- Still render the high score tile (show “HIGH: 0” or “HIGH: —”) so the two-tab layout stays balanced.

Acceptance criteria
- Both tiles are the same size on mobile and desktop.
- The globe tile is no longer a tiny square next to a long rectangle.

Files touched
- src/components/GameMenu/GlobalLeaderboardSection.tsx

3) Top-right palette “Customization Panel” grid layout (themes/skins)
3.1 Convert list rows to a grid for Themes and Snake Skins
- In UnifiedSettingsPanel.tsx:
  - Replace the map rendering for Themes and Skins tabs from vertical full-width buttons to a responsive grid (1 column on very small screens, 2 columns on most screens).
  - Use the same “emoji preview + label + description” layout as your other selectors for consistency.

3.2 Add Wind skin option to the grid
- Add Wind to the snakeSkins array in UnifiedSettingsPanel.tsx.

Acceptance criteria
- Themes and Skins appear as compact cards in a grid (not stacked long rows).
- The look matches the other settings grid UI.

Files touched
- src/components/UnifiedSettingsPanel.tsx

4) Game over UI cleanup (reduce clutter)
4.1 Re-layout the buttons
- Redesign GameOverlay to a centered card with:
  - Score and (optional) “New high score” line.
  - Primary actions in a 2-column row: “Try again” and “Home”.
  - Secondary actions in a second row: “Save” and “Share” (smaller buttons).
- Reduce redundant text (“Try again or give up?”) and tighten spacing.
- Ensure consistent max width and padding for mobile.

4.2 Hide mobile controls + help text while gameOver is true
- In SnakeGame.tsx:
  - Conditionally render GameControls and the “Use WASD…” hint only when not gameOver.
- Optionally hide GameInfo while gameOver to reduce stacked content.

Acceptance criteria
- The game-over state looks clean on mobile and does not feel jammed.
- No large control pad showing under the overlay.

Files touched
- src/components/GameOverlay.tsx
- src/components/SnakeGame.tsx
- (optional) src/components/GameInfo.tsx (only if we add a prop to hide while gameOver)

5) After saving name, return to home screen
5.1 Treat save as an async flow with success/failure
- Update GameOverlay.handleNameSave:
  - Call addScore and check its result.
  - On success: close dialog and call onBackToMenu to return home.
  - On failure: keep dialog open and show an error state (and/or toast).

5.2 Improve PlayerNameDialog UX
- Add a loading state (disable buttons while saving).
- Add an error message area if saving fails.

Acceptance criteria
- After a successful save, the app returns to the home screen automatically.
- If saving fails, the user is told why and can retry.

Files touched
- src/components/GameOverlay.tsx
- src/components/PlayerNameDialog.tsx

6) Add Wind snake skin (white smoky continuous body)
6.1 Add the new skin to types and selectors
- Update SnakeSkinContext.tsx to include 'wind' in the SnakeSkin union type.
- Add Wind to:
  - src/components/SnakeSkinSelector.tsx
  - src/components/UnifiedSettingsPanel.tsx

6.2 Implement Wind rendering in GameBoard without box segments
Recommended approach (for a true “snake-shaped” look):
- When snakeSkin === 'wind':
  - Render the snake using a canvas overlay that draws a continuous stroked path through the segment centers:
    - Thick white stroke with round caps and joins.
    - Multiple passes with different alpha + shadowBlur to create a smoky glow.
    - Slight time-based noise/jitter (subtle) to make it feel alive without affecting gameplay.
  - Keep food and obstacles as normal DOM elements.
- For all other skins, keep current DOM segment rendering.

Acceptance criteria
- Wind looks like a continuous smoky snake (not a chain of squares).
- Performance remains smooth on mobile.

Files touched
- src/contexts/SnakeSkinContext.tsx
- src/components/SnakeSkinSelector.tsx
- src/components/UnifiedSettingsPanel.tsx
- src/components/GameBoard.tsx

7) Share score card uses real Rattle Rush logo
7.1 Reuse the same logo asset as the home screen
- WelcomeScreen already uses: /lovable-uploads/fac2201e-f8a2-4cac-8ebc-c735a61174d1.png
- Update ShareScoreCard to display that image prominently in the card (instead of the generic snake emoji + “SNAKE RETRO” text).
- Update share text/title to “Rattle Rush” as well.

7.2 Ensure html2canvas captures the logo reliably
- Ensure the <img> is fully loaded before generating the canvas (or use html2canvas options like useCORS and proper local asset path).

Acceptance criteria
- The generated downloadable image shows the correct logo.
- The share modal no longer looks generic.

Files touched
- src/components/ShareScoreCard.tsx
- (optional) src/components/GameMenu/WelcomeScreen.tsx (only if we centralize the logo path constant)

Testing checklist (end-to-end)
1) Open menu -> setup screen: verify High and Global tiles are same size and aligned.
2) Toggle Global: leaderboard loads and displays top scores.
3) Play a quick game -> Game Over screen: verify layout is cleaner and controls are hidden.
4) Save to global leaderboard:
   - Enter a name, save, see success feedback.
   - Confirm the app returns to home screen.
   - Re-open Global leaderboard and confirm the new score is present.
5) Open top-right palette panel: verify Themes and Skins are grids.
6) Select Wind skin and start a game: verify smoky continuous snake rendering.
7) Share Score: verify score card shows the correct Rattle Rush logo and downloads correctly.
