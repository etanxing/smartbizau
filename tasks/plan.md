# Grasslands Academy — Implementation Plan

## Architecture

**Deployment:** Static files served via Cloudflare Workers (existing `wrangler.jsonc`)
**Entry point:** `/grasslands-academy/index.html`
**Tech:** Vanilla HTML + CSS + JS (no build tools, matches site conventions)
**State:** `localStorage` for all player progress
**Assets:** SVG-drawn animals (no external images; no network calls)
**Translation:** Static JS object mapping UI keys → language strings

## Directory Structure

```
grasslands-academy/
  index.html          ← shell + all screens as hidden <div>s
  style.css           ← game styles
  game.js             ← main controller / router
  data.js             ← animals, facts, quiz questions, translations
  puzzle.js           ← jigsaw engine (canvas-based)
  battle.js           ← World 2 pet combat
  minigames.js        ← World 4 six mini-games
```

## Component Dependency Graph

```
data.js (animals, facts, quizzes, i18n)
  └─ game.js (state, router, economy)
       ├─ Onboarding screens  [no deps]
       ├─ Home screen         [← state]
       ├─ Avatar screen       [← state.skins]
       ├─ puzzle.js           [← data.animals]
       │    └─ Facts screen   [← data.facts]
       ├─ battle.js           [← state.pets, state.skins]
       ├─ Quiz screen         [← data.quizQuestions]
       ├─ minigames.js        [← data.animals]
       └─ Boss screen         [← state.pets, data.quizQuestions]
```

## Phased Plan

### Phase 1 — Shell & Data (Checkpoint A)
Foundation everything else depends on.
- `data.js`: 12 grassland animals with SVG paths, 3 facts each, 30 quiz Qs, i18n strings (EN + 5 languages)
- `game.js`: `STATE` object, `save()`/`load()` via localStorage, `navigate(screenId)` router
- `style.css`: Design system (colours, fonts, layout primitives, button variants, card grid)
- `index.html`: Shell with all screen `<div>` containers; only one visible at a time

**Acceptance:** navigating between blank screen placeholders works; state saves/loads from localStorage.

---

### Phase 2 — Onboarding (Checkpoint B)
Complete first-run flow before any gameplay.
- Role screen (Student / Teacher)
- Student: Gender → Nickname (suggested name list) → Year Level
- Teacher: Create class (name + class code shown)
- On completion: write `state.profile`, navigate to World 1 Home

**Acceptance:** Fresh localStorage → sees onboarding; second load → skips to Home.

---

### Phase 3 — Home Screen & Avatar (Checkpoint C)
Shared layout used by all 5 worlds.
- Top-centre: "by Nina" credit
- Centre: clickable avatar SVG + player name (editable inline)
- Left: coin counter + level box
- Middle-right: translate box (typing language name switches UI strings)
- Bottom-centre: Play button
- Bottom-right: Worlds button → worlds selector modal
- Avatar screen: current skin on top, owned skins grid, tap to equip, rarity badges

**Acceptance:** Coins/level update live from state; translate box switches 3 UI strings; worlds modal shows 5 slots (locked/unlocked).

---

### Phase 4 — Jigsaw Engine + Facts (Checkpoint D)
Core loop, levels 1–10.
- `puzzle.js`: canvas-based jigsaw; piece count = level × 100 (capped at display-friendly grid); pieces are coloured regions of the animal SVG
- Drag-to-snap interaction with touch + mouse support
- On complete: award +5 coins, +1 level, roll pet/skin drop (rarity table)
- Facts screen: shows 3 animal facts post-puzzle, "Next" to return to Home
- Level 10 completion: sets `state.worldsUnlocked = true`

**Acceptance:** Complete a puzzle → coins+1 level increment; facts screen shows correct animal; after level 10 Play button replaced by Worlds.

---

### Phase 5 — World 2: Pet Battle (Checkpoint E)
- Pet roster screen (owned pets, stats)
- Battle: select pet → vs AI pet → round-based stat comparison with rarity+skin multipliers
- Training mode: spend coins → +1 pet stat
- Win/lose screen with coin reward

**Acceptance:** Battle resolves correctly; training deducts coins; state persists.

---

### Phase 6 — World 3: Quiz (Checkpoint F)
- Multiple-choice quiz (4 options, drawn from `data.quizQuestions`)
- Questions only from content taught (facts pool + battle mechanics)
- +5 coins per correct answer
- End screen: score summary

**Acceptance:** Wrong answer → no coins; correct → +5; questions come from taught content only.

---

### Phase 7 — World 4: Mini-Games (Checkpoint G)
Six mini-games, each self-contained:
1. **Rescue Reserve** — tap falling animals before timer; canvas
2. **Food Chain Builder** — drag cards into correct predator→prey→plant order
3. **Migration Challenge** — arrow-key/swipe herd across scrolling savanna
4. **Habitat Builder** — drag animals to correct zone (riverbank / acacia / open plain)
5. **Research Lab** — click animal to reveal fact cards; collect all to unlock deep-dive
6. **Ecosystem Simulator** — sliders control grass/herbivore/predator populations; keep balance

**Acceptance:** Each mini-game starts, has a win/lose state, and awards coins.

---

### Phase 8 — World 5: Final Boss (Checkpoint H)
- 12 heart display (top bar)
- 5 rounds, each: quiz question → correct = pet attacks threat; wrong = −1 heart
- 5 threats (poacher, wildfire, drought, habitat loss, climate change) each with SVG illustration
- Win screen: "You saved the grassland!" + coin reward
- Lose screen (0 hearts): retry from round 1

**Acceptance:** Correct answer triggers attack animation; wrong answer loses heart; 5 clears = win.

---

### Phase 9 — Polish & Deploy (Checkpoint I)
- Responsive layout (mobile-first, works on tablet)
- Transition animations between screens (CSS fade)
- Teacher dashboard stub (class code, placeholder student list)
- Verify all 5 world home screens share the same layout component
- `wrangler deploy` to Cloudflare

**Acceptance:** Game loads at `/grasslands-academy/`; all 5 worlds accessible; no console errors; localStorage state persists across refresh.

---

## Vertical Slice Order

Each task delivers a playable path end-to-end:

| # | Slice | Delivers |
|---|-------|----------|
| 1 | Shell + data | File structure, state, router |
| 2 | Onboarding | First-run UX |
| 3 | Home + Avatar | Persistent HUD |
| 4 | Puzzle + Facts | Core loop playable |
| 5 | World 2 battles | Second world playable |
| 6 | World 3 quiz | Third world playable |
| 7 | World 4 mini-games | Fourth world playable |
| 8 | World 5 boss | Game completable |
| 9 | Polish + deploy | Shipped |

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Jigsaw with 1000 pieces unplayable on mobile | Cap rendered pieces at 100 max; scale count to screen |
| SVG animal art scope creep | Use simple geometric SVG (circles/polygons); no external assets |
| Mini-game scope | Each game ≤ 80 lines JS; placeholder if time-boxed |
| Translation coverage | EN + 5 languages for critical UI strings only (not every game string) |
