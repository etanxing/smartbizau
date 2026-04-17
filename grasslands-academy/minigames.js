// Grasslands Academy — World 4 Mini-Games

let mgState = null;

// ── Game dispatcher ───────────────────────────────────────────────────────────

function launchMinigame(gameId) {
  mgState = null;
  const canvas = el('mg-canvas');
  if (canvas) { canvas.width = 340; canvas.height = 300; }
  el('mg-instructions').textContent = '';

  const launchers = {
    rescue:     launchRescue,
    foodchain:  launchFoodChain,
    migration:  launchMigration,
    habitat:    launchHabitat,
    research:   launchResearch,
    ecosystem:  launchEcosystem
  };

  navigate('screen-mg-active');
  const fn = launchers[gameId];
  if (fn) fn();
}

// ── 1. Rescue Reserve ─────────────────────────────────────────────────────────

function launchRescue() {
  const canvas = el('mg-canvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  el('mg-instructions').textContent = 'Tap animals before they fall! 30 seconds.';

  let score = 0, timeLeft = 30;
  const animals = [];

  function spawnAnimal() {
    const a = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    animals.push({ x: 20 + Math.random() * (w - 60), y: -40, vy: 1 + Math.random() * 2, animal: a, hit: false, alpha: 1 });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1a3a0a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, h - 20, w, 20);

    for (const a of animals) {
      ctx.save();
      ctx.globalAlpha = a.alpha;
      ctx.fillStyle = a.hit ? '#4CAF50' : '#e53935';
      ctx.beginPath();
      ctx.arc(a.x + 20, a.y + 20, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.animal.name.slice(0, 4), a.x + 20, a.y + 20);
      ctx.restore();
    }

    ctx.fillStyle = '#f5c842';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 24);
    ctx.fillStyle = timeLeft < 10 ? '#e53935' : '#fff';
    ctx.textAlign = 'right';
    ctx.fillText(timeLeft + 's', w - 10, 24);
  }

  function update() {
    for (const a of animals) {
      if (!a.hit) { a.y += a.vy; }
      else { a.alpha -= 0.05; }
    }
    animals.splice(0, animals.length, ...animals.filter(a => a.y < h && a.alpha > 0));
  }

  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (w / rect.width);
    const my = (e.clientY - rect.top) * (h / rect.height);
    for (const a of animals) {
      if (!a.hit && Math.hypot(mx - a.x - 20, my - a.y - 20) < 28) {
        a.hit = true;
        score++;
        setText('mg-score-val', score);
      }
    }
  };

  let spawnTimer = 0;
  const spawnLoop = setInterval(() => {
    spawnTimer++;
    if (spawnTimer % 2 === 0) spawnAnimal();
  }, 500);

  const ticker = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(ticker);
      clearInterval(drawLoop);
      clearInterval(spawnLoop);
      const reward = score * 2;
      addCoins(reward);
      showResult('🦁', score > 5 ? t('win') : 'Nice try!', 'You rescued ' + score + ' animals! +' + reward + ' coins');
    }
  }, 1000);

  const drawLoop = setInterval(() => { update(); draw(); }, 40);

  mgState = { cleanup: () => { clearInterval(ticker); clearInterval(drawLoop); clearInterval(spawnLoop); } };
}

// ── 2. Food Chain Builder ─────────────────────────────────────────────────────

function launchFoodChain() {
  el('mg-canvas').style.display = 'none';
  el('mg-instructions').textContent = 'Arrange from bottom to top: Plants → Herbivore → Predator';

  const chains = [
    { items: ['Grass', 'Zebra', 'Lion'],          correct: ['Grass', 'Zebra', 'Lion'] },
    { items: ['Acacia leaves', 'Giraffe', 'Lion'], correct: ['Acacia leaves', 'Giraffe', 'Lion'] },
    { items: ['Seeds', 'Gazelle', 'Cheetah'],      correct: ['Seeds', 'Gazelle', 'Cheetah'] }
  ];
  const chosen = chains[Math.floor(Math.random() * chains.length)];
  const shuffled = shuffle(chosen.items);
  const container = el('mg-drag-area');
  container.style.display = 'flex';
  container.textContent = '';

  const slotLabels = ['Predator (top)', 'Herbivore (middle)', 'Plant (bottom)'];
  const answerSlots = slotLabels.map((label, i) => {
    const wrap = document.createElement('div');
    wrap.style.marginBottom = '8px';
    const lbl = makeEl('div', 'section-title', label);
    const zone = makeEl('div', 'drag-zone');
    zone.dataset.slot = i;
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('over');
      const text = e.dataTransfer.getData('text/plain');
      zone.textContent = '';
      const card = makeEl('div', 'drag-card', text);
      zone.appendChild(card);
    });
    wrap.appendChild(lbl);
    wrap.appendChild(zone);
    container.appendChild(wrap);
    return zone;
  });

  const poolLabel = makeEl('div', 'section-title mt-12', 'Cards:');
  const pool = makeEl('div', 'drag-zone');
  shuffled.forEach(item => {
    const card = makeEl('div', 'drag-card', item);
    card.draggable = true;
    card.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', item));
    pool.appendChild(card);
  });
  container.appendChild(poolLabel);
  container.appendChild(pool);

  const checkBtn = makeEl('button', 'btn btn-primary w-full mt-16', 'Check Answer');
  checkBtn.addEventListener('click', () => {
    const answers = answerSlots.map(z => z.firstChild ? z.firstChild.textContent : '');
    const correctOrder = [chosen.correct[2], chosen.correct[1], chosen.correct[0]];
    const allRight = answers.every((a, i) => a === correctOrder[i]);
    if (allRight) { addCoins(8); showResult('🌿', t('win'), 'Perfect food chain! +8 coins'); }
    else { showResult('❌', 'Not quite!', 'Correct: ' + chosen.correct.join(' → ')); }
  });
  container.appendChild(checkBtn);

  mgState = { cleanup: () => { container.textContent = ''; el('mg-canvas').style.display = ''; } };
}

// ── 3. Migration Challenge ────────────────────────────────────────────────────

function launchMigration() {
  const dragArea = el('mg-drag-area');
  if (dragArea) dragArea.style.display = 'none';
  const canvas = el('mg-canvas');
  canvas.style.display = '';
  canvas.width = 340; canvas.height = 300;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  el('mg-instructions').textContent = 'Guide the herd! Arrow keys or swipe. Avoid predators 🦁.';

  const herd = { x: 30, y: h / 2, size: 24 };
  const obstacles = Array.from({ length: 6 }, () => ({
    x: 120 + Math.random() * 180,
    y: 20 + Math.random() * (h - 40),
    speed: 1 + Math.random(),
    dir: Math.random() > 0.5 ? 1 : -1
  }));
  let won = false, lost = false;

  const keys = new Set();
  const onKey = e => keys.add(e.key);
  window.addEventListener('keydown', onKey);

  let touchStart = null;
  const onTouchStart = e => { touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchMove = e => {
    if (!touchStart) return;
    const dx = e.touches[0].clientX - touchStart.x;
    const dy = e.touches[0].clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) { dx > 10 ? keys.add('ArrowRight') : keys.add('ArrowLeft'); }
    else { dy > 10 ? keys.add('ArrowDown') : keys.add('ArrowUp'); }
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchmove', onTouchMove, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, w, h * 0.4);
    ctx.fillStyle = '#C8A02A'; ctx.fillRect(0, h * 0.4, w, h * 0.6);

    ctx.strokeStyle = '#f5c842'; ctx.lineWidth = 3; ctx.setLineDash([8, 4]);
    ctx.beginPath(); ctx.moveTo(w - 20, 0); ctx.lineTo(w - 20, h); ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '28px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const ob of obstacles) {
      ctx.fillText('🦁', ob.x, ob.y);
    }
    ctx.fillText('🦓', herd.x, herd.y);
  }

  function update() {
    const speed = 3;
    if (keys.has('ArrowRight') || keys.has('d')) { herd.x = Math.min(herd.x + speed, w - herd.size); keys.delete('ArrowRight'); keys.delete('d'); }
    if (keys.has('ArrowLeft')  || keys.has('a')) { herd.x = Math.max(herd.x - speed, herd.size); keys.delete('ArrowLeft'); keys.delete('a'); }
    if (keys.has('ArrowUp')    || keys.has('w')) { herd.y = Math.max(herd.y - speed, herd.size); keys.delete('ArrowUp'); keys.delete('w'); }
    if (keys.has('ArrowDown')  || keys.has('s')) { herd.y = Math.min(herd.y + speed, h - herd.size); keys.delete('ArrowDown'); keys.delete('s'); }

    for (const ob of obstacles) {
      ob.y += ob.speed * ob.dir;
      if (ob.y < 14 || ob.y > h - 14) ob.dir *= -1;
      if (Math.hypot(herd.x - ob.x, herd.y - ob.y) < herd.size + 14) lost = true;
    }
    if (herd.x > w - 28) won = true;
  }

  const loop = setInterval(() => {
    if (won) {
      clearInterval(loop);
      window.removeEventListener('keydown', onKey);
      addCoins(10);
      showResult('🦓', t('win'), 'The herd made it! +10 coins');
    } else if (lost) {
      clearInterval(loop);
      window.removeEventListener('keydown', onKey);
      showResult('🦁', t('lose'), 'A predator caught the herd!');
    } else { update(); draw(); }
  }, 40);

  mgState = { cleanup: () => { clearInterval(loop); window.removeEventListener('keydown', onKey); if (dragArea) dragArea.style.display = ''; } };
}

// ── 4. Habitat Builder ────────────────────────────────────────────────────────

function launchHabitat() {
  el('mg-canvas').style.display = 'none';
  const container = el('mg-drag-area');
  container.style.display = 'flex';
  container.textContent = '';
  el('mg-instructions').textContent = 'Drag each animal to its correct habitat!';

  const assignments = [
    { animal: 'Hippo',   habitat: 'Riverbank'  },
    { animal: 'Giraffe', habitat: 'Acacia Tree' },
    { animal: 'Lion',    habitat: 'Open Plain'  },
    { animal: 'Rhino',   habitat: 'Riverbank'  },
    { animal: 'Zebra',   habitat: 'Open Plain'  },
    { animal: 'Meerkat', habitat: 'Open Plain'  }
  ];

  const pool = makeEl('div', 'drag-zone');

  const zones = ['Riverbank', 'Acacia Tree', 'Open Plain'].map(name => {
    const wrap = document.createElement('div');
    wrap.style.marginBottom = '10px';
    const lbl = makeEl('div', 'section-title', name);
    const zone = makeEl('div', 'drag-zone');
    zone.dataset.habitat = name;
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('over');
      const aName = e.dataTransfer.getData('text');
      const src = pool.querySelector('[data-animal="' + aName + '"]') ||
                  container.querySelector('[data-animal="' + aName + '"]');
      if (src) {
        const card = makeEl('div', 'drag-card', aName);
        card.dataset.animal = aName;
        card.draggable = true;
        card.addEventListener('dragstart', ev => ev.dataTransfer.setData('text', aName));
        zone.appendChild(card);
        src.remove();
      }
    });
    wrap.appendChild(lbl);
    wrap.appendChild(zone);
    container.appendChild(wrap);
    return { name, zone };
  });

  shuffle(assignments).forEach(({ animal: aName }) => {
    const card = makeEl('div', 'drag-card', aName);
    card.dataset.animal = aName;
    card.draggable = true;
    card.addEventListener('dragstart', e => e.dataTransfer.setData('text', aName));
    pool.appendChild(card);
  });
  container.appendChild(makeEl('div', 'section-title mt-12', 'Animals:'));
  container.appendChild(pool);

  const checkBtn = makeEl('button', 'btn btn-primary w-full mt-16', 'Check Habitats');
  checkBtn.addEventListener('click', () => {
    let correct = 0;
    zones.forEach(({ name, zone }) => {
      zone.querySelectorAll('.drag-card').forEach(card => {
        const a = assignments.find(x => x.animal === card.textContent);
        if (a && a.habitat === name) { correct++; card.classList.add('correct-pos'); }
        else card.classList.add('wrong-pos');
      });
    });
    const reward = correct * 2;
    addCoins(reward);
    showResult(correct === assignments.length ? '🏡' : '🔍', correct + '/' + assignments.length, '+' + reward + ' coins');
  });
  container.appendChild(checkBtn);

  mgState = { cleanup: () => { container.textContent = ''; el('mg-canvas').style.display = ''; } };
}

// ── 5. Research Lab ───────────────────────────────────────────────────────────

function launchResearch() {
  el('mg-canvas').style.display = 'none';
  const container = el('mg-drag-area');
  container.style.display = 'flex';
  container.textContent = '';
  el('mg-instructions').textContent = 'Tap animals to reveal facts. Collect 3 to unlock a deep-dive card!';

  let collected = 0;
  const remaining = shuffle([...ANIMALS]).slice(0, 6);

  remaining.forEach(animal => {
    const card = makeEl('div', 'skin-card', '');
    card.style.cursor = 'pointer';
    const artDiv = makeEl('div', 'skin-art', '');
    setSVG(artDiv, drawAnimalSVG(animal, 64, 52));
    const name = makeEl('div', 'skin-name', animal.name);
    card.appendChild(artDiv);
    card.appendChild(name);

    card.addEventListener('click', () => {
      if (card.dataset.revealed) return;
      card.dataset.revealed = '1';
      card.style.borderColor = 'var(--green)';
      const fact = makeEl('div', 'fact-item', animal.facts[0]);
      fact.style.marginTop = '8px';
      card.appendChild(fact);
      collected++;
      if (collected >= 3) {
        addCoins(12);
        const deepDive = makeEl('div', 'card mt-16', '');
        const title = makeEl('div', 'facts-title', '🔬 Deep-Dive Card Unlocked!');
        const body = makeEl('div', '', 'Grassland ecosystems cover about 40% of Earth\'s land surface. They support more large mammal species than any other biome and are home to the greatest wildlife migrations on the planet.');
        body.style.cssText = 'font-size:0.9rem;line-height:1.6;margin-top:12px;color:var(--muted)';
        deepDive.appendChild(title);
        deepDive.appendChild(body);
        container.appendChild(deepDive);
      }
    });
    container.appendChild(card);
  });

  const doneBtn = makeEl('button', 'btn btn-primary w-full mt-16', 'Finish Research');
  doneBtn.addEventListener('click', () => {
    const reward = collected * 2;
    addCoins(reward);
    showResult('🔬', 'Research complete!', '+' + reward + ' coins');
  });
  container.appendChild(doneBtn);

  mgState = { cleanup: () => { container.textContent = ''; el('mg-canvas').style.display = ''; } };
}

// ── 6. Ecosystem Simulator ────────────────────────────────────────────────────

function launchEcosystem() {
  el('mg-canvas').style.display = 'none';
  const container = el('mg-drag-area');
  container.style.display = 'flex';
  container.textContent = '';
  el('mg-instructions').textContent = 'Balance the ecosystem! Keep all populations between 30–70%.';

  const pops = { grass: 50, herbivore: 50, predator: 50 };
  const icons = { grass: '🌿 Grass', herbivore: '🦓 Herbivores', predator: '🦁 Predators' };

  const title = makeEl('div', 'facts-title', '🌍 Ecosystem Simulator');
  container.appendChild(title);

  const healthEl = makeEl('div', 'quiz-feedback', '');
  healthEl.id = 'eco-health';

  Object.entries(pops).forEach(([key]) => {
    const wrap = document.createElement('div');
    wrap.style.marginBottom = '14px';

    const label = makeEl('div', 'section-title', icons[key] + ': 50%');
    const bar = makeEl('div', 'hp-bar-wrap', '');
    const fill = makeEl('div', 'hp-bar', '');
    fill.style.width = '50%';
    bar.appendChild(fill);

    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = 0; slider.max = 100; slider.value = 50;
    slider.style.width = '100%';
    slider.addEventListener('input', () => {
      pops[key] = +slider.value;
      label.textContent = icons[key] + ': ' + pops[key] + '%';
      fill.style.width = pops[key] + '%';
      fill.style.background = pops[key] >= 30 && pops[key] <= 70 ? 'var(--green)' : 'var(--red)';
      const balanced = Object.values(pops).every(v => v >= 30 && v <= 70);
      healthEl.textContent = balanced ? '✅ Ecosystem is balanced!' : '⚠️ Out of balance!';
      healthEl.style.color = balanced ? 'var(--green)' : 'var(--red)';
    });

    wrap.appendChild(label);
    wrap.appendChild(slider);
    wrap.appendChild(bar);
    container.appendChild(wrap);
  });

  container.appendChild(healthEl);

  const checkBtn = makeEl('button', 'btn btn-primary w-full mt-12', 'Submit Balance');
  checkBtn.addEventListener('click', () => {
    const balanced = Object.values(pops).every(v => v >= 30 && v <= 70);
    if (balanced) { addCoins(15); showResult('🌍', t('win'), 'Ecosystem balanced! +15 coins'); }
    else { showResult('💀', 'Out of balance!', 'Keep all sliders between 30–70'); }
  });
  container.appendChild(checkBtn);

  mgState = { cleanup: () => { container.textContent = ''; el('mg-canvas').style.display = ''; } };
}
