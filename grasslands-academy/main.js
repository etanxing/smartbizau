// Grasslands Academy — Main Controller
// Wires up all screens, events, and the game boot sequence.

// ── Result overlay ────────────────────────────────────────────────────────────

let _resultCallback = null;

function showResult(emoji, title, body, callback) {
  setText('result-emoji', emoji);
  setText('result-title', title);
  setText('result-body', body);
  el('result-overlay').classList.remove('hidden');
  _resultCallback = callback || null;
}

function hideResult() {
  el('result-overlay').classList.add('hidden');
  if (_resultCallback) { _resultCallback(); _resultCallback = null; }
}

// ── Worlds modal ──────────────────────────────────────────────────────────────

function openWorldsModal() {
  const grid = el('worlds-grid');
  grid.textContent = '';

  WORLD_DEFS.forEach((w, i) => {
    const unlocked = i === 0 || STATE.worldsUnlocked;
    const row = makeEl('div', 'world-row' + (unlocked ? '' : ' locked'), '');
    row.dataset.worldId = w.id;

    const icon = makeEl('span', 'world-icon', w.icon);
    const name = makeEl('span', 'world-name', 'W' + w.id + ': ' + w.name);
    const badge = makeEl('span', 'world-badge ' + (unlocked ? 'open' : 'locked'), unlocked ? 'Unlocked' : 'Locked');

    row.appendChild(icon);
    row.appendChild(name);
    row.appendChild(badge);

    if (unlocked) {
      row.addEventListener('click', () => {
        closeWorldsModal();
        goToWorld(w.id);
      });
    }
    grid.appendChild(row);
  });

  el('worlds-modal').classList.remove('hidden');
}

function closeWorldsModal() {
  el('worlds-modal').classList.add('hidden');
}

function goToWorld(id) {
  STATE.currentWorld = id;
  save();
  const screens = { 1: 'screen-home', 2: 'screen-world2', 3: 'screen-world3', 4: 'screen-world4', 5: 'screen-world5' };
  navigate(screens[id] || 'screen-home');
}

// ── Onboarding ────────────────────────────────────────────────────────────────

function showOnboardStep(stepId) {
  ['onboard-step-role','onboard-step-gender','onboard-step-name','onboard-step-year','onboard-step-teacher']
    .forEach(id => el(id).classList.add('hidden'));
  el(stepId).classList.remove('hidden');
}

let _selectedGender = 'male';
let _selectedName = '';
let _selectedYear = '';

function setupOnboarding() {
  el('btn-student').addEventListener('click', () => showOnboardStep('onboard-step-gender'));
  el('btn-teacher').addEventListener('click', () => showOnboardStep('onboard-step-teacher'));

  el('btn-male').addEventListener('click', () => { _selectedGender = 'male'; buildNameStep(); showOnboardStep('onboard-step-name'); });
  el('btn-female').addEventListener('click', () => { _selectedGender = 'female'; buildNameStep(); showOnboardStep('onboard-step-name'); });

  el('btn-name-next').addEventListener('click', () => {
    const custom = el('custom-name-input').value.trim();
    _selectedName = custom || _selectedName;
    if (!_selectedName) { el('custom-name-input').focus(); return; }
    buildYearStep();
    showOnboardStep('onboard-step-year');
  });

  el('btn-create-class').addEventListener('click', () => {
    const className = el('class-name-input').value.trim() || 'My Class';
    const code = generateClassCode();
    setText('class-code-val', code);
    STATE.profile = { role: 'teacher', className, classCode: code };
    save();
    el('class-code-result').classList.remove('hidden');
  });

  el('btn-teacher-done').addEventListener('click', () => {
    navigate('screen-teacher');
  });
}

function buildNameStep() {
  const names = _selectedGender === 'female' ? SUGGESTED_NAMES_FEMALE : SUGGESTED_NAMES_MALE;
  const grid = el('suggested-names');
  grid.textContent = '';
  const suggestions = shuffle(names).slice(0, 8);
  suggestions.forEach(name => {
    const pill = makeEl('button', 'name-pill', name);
    pill.addEventListener('click', () => {
      grid.querySelectorAll('.name-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      _selectedName = name;
      el('custom-name-input').value = '';
    });
    grid.appendChild(pill);
  });
}

function buildYearStep() {
  const grid = el('year-grid');
  grid.textContent = '';
  const startBtn = el('btn-year-start');
  YEAR_LEVELS.forEach(yr => {
    const btn = makeEl('button', 'year-btn', yr);
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.year-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      _selectedYear = yr;
      startBtn.classList.remove('hidden');
    });
    grid.appendChild(btn);
  });
  startBtn.classList.add('hidden');
  startBtn.onclick = () => {
    if (!_selectedYear) return;
    STATE.profile = { role: 'student', gender: _selectedGender, name: _selectedName, yearLevel: _selectedYear };
    save();
    navigate('screen-home');
  };
}

// ── Home screen ───────────────────────────────────────────────────────────────

function setupHomeScreen() {
  el('home-avatar-btn').addEventListener('click', () => navigate('screen-avatar'));

  el('home-play-btn').addEventListener('click', () => {
    const animal = randomAnimal();
    startPuzzle(animal);
  });

  el('home-worlds-btn').addEventListener('click', openWorldsModal);

  el('home-player-name').addEventListener('blur', () => {
    const name = el('home-player-name').textContent.trim();
    if (name && STATE.profile) { STATE.profile.name = name; save(); }
  });

  setupTranslateInput('translate-input');
}

function setupTranslateInput(inputId) {
  const inp = el(inputId);
  if (!inp) return;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { setLang(inp.value); inp.blur(); } });
  inp.addEventListener('change', () => setLang(inp.value));
}

registerScreen('screen-home', () => {
  const name = STATE.profile?.name || 'Explorer';
  const nameEl = el('home-player-name');
  if (nameEl) nameEl.textContent = name;
  updateHUD();

  // Swap Play ↔ Worlds once unlocked
  const playBtn = el('home-play-btn');
  if (STATE.worldsUnlocked) {
    playBtn.textContent = '🌍 Choose World';
    playBtn.onclick = openWorldsModal;
  } else {
    playBtn.setAttribute('data-i18n', 'play');
    playBtn.textContent = t('play');
    playBtn.onclick = () => startPuzzle(randomAnimal());
  }
});

// ── Puzzle ────────────────────────────────────────────────────────────────────

function startPuzzle(animal) {
  navigate('screen-puzzle', { animal });
}

registerScreen('screen-puzzle', ({ animal } = {}) => {
  if (!animal) animal = randomAnimal();
  const label = el('puzzle-animal-label');
  const pieceLabel = el('puzzle-piece-label');
  const pieceCount = (STATE.level + 1) * 100;

  if (label) label.textContent = animal.name;
  if (pieceLabel) pieceLabel.textContent = pieceCount + '-piece puzzle';

  // Preview
  const preview = el('puzzle-preview');
  if (preview) setSVG(preview, drawAnimalSVG(animal, 78, 60));

  setupPuzzleCanvas();
  initPuzzle(animal);
});

el('puzzle-back-btn') && document.getElementById('puzzle-back-btn').addEventListener('click', () => navigate('screen-home'));

// ── Facts ─────────────────────────────────────────────────────────────────────

registerScreen('screen-facts', ({ animal, drops } = {}) => {
  if (!animal) return;

  const art = el('facts-animal-art');
  if (art) setSVG(art, drawAnimalSVG(animal, 140, 120));

  setText('facts-animal-name', animal.name);

  const factList = el('fact-list');
  factList.textContent = '';
  animal.facts.forEach(f => {
    factList.appendChild(makeEl('div', 'fact-item', f));
  });

  const dropList = el('drop-list');
  dropList.textContent = '';
  if (drops && drops.length) {
    drops.forEach(d => {
      const badge = makeEl('span', 'drop-badge drop-' + d.type,
        (d.type === 'pet' ? '🐾 New pet: ' : '👕 New skin: ') + d.animalId + ' (' + formatRarity(d.rarity) + ')');
      dropList.appendChild(badge);
    });
  }
});

document.getElementById('facts-next-btn').addEventListener('click', () => navigate('screen-home'));

// ── Avatar ────────────────────────────────────────────────────────────────────

registerScreen('screen-avatar', () => {
  // Current skin display
  const currentArt = document.querySelector('#screen-avatar .avatar-display');
  if (currentArt) setSVG(currentArt, renderAvatarSVG(STATE.equippedSkin));

  const nameEl = el('avatar-current-name');
  const rarityEl = el('avatar-current-rarity');
  if (STATE.equippedSkin) {
    const a = ANIMALS.find(x => x.id === STATE.equippedSkin.animalId);
    if (nameEl) nameEl.textContent = a ? a.name : '';
    if (rarityEl) rarityEl.textContent = formatRarity(STATE.equippedSkin.rarity) + ' ' + (RARITY[STATE.equippedSkin.rarity]?.label || '');
  } else {
    if (nameEl) nameEl.textContent = 'Default';
    if (rarityEl) rarityEl.textContent = '';
  }

  const grid = el('skins-grid');
  grid.textContent = '';

  if (!STATE.skins.length) {
    grid.appendChild(makeEl('div', 'muted', 'Complete puzzles to earn skins!'));
    return;
  }

  STATE.skins.forEach((skin, idx) => {
    const animal = ANIMALS.find(a => a.id === skin.animalId);
    if (!animal) return;
    const card = makeEl('div', 'skin-card' + (STATE.equippedSkin?.animalId === skin.animalId && STATE.equippedSkin?.rarity === skin.rarity ? ' equipped' : ''), '');
    const art = makeEl('div', 'skin-art', '');
    setSVG(art, drawAnimalSVG(animal, 64, 52));
    const name = makeEl('div', 'skin-name', animal.name);
    const rarity = makeEl('div', 'skin-rarity', formatRarity(skin.rarity) + ' ' + (RARITY[skin.rarity]?.label || ''));
    const mult = makeEl('div', 'skin-rarity', RARITY[skin.rarity].mult + '× power');
    card.appendChild(art);
    card.appendChild(name);
    card.appendChild(rarity);
    card.appendChild(mult);

    card.addEventListener('click', () => {
      STATE.equippedSkin = { animalId: skin.animalId, rarity: skin.rarity };
      save();
      navigate('screen-avatar');
    });
    grid.appendChild(card);
  });
});

document.getElementById('avatar-back-btn').addEventListener('click', () => navigate('screen-home'));

// ── World 2: Battle ───────────────────────────────────────────────────────────

document.getElementById('w2-battle-btn').addEventListener('click', () => navigate('screen-battle'));
document.getElementById('w2-train-btn').addEventListener('click', () => navigate('screen-train'));
document.getElementById('w2-worlds-btn').addEventListener('click', openWorldsModal);

registerScreen('screen-battle', () => {
  const arena = el('battle-arena');
  const attackBtn = el('battle-attack-btn');
  const noPets = el('battle-no-pets');
  const roster = el('pet-roster-battle');

  if (!STATE.pets.length) {
    arena.style.display = 'none';
    attackBtn.style.display = 'none';
    noPets.classList.remove('hidden');
    roster.textContent = '';
    return;
  }
  noPets.classList.add('hidden');
  renderPetRoster();

  arena.style.display = 'none';
  attackBtn.style.display = 'none';
});

function renderPetRoster() {
  const roster = el('pet-roster-battle');
  if (!roster) return;
  roster.textContent = '';
  STATE.pets.forEach((pet, idx) => {
    const animal = ANIMALS.find(a => a.id === pet.animalId);
    const card = makeEl('div', 'pet-card', '');
    const artDiv = makeEl('div', 'pet-art', '');
    if (animal) setSVG(artDiv, drawAnimalSVG(animal, 48, 40));
    const name = makeEl('div', 'skin-name', animal?.name || pet.animalId);
    const rarity = makeEl('div', 'skin-rarity', formatRarity(pet.rarity));
    const stat = makeEl('div', 'skin-rarity', 'ATK: ' + pet.stat);
    card.appendChild(artDiv);
    card.appendChild(name);
    card.appendChild(rarity);
    card.appendChild(stat);
    card.addEventListener('click', () => {
      roster.querySelectorAll('.pet-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      startBattle(pet);
      el('battle-arena').style.display = 'grid';
      el('battle-attack-btn').style.display = '';
    });
    roster.appendChild(card);
  });
}

document.getElementById('battle-back-btn').addEventListener('click', () => navigate('screen-world2'));
document.getElementById('battle-attack-btn').addEventListener('click', playerAttack);

registerScreen('screen-train', () => {
  const roster = el('pet-roster-train');
  roster.textContent = '';
  if (!STATE.pets.length) {
    roster.appendChild(makeEl('div', 'muted text-c', 'No pets yet! Complete puzzles first.'));
    return;
  }
  STATE.pets.forEach((pet, idx) => {
    const animal = ANIMALS.find(a => a.id === pet.animalId);
    const card = makeEl('div', 'pet-card', '');
    const artDiv = makeEl('div', 'pet-art', '');
    if (animal) setSVG(artDiv, drawAnimalSVG(animal, 48, 40));
    const name = makeEl('div', 'skin-name', animal?.name || pet.animalId);
    const rarity = makeEl('div', 'skin-rarity', formatRarity(pet.rarity));
    const stat = makeEl('div', 'skin-rarity', 'ATK: ' + pet.stat);
    const btn = makeEl('button', 'btn btn-green btn-sm w-full mt-8', 'Train (+1 stat) 🪙5');
    btn.addEventListener('click', e => { e.stopPropagation(); trainPet(idx); navigate('screen-train'); });
    card.appendChild(artDiv);
    card.appendChild(name);
    card.appendChild(rarity);
    card.appendChild(stat);
    card.appendChild(btn);
    roster.appendChild(card);
  });
  updateHUD();
});

document.getElementById('train-back-btn').addEventListener('click', () => navigate('screen-world2'));

// ── World 3: Quiz ─────────────────────────────────────────────────────────────

document.getElementById('w3-play-btn').addEventListener('click', () => navigate('screen-quiz'));
document.getElementById('w3-worlds-btn').addEventListener('click', openWorldsModal);

let quizSession = null;

registerScreen('screen-quiz', () => {
  const pool = shuffle([...QUIZ_QUESTIONS]).slice(0, 10);
  quizSession = { pool, idx: 0, correct: 0 };
  renderQuizQuestion();
});

function renderQuizQuestion() {
  if (!quizSession) return;
  const { pool, idx } = quizSession;
  if (idx >= pool.length) { endQuiz(); return; }

  const q = pool[idx];
  setText('quiz-q-num', idx + 1);
  el('quiz-prog-bar').style.width = ((idx + 1) / pool.length * 100) + '%';
  setText('quiz-question', q.q);
  setText('quiz-feedback', '');

  const opts = el('quiz-options');
  opts.textContent = '';
  q.options.forEach((opt, i) => {
    const btn = makeEl('button', 'quiz-option', opt);
    btn.addEventListener('click', () => handleQuizAnswer(i, q.answer, btn));
    opts.appendChild(btn);
  });
}

function handleQuizAnswer(chosen, correct, btn) {
  const opts = el('quiz-options');
  opts.querySelectorAll('.quiz-option').forEach(b => { b.disabled = true; });

  if (chosen === correct) {
    btn.classList.add('correct');
    setText('quiz-feedback', '✅ ' + t('correct') + ' +5 coins');
    addCoins(5);
    quizSession.correct++;
  } else {
    btn.classList.add('wrong');
    opts.querySelectorAll('.quiz-option')[correct].classList.add('correct');
    setText('quiz-feedback', '❌ ' + t('wrong'));
  }

  setTimeout(() => {
    quizSession.idx++;
    renderQuizQuestion();
  }, 1200);
}

function endQuiz() {
  const { correct, pool } = quizSession;
  showResult('🧠', t('score') + ': ' + correct + '/' + pool.length, 'Great learning!', () => navigate('screen-world3'));
}

document.getElementById('quiz-back-btn').addEventListener('click', () => navigate('screen-world3'));

// ── World 4: Mini-Games ───────────────────────────────────────────────────────

document.getElementById('w4-worlds-btn').addEventListener('click', openWorldsModal);

document.getElementById('minigame-grid').addEventListener('click', e => {
  const card = e.target.closest('.minigame-card');
  if (!card) return;
  launchMinigame(card.dataset.game);
});

document.getElementById('mg-back-btn').addEventListener('click', () => {
  if (mgState?.cleanup) mgState.cleanup();
  navigate('screen-world4');
});

// ── World 5: Final Boss ───────────────────────────────────────────────────────

document.getElementById('w5-play-btn').addEventListener('click', startBossChallenge);
document.getElementById('w5-worlds-btn').addEventListener('click', openWorldsModal);

let bossSession = null;

function startBossChallenge() {
  STATE.bossHearts = 12;
  STATE.bossRound = 0;
  save();
  bossSession = {
    hearts: 12,
    round: 0,
    questions: shuffle([...QUIZ_QUESTIONS]).slice(0, 5),
    threats: shuffle([...THREATS]).slice(0, 5)
  };
  navigate('screen-boss');
  renderBossRound();
}

registerScreen('screen-boss', () => {
  if (!bossSession) bossSession = {
    hearts: STATE.bossHearts || 12,
    round: STATE.bossRound || 0,
    questions: shuffle([...QUIZ_QUESTIONS]).slice(0, 5),
    threats: shuffle([...THREATS]).slice(0, 5)
  };
  renderBossRound();
});

function renderBossRound() {
  const { hearts, round, threats, questions } = bossSession;

  // Hearts
  const heartsRow = el('hearts-row');
  heartsRow.textContent = '';
  for (let i = 0; i < 12; i++) {
    const heart = makeEl('span', 'heart' + (i >= hearts ? ' lost' : ''), '❤️');
    heartsRow.appendChild(heart);
  }

  setText('boss-round-num', round + 1);
  setText('w5-hearts-hud', hearts);

  if (round >= 5) { endBossChallenge(true); return; }

  const threat = threats[round];
  setText('boss-threat-icon', threat.emoji);
  setText('boss-threat-name', threat.name);
  setText('boss-threat-desc', threat.description);

  const q = questions[round];
  setText('boss-question', q.q);
  setText('boss-feedback', '');

  const opts = el('boss-options');
  opts.textContent = '';
  q.options.forEach((opt, i) => {
    const btn = makeEl('button', 'quiz-option', opt);
    btn.addEventListener('click', () => handleBossAnswer(i, q.answer, btn));
    opts.appendChild(btn);
  });
}

function handleBossAnswer(chosen, correct, btn) {
  el('boss-options').querySelectorAll('.quiz-option').forEach(b => { b.disabled = true; });

  if (chosen === correct) {
    btn.classList.add('correct');
    setText('boss-feedback', '⚔️ Your pet attacks! Threat defeated!');
    btn.classList.add('pop');
    bossSession.round++;
  } else {
    btn.classList.add('wrong');
    el('boss-options').querySelectorAll('.quiz-option')[correct].classList.add('correct');
    bossSession.hearts = Math.max(0, bossSession.hearts - 1);
    setText('boss-feedback', '💔 Wrong! Lost a heart.');
    if (bossSession.hearts <= 0) {
      setTimeout(() => endBossChallenge(false), 1000);
      return;
    }
  }

  setTimeout(() => {
    if (bossSession.round >= 5) { endBossChallenge(true); return; }
    renderBossRound();
  }, 1200);
}

function endBossChallenge(won) {
  if (won) {
    STATE.bossBeaten = true;
    save();
    addCoins(50);
    showResult('🏆', 'You saved the grassland!', 'All 5 threats defeated! +50 coins', () => navigate('screen-world5'));
  } else {
    showResult('💀', t('lose'), 'Your hearts ran out. Try again!', () => navigate('screen-world5'));
  }
}

// ── Shared translate inputs ────────────────────────────────────────────────────

['translate-input-2','translate-input-3','translate-input-4','translate-input-5'].forEach(id => {
  setupTranslateInput(id);
});

// ── Worlds modal events ───────────────────────────────────────────────────────

document.getElementById('worlds-modal-close').addEventListener('click', closeWorldsModal);
document.getElementById('worlds-modal').addEventListener('click', e => {
  if (e.target === el('worlds-modal')) closeWorldsModal();
});

// ── Result overlay ────────────────────────────────────────────────────────────

document.getElementById('result-continue-btn').addEventListener('click', hideResult);

// ── Teacher screen ────────────────────────────────────────────────────────────

document.getElementById('teacher-back-btn').addEventListener('click', () => navigate('screen-home'));

registerScreen('screen-teacher', () => {
  const code = STATE.profile?.classCode || '—';
  setText('teacher-class-code', code);
});

// ── Boot sequence ─────────────────────────────────────────────────────────────

(function boot() {
  load();

  if (!STATE.profile) {
    navigate('screen-onboard');
    setupOnboarding();
  } else if (STATE.profile.role === 'teacher') {
    navigate('screen-teacher');
  } else {
    navigate('screen-home');
  }

  // Global back gesture (swipe right) — optional convenience
  let touchX = 0;
  document.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (dx > 80 && _currentScreen !== 'screen-puzzle' && _currentScreen !== 'screen-mg-active') {
      window.history.back();
    }
  }, { passive: true });
})();
