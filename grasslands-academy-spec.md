# Grasslands Academy — Game Specification

*Educational browser game for students · by Nina*

## Overview

Grasslands Academy is a web-based educational game that teaches students about grassland and savanna animals through jigsaw puzzles, pet battles, quizzes, mini-games, and a final boss challenge. Students collect animal-themed avatar skins and pets as they progress through 5 worlds.

## Branding

- **Name:** Grasslands Academy
- **Credit:** "by Nina" appears in the top-centre of every home screen across all worlds
- **Audience:** Students (educational)

## Onboarding

First-time players are routed by role:

1. **Role screen** — Student or Teacher?
2. **Student path:**
   - Gender screen — Male or Female
   - Nickname screen — pick a random suggested name (gender-based list) or type your own
   - Year level screen — choose grade/year before playing
3. **Teacher path:**
   - Create classes — teachers can create classes to monitor students' learning

## Main Home Screen (shared layout on every world)

Every world has its own home screen using the same layout:

- **Top-centre:** "by Nina" credit
- **Centre:** Avatar (click to open Avatar screen) with player name below (editable)
- **Left:**
  - Coin counter (starts at 0, +5 per game played)
  - Level box below coins (starts at 0, +1 per game played)
- **Middle-right:** Translate box — type any supported language to switch UI
- **Bottom-centre:** Play button
- **Bottom-right:** Worlds button (opens the 5-world selector)

## Avatar Screen

- Current avatar shown at the top
- All owned avatar skins shown in a grid underneath
- Tap a skin to equip it
- Skins give **strength + defense multipliers** by rarity:
  - Common → 2×
  - Rare → 3×
  - Special → 4×

## Core Loop — Jigsaw Puzzles (Levels 1–10)

- Every "Play" press launches a jigsaw puzzle of a **random grassland animal**
- Piece count scales with level:
  - Level 1 → 100 pieces
  - Level 2 → 200 pieces
  - Level 3 → 300 pieces
  - …
  - Level 10 → 1000 pieces
- On level 10 completion, jigsaw puzzles end and Worlds unlock as the primary mode
- Rewards per completed puzzle:
  - +5 coins
  - +1 level
  - Chance to drop a **pet** and/or **skin** matching the animal

## Facts Screen (World 1, post-puzzle)

- After each puzzle, students see a screen with **3 facts** about the animal they just completed
- Educational reinforcement; feeds the World 3 quiz pool

## Pets

- Drop from puzzle completions (same animal as the puzzle)
- Rarity determines coin multiplier and battle power:
  - Common → 2×
  - Rare → 3×
  - Special → 4×
- Pets assist in World 2 battles

## Worlds (5 total)

Worlds Screen shows all 5 worlds (locked/unlocked state).

### World 1 — Grassland Puzzles

- Grassland animals only (lion, elephant, zebra, giraffe, cheetah, rhino, hippo, buffalo, gazelle, meerkat, etc.)
- Jigsaw puzzle loop described above
- Facts screen after each puzzle
- Pet and skin drops

### World 2 — Savanna Battle Arena

- Biome: Savanna
- Home screen in standard layout
- Pet vs pet combat against other players (AI opponents)
- Pet training mode to level up your pets
- Pet rarity × skin multiplier determines strength and defense

### World 3 — Quiz World

- Home screen in standard layout
- Multiple-choice quiz
- Questions drawn only from content the game has taught (facts shown after puzzles, battle mechanics, etc.)
- Reward: **+5 coins per correct answer**
- Covers grassland + savanna animals and ecology

### World 4 — Mini-Game Hub

Home screen in standard layout. Six mini-games:

1. **Rescue Reserve** — time-limited tap/drag to save injured or endangered grassland animals
2. **Food Chain Builder** — drag-and-drop to arrange correct predator/prey/plant order
3. **Migration Challenge** — guide a herd (zebras/wildebeest) across the Serengeti, avoiding obstacles and predators
4. **Habitat Builder** — place each animal into its correct micro-habitat (riverbank, acacia tree, open plain)
5. **Research Lab** — collect facts and unlock deep-dive cards (anatomy, behaviour, conservation status)
6. **Ecosystem Simulator** — manage populations (grass ↔ herbivores ↔ predators) to keep the savanna balanced

### World 5 — Final Boss Challenge

- Home screen in standard layout
- Player has **12 hearts** total
- **5 rounds** against grassland threats (e.g. poachers, wildfire, drought, habitat loss, climate change)
- Combat flow per round:
  1. Quiz question appears
  2. Correct answer → pet attacks the threat
  3. Wrong answer → lose 1 heart
- Survive all 5 rounds to defeat the final boss and complete the game

## Translation

- Built-in static language list (no external API)
- Translate box is on the middle-right of every home screen
- Typing a supported language name switches the UI strings

## Progression Summary

| Stage | Content |
|---|---|
| Onboarding | Role → gender / classes → name → year level |
| Home | Shared layout across all worlds ("by Nina" top-centre) |
| Avatar | Current on top; owned skins grid; rarity multipliers |
| Levels 1–10 | Jigsaw puzzles (100 × level pieces) + Facts screen |
| Worlds | 5 worlds unlock after core puzzle loop |
| W1 | Grassland puzzles |
| W2 | Savanna pet battles + training |
| W3 | Quiz (+5 coins per correct) |
| W4 | Mini-game hub (6 games) |
| W5 | Final Boss Challenge (12 hearts, 5 rounds, quiz-gated attacks) |

## Economy

- **Coins:** +5 per puzzle game, +5 per correct quiz answer, battle/mini-game rewards
- **Level:** +1 per puzzle game (levels 1–10)
- **Pets:** drop from puzzles; rarity drives 2×/3×/4× coin multiplier
- **Skins:** unlock matching animal's skin; rarity drives 2×/3×/4× strength+defense

## Educational Intent

- Every piece of challenge content (quiz, boss questions) must come from content the game itself has already taught the student (puzzles → facts → mini-games)
- Teachers can create classes to monitor student progress
