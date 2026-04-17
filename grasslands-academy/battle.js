// Grasslands Academy — World 2 Pet Battle Engine

let battleState = null;

function buildAIPet() {
  const animal = randomAnimal();
  const rarities = ['common', 'common', 'common', 'rare', 'rare', 'special'];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  return { animalId: animal.id, rarity, stat: 10 + RARITY[rarity].mult * 5, hp: 100, maxHp: 100 };
}

function startBattle(pet) {
  const ai = buildAIPet();
  const playerHp = 100;
  const aiHp    = 100;
  battleState = {
    player: { ...pet, hp: playerHp, maxHp: playerHp },
    ai: { ...ai, hp: aiHp, maxHp: aiHp },
    turn: 'player',
    over: false
  };
  renderBattle();
}

function renderBattle() {
  if (!battleState) return;
  const { player, ai } = battleState;

  const pAnimal = ANIMALS.find(a => a.id === player.animalId);
  const aAnimal = ANIMALS.find(a => a.id === ai.animalId);

  const pArt = document.getElementById('battle-player-art');
  const aArt = document.getElementById('battle-ai-art');
  if (pArt && pAnimal) setSVG(pArt, drawAnimalSVG(pAnimal, 110, 90));
  if (aArt && aAnimal) setSVG(aArt, drawAnimalSVG(aAnimal, 110, 90));

  const setText_ = (id, txt) => { const e = el(id); if (e) e.textContent = txt; };
  setText_('battle-player-name', pAnimal ? pAnimal.name : '');
  setText_('battle-player-rarity', formatRarity(player.rarity));
  setText_('battle-ai-name', aAnimal ? aAnimal.name : '');
  setText_('battle-ai-rarity', formatRarity(ai.rarity));

  setHpBar('battle-player-hp', player.hp, player.maxHp);
  setHpBar('battle-ai-hp', ai.hp, ai.maxHp);

  const attackBtn = el('battle-attack-btn');
  if (attackBtn) attackBtn.disabled = battleState.over || battleState.turn !== 'player';
}

function setHpBar(id, hp, max) {
  const bar = el(id);
  if (!bar) return;
  const pct = Math.max(0, Math.round((hp / max) * 100));
  bar.style.width = pct + '%';
  bar.classList.toggle('low', pct < 30);
}

function playerAttack() {
  if (!battleState || battleState.over || battleState.turn !== 'player') return;
  const { player, ai } = battleState;
  const skin = STATE.equippedSkin;
  const skinMult = skin ? RARITY[skin.rarity].mult : 1;
  const dmg = Math.max(5, Math.round(player.stat * RARITY[player.rarity].mult * skinMult * (0.8 + Math.random() * 0.4) / 10));
  ai.hp = Math.max(0, ai.hp - dmg);

  animateAttack('battle-ai-art');
  showBattleMsg(`You deal ${dmg} damage!`);

  setTimeout(() => {
    if (ai.hp <= 0) { endBattle(true); return; }
    battleState.turn = 'ai';
    renderBattle();
    setTimeout(aiAttack, 800);
  }, 500);
}

function aiAttack() {
  if (!battleState || battleState.over) return;
  const { player, ai } = battleState;
  const dmg = Math.max(3, Math.round(ai.stat * RARITY[ai.rarity].mult * (0.6 + Math.random() * 0.4) / 10));
  player.hp = Math.max(0, player.hp - dmg);

  animateAttack('battle-player-art');
  showBattleMsg(`Foe deals ${dmg} damage!`);

  setTimeout(() => {
    if (player.hp <= 0) { endBattle(false); return; }
    battleState.turn = 'player';
    renderBattle();
  }, 500);
}

function animateAttack(artId) {
  const art = el(artId);
  if (!art) return;
  art.classList.remove('shake');
  void art.offsetWidth;
  art.classList.add('shake');
}

function showBattleMsg(msg) {
  setText('battle-msg', msg);
}

function endBattle(won) {
  battleState.over = true;
  if (won) {
    addCoins(10);
    showResult('🏆', t('win'), `+10 ${t('coins')}`);
  } else {
    showResult('💀', t('lose'), 'Your pet was defeated!');
  }
}

function trainPet(petIdx) {
  if (STATE.coins < 5) { showBattleMsg('Not enough coins! (need 5)'); return; }
  STATE.coins -= 5;
  STATE.pets[petIdx].stat += 1;
  save();
  updateHUD();
  renderPetRoster();
}
