# Grasslands Academy — Task List

## Phase 1 — Shell & Data
- [ ] Create `grasslands-academy/` directory structure (index.html, style.css, game.js, data.js, puzzle.js, battle.js, minigames.js)
- [ ] `data.js`: 12 grassland animals with SVG path data
- [ ] `data.js`: 3 facts per animal (36 total)
- [ ] `data.js`: 30 quiz questions from fact pool
- [ ] `data.js`: i18n strings (EN + Spanish, French, Portuguese, Mandarin, Hindi)
- [ ] `game.js`: STATE schema + save()/load() via localStorage
- [ ] `game.js`: navigate(screenId) router (show/hide screen divs)
- [ ] `style.css`: colour palette, typography, layout primitives
- [ ] `index.html`: shell with all screen containers
- [ ] **CHECKPOINT A**: State saves/loads; screen navigation works

## Phase 2 — Onboarding
- [ ] Role screen (Student / Teacher buttons)
- [ ] Student: Gender screen
- [ ] Student: Nickname screen (suggested names + custom input)
- [ ] Student: Year Level screen (Years 3–10)
- [ ] Teacher: Create class screen (name input, generated class code)
- [ ] Persist profile to state on complete; skip onboarding on reload
- [ ] **CHECKPOINT B**: Full onboarding flow; second load skips to Home

## Phase 3 — Home Screen & Avatar
- [ ] Shared home screen layout component (reused across all 5 worlds)
- [ ] "by Nina" credit top-centre
- [ ] Clickable avatar + editable player name
- [ ] Coin counter + level box (left)
- [ ] Translate box (middle-right) — language switch
- [ ] Play button (bottom-centre)
- [ ] Worlds button + worlds selector modal (5 slots, locked/unlocked)
- [ ] Avatar screen: current skin + owned skins grid + equip on tap
- [ ] Rarity badges (Common/Rare/Special) with multiplier labels
- [ ] **CHECKPOINT C**: Translate box switches UI language; worlds modal works

## Phase 4 — Jigsaw Engine + Facts
- [ ] `puzzle.js`: canvas jigsaw renderer; animal SVG split into grid pieces
- [ ] Piece count: min(level × 100, 100) for mobile-friendly display
- [ ] Drag-to-snap: mouse + touch events
- [ ] Completion detection; trigger reward flow
- [ ] Economy: +5 coins, +1 level on complete
- [ ] Pet/skin drop roll (weighted by rarity)
- [ ] Facts screen: 3 facts for completed animal + Next button
- [ ] Level 10 completion → set worldsUnlocked; swap Play button for Worlds
- [ ] **CHECKPOINT D**: Full puzzle loop; facts show; coins/level increment

## Phase 5 — World 2: Pet Battle
- [ ] Pet roster screen (all owned pets with stats)
- [ ] Battle screen: select pet vs AI opponent
- [ ] Damage formula: petStat × rarityMult × skinMult
- [ ] Round resolution + HP bars animation
- [ ] Win/lose screen with coin reward (+10 coins win)
- [ ] Training mode: spend 5 coins → pet gains +1 stat
- [ ] World 2 home screen (shared layout)
- [ ] **CHECKPOINT E**: Battle resolves; training deducts coins; state persists

## Phase 6 — World 3: Quiz
- [ ] Quiz screen: question + 4 answer choices
- [ ] Question pool drawn from data.quizQuestions (facts-derived only)
- [ ] Correct answer: +5 coins + visual feedback
- [ ] Wrong answer: no coins + correct answer revealed
- [ ] 10-question session with end screen (score + coins earned)
- [ ] World 3 home screen (shared layout)
- [ ] **CHECKPOINT F**: Quiz awards coins only on correct; no non-spec questions

## Phase 7 — World 4: Mini-Games
- [ ] Mini-game hub screen (6 game cards)
- [ ] Game 1: Rescue Reserve (tap timer game)
- [ ] Game 2: Food Chain Builder (drag-drop ordering)
- [ ] Game 3: Migration Challenge (keyboard/swipe movement)
- [ ] Game 4: Habitat Builder (drag animals to zones)
- [ ] Game 5: Research Lab (click-to-reveal fact cards)
- [ ] Game 6: Ecosystem Simulator (population sliders)
- [ ] Each game: win/lose state + coin reward
- [ ] World 4 home screen (shared layout)
- [ ] **CHECKPOINT G**: All 6 games start, complete, award coins

## Phase 8 — World 5: Final Boss
- [ ] Boss screen: 12-heart display + round counter
- [ ] 5 threat SVG illustrations (poacher, wildfire, drought, habitat loss, climate change)
- [ ] Round flow: quiz Q → correct = attack animation; wrong = lose heart
- [ ] Pet attack animation (CSS keyframe)
- [ ] Win condition: 5 rounds cleared
- [ ] Lose condition: 0 hearts → retry prompt
- [ ] Win screen: congratulations + final coin reward
- [ ] World 5 home screen (shared layout)
- [ ] **CHECKPOINT H**: Full boss flow completable; hearts decrement; win/lose triggers

## Phase 9 — Polish & Deploy
- [ ] Mobile-first responsive pass (320px–1024px)
- [ ] Screen transition animations (CSS fade 150ms)
- [ ] Teacher dashboard stub (class code display + placeholder student list)
- [ ] Verify "by Nina" appears on all 5 world home screens
- [ ] Cross-screen audit: all coin/level displays sync from state
- [ ] Smoke test: fresh localStorage → onboarding → puzzle → world unlock
- [ ] `npx wrangler deploy` to Cloudflare
- [ ] **CHECKPOINT I**: Live at /grasslands-academy/; no console errors

## Notes
- Piece count capped at 100 for mobile performance (spec says level×100 but 1000 pieces is unplayable on canvas — cap with note to Nina)
- SVG animals: geometric style (no external image deps)
- Translation: EN + 5 languages for ~20 key UI strings
