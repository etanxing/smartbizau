// Grasslands Academy — Game Controller
// State management, router, economy, utility helpers

const SAVE_KEY = 'grasslandsAcademy_v1';

const DEFAULT_STATE = {
  profile: null,
  coins: 0,
  level: 0,
  worldsUnlocked: false,
  currentWorld: 1,
  lang: 'en',
  pets: [],
  skins: [],
  equippedSkin: null,
  taughtFacts: [],
  quizAnswered: [],
  bossHearts: 12,
  bossRound: 0,
  bossBeaten: false
};

let STATE = { ...DEFAULT_STATE };
let currentLang = 'en';

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(STATE));
}

function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) {
    try { STATE = { ...DEFAULT_STATE, ...JSON.parse(raw) }; } catch (_) {}
  }
  currentLang = STATE.lang || 'en';
}

function t(key) {
  return (I18N[currentLang] || I18N.en)[key] || I18N.en[key] || key;
}

function setLang(lang) {
  const code = LANG_MAP[lang.trim().toLowerCase()] || null;
  if (code && I18N[code]) {
    currentLang = code;
    STATE.lang = code;
    save();
    applyTranslations();
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
}

// ── Router ───────────────────────────────────────────────────────────────────

let _currentScreen = null;

function navigate(screenId, opts = {}) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    _currentScreen = screenId;
    updateHUD();
    applyTranslations();
    if (SCREEN_INIT[screenId]) SCREEN_INIT[screenId](opts);
  }
}

function updateHUD() {
  document.querySelectorAll('.hud-coins').forEach(el => { el.textContent = STATE.coins; });
  document.querySelectorAll('.hud-level').forEach(el => { el.textContent = STATE.level; });
  updateAvatarDisplays();
}

// setSVG safely sets an SVG element from a markup string produced by our own
// static SVG_DRAWERS — no user-supplied content is ever passed here.
function setSVG(container, svgMarkup) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, 'image/svg+xml');
  const svg = doc.documentElement;
  container.replaceChildren(svg);
}

function updateAvatarDisplays() {
  document.querySelectorAll('.avatar-display').forEach(el => {
    setSVG(el, renderAvatarSVG(STATE.equippedSkin));
  });
}

// ── Economy ──────────────────────────────────────────────────────────────────

function addCoins(n) {
  const mult = getActivePetMultiplier();
  STATE.coins += Math.round(n * mult);
  save();
  updateHUD();
}

function addLevel() {
  STATE.level = Math.min(STATE.level + 1, 10);
  if (STATE.level >= 10) STATE.worldsUnlocked = true;
  save();
  updateHUD();
}

function getActivePetMultiplier() {
  if (!STATE.pets.length) return 1;
  const best = STATE.pets.reduce((a, b) => RARITY[a.rarity].mult > RARITY[b.rarity].mult ? a : b);
  return RARITY[best.rarity].mult;
}

function rollDrop(animalId) {
  const drops = [];
  const rand = Math.random();
  let rarity;
  if (rand < RARITY.special.chance) rarity = 'special';
  else if (rand < RARITY.special.chance + RARITY.rare.chance) rarity = 'rare';
  else rarity = 'common';

  if (Math.random() < 0.5) {
    STATE.pets.push({ animalId, rarity, stat: 10 + RARITY[rarity].mult * 5 });
    drops.push({ type: 'pet', rarity, animalId });
  }
  if (Math.random() < 0.4) {
    const already = STATE.skins.find(s => s.animalId === animalId && s.rarity === rarity);
    if (!already) {
      STATE.skins.push({ animalId, rarity });
      drops.push({ type: 'skin', rarity, animalId });
    }
  }
  save();
  return drops;
}

// ── Avatar SVG renderer ───────────────────────────────────────────────────────

function renderAvatarSVG(skin) {
  const animal = skin ? ANIMALS.find(a => a.id === skin.animalId) : null;
  if (!animal) {
    return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="35" r="22" fill="#D4A54A"/>
      <circle cx="32" cy="28" r="5" fill="#C8860A"/>
      <circle cx="48" cy="28" r="5" fill="#C8860A"/>
      <circle cx="34" cy="37" r="3" fill="#333"/>
      <circle cx="46" cy="37" r="3" fill="#333"/>
      <ellipse cx="40" cy="44" rx="5" ry="3" fill="#C8860A"/>
    </svg>`;
  }
  return drawAnimalSVG(animal, 80, 80);
}

// ── Animal SVG drawing ────────────────────────────────────────────────────────

// All values interpolated here come from the ANIMALS data array
// which is defined statically in data.js — no user input is ever injected.
function drawAnimalSVG(animal, w = 120, h = 100) {
  const fn = SVG_DRAWERS[animal.svgType];
  if (!fn) {
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="#888" rx="8"/></svg>`;
  }
  return fn(animal, w, h);
}

const SVG_DRAWERS = {
  lion(a) {
    return `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="70" rx="30" ry="22" fill="${a.color}"/>
      <circle cx="60" cy="42" r="26" fill="${a.maneColor}"/>
      <circle cx="60" cy="44" r="20" fill="${a.color}"/>
      <ellipse cx="52" cy="48" rx="4" ry="5" fill="#2a1a00"/>
      <ellipse cx="68" cy="48" rx="4" ry="5" fill="#2a1a00"/>
      <ellipse cx="60" cy="54" rx="6" ry="4" fill="#D4906A"/>
      <ellipse cx="60" cy="56" rx="3" ry="2" fill="#333"/>
      <line x1="47" y1="53" x2="35" y2="50" stroke="#333" stroke-width="1.2"/>
      <line x1="47" y1="55" x2="35" y2="55" stroke="#333" stroke-width="1.2"/>
      <line x1="73" y1="53" x2="85" y2="50" stroke="#333" stroke-width="1.2"/>
      <line x1="73" y1="55" x2="85" y2="55" stroke="#333" stroke-width="1.2"/>
      <ellipse cx="44" cy="36" rx="7" ry="9" fill="${a.maneColor}"/>
      <ellipse cx="76" cy="36" rx="7" ry="9" fill="${a.maneColor}"/>
    </svg>`;
  },
  elephant(a) {
    return `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="58" cy="68" rx="38" ry="25" fill="${a.color}"/>
      <circle cx="52" cy="44" r="26" fill="${a.color}"/>
      <ellipse cx="30" cy="38" rx="10" ry="16" fill="${a.color}"/>
      <ellipse cx="74" cy="38" rx="10" ry="16" fill="${a.color}"/>
      <ellipse cx="52" cy="60" rx="8" ry="18" fill="${a.color}"/>
      <ellipse cx="42" cy="47" rx="4" ry="5" fill="#555"/>
      <ellipse cx="62" cy="47" rx="4" ry="5" fill="#555"/>
      <path d="M52 72 Q44 82 46 90 Q48 96 52 94" stroke="${a.color}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <line x1="28" y1="90" x2="28" y2="100" stroke="${a.color}" stroke-width="8" stroke-linecap="round"/>
      <line x1="44" y1="92" x2="44" y2="100" stroke="${a.color}" stroke-width="8" stroke-linecap="round"/>
      <line x1="68" y1="92" x2="68" y2="100" stroke="${a.color}" stroke-width="8" stroke-linecap="round"/>
      <line x1="84" y1="90" x2="84" y2="100" stroke="${a.color}" stroke-width="8" stroke-linecap="round"/>
      <path d="M74 38 L82 32" stroke="#ddd" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  },
  zebra(a) {
    return `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="62" cy="68" rx="34" ry="22" fill="${a.color}"/>
      <ellipse cx="62" cy="68" rx="34" ry="22" fill="none" stroke="${a.stripeColor}" stroke-width="6" stroke-dasharray="8 6"/>
      <circle cx="52" cy="44" r="22" fill="${a.color}"/>
      <line x1="42" y1="34" x2="44" y2="22" stroke="${a.stripeColor}" stroke-width="3"/>
      <line x1="52" y1="30" x2="52" y2="22" stroke="${a.stripeColor}" stroke-width="3"/>
      <line x1="62" y1="33" x2="63" y2="22" stroke="${a.stripeColor}" stroke-width="3"/>
      <ellipse cx="44" cy="50" rx="4" ry="5" fill="#111"/>
      <ellipse cx="62" cy="50" rx="4" ry="5" fill="#111"/>
      <ellipse cx="53" cy="57" rx="5" ry="3" fill="#ddd"/>
      <ellipse cx="40" cy="34" rx="5" ry="9" fill="${a.color}" stroke="${a.stripeColor}" stroke-width="2"/>
      <ellipse cx="64" cy="34" rx="5" ry="9" fill="${a.color}" stroke="${a.stripeColor}" stroke-width="2"/>
      <line x1="36" y1="90" x2="36" y2="100" stroke="${a.color}" stroke-width="7" stroke-linecap="round"/>
      <line x1="50" y1="92" x2="50" y2="100" stroke="${a.color}" stroke-width="7" stroke-linecap="round"/>
      <line x1="72" y1="92" x2="72" y2="100" stroke="${a.color}" stroke-width="7" stroke-linecap="round"/>
      <line x1="88" y1="90" x2="88" y2="100" stroke="${a.color}" stroke-width="7" stroke-linecap="round"/>
    </svg>`;
  },
  giraffe(a) {
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="52" y="10" width="16" height="55" rx="8" fill="${a.color}"/>
      <rect x="56" y="5" width="5" height="12" rx="3" fill="${a.patchColor}"/>
      <rect x="61" y="4" width="5" height="14" rx="3" fill="${a.patchColor}"/>
      <ellipse cx="60" cy="16" rx="14" ry="11" fill="${a.color}"/>
      <ellipse cx="53" cy="11" rx="3" ry="5" fill="${a.color}"/>
      <ellipse cx="67" cy="11" rx="3" ry="5" fill="${a.color}"/>
      <ellipse cx="54" cy="17" rx="3" ry="4" fill="#333"/>
      <ellipse cx="66" cy="17" rx="3" ry="4" fill="#333"/>
      <ellipse cx="60" cy="22" rx="5" ry="3.5" fill="${a.patchColor}"/>
      <ellipse cx="60" cy="72" rx="28" ry="20" fill="${a.color}"/>
      <ellipse cx="44" cy="60" rx="7" ry="9" fill="${a.patchColor}" opacity="0.7"/>
      <ellipse cx="70" cy="64" rx="7" ry="8" fill="${a.patchColor}" opacity="0.7"/>
      <ellipse cx="55" cy="74" rx="6" ry="7" fill="${a.patchColor}" opacity="0.7"/>
      <line x1="38" y1="90" x2="38" y2="115" stroke="${a.color}" stroke-width="7" stroke-linecap="round"/>
      <line x1="52" y1="92" x2="52" y2="115" stroke="${a.color}" stroke-width="7" stroke-linecap="round"/>
      <line x1="68" y1="92" x2="68" y2="115" stroke="${a.color}" stroke-width="7" stroke-linecap="round"/>
      <line x1="82" y1="90" x2="82" y2="115" stroke="${a.color}" stroke-width="7" stroke-linecap="round"/>
    </svg>`;
  },
  cheetah(a) {
    return `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="62" cy="66" rx="36" ry="20" fill="${a.color}"/>
      <circle cx="44" cy="44" r="20" fill="${a.color}"/>
      <ellipse cx="37" cy="36" rx="5" ry="8" fill="${a.color}"/>
      <ellipse cx="51" cy="36" rx="5" ry="8" fill="${a.color}"/>
      <ellipse cx="37" cy="47" rx="3.5" ry="4.5" fill="#333"/>
      <ellipse cx="51" cy="47" rx="3.5" ry="4.5" fill="#333"/>
      <ellipse cx="44" cy="54" rx="5" ry="3" fill="#D4906A"/>
      <circle cx="34" cy="47" r="3" fill="${a.spotColor}" opacity="0.7"/>
      <circle cx="52" cy="42" r="3" fill="${a.spotColor}" opacity="0.7"/>
      <circle cx="42" cy="40" r="2.5" fill="${a.spotColor}" opacity="0.7"/>
      <circle cx="68" cy="60" r="4" fill="${a.spotColor}" opacity="0.6"/>
      <circle cx="56" cy="68" r="3.5" fill="${a.spotColor}" opacity="0.6"/>
      <circle cx="80" cy="66" r="3" fill="${a.spotColor}" opacity="0.6"/>
      <line x1="36" y1="88" x2="36" y2="100" stroke="${a.color}" stroke-width="6" stroke-linecap="round"/>
      <line x1="50" y1="90" x2="50" y2="100" stroke="${a.color}" stroke-width="6" stroke-linecap="round"/>
      <line x1="72" y1="88" x2="72" y2="100" stroke="${a.color}" stroke-width="6" stroke-linecap="round"/>
      <line x1="86" y1="86" x2="86" y2="100" stroke="${a.color}" stroke-width="6" stroke-linecap="round"/>
      <path d="M96 64 Q108 56 112 64 Q108 72 100 68" fill="${a.color}"/>
    </svg>`;
  },
  rhino(a) {
    return `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="62" cy="68" rx="40" ry="24" fill="${a.color}"/>
      <ellipse cx="46" cy="52" rx="24" ry="18" fill="${a.color}"/>
      <ellipse cx="34" cy="48" rx="10" ry="8" fill="${a.color}"/>
      <ellipse cx="34" cy="40" rx="5" ry="7" fill="#B0A090"/>
      <ellipse cx="30" cy="52" rx="4" ry="5" fill="#333"/>
      <line x1="30" y1="44" x2="25" y2="36" stroke="#B8A888" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="38" cy="42" rx="4" ry="5" fill="#2a2a2a"/>
      <line x1="36" y1="90" x2="36" y2="100" stroke="${a.color}" stroke-width="10" stroke-linecap="round"/>
      <line x1="52" y1="92" x2="52" y2="100" stroke="${a.color}" stroke-width="10" stroke-linecap="round"/>
      <line x1="72" y1="92" x2="72" y2="100" stroke="${a.color}" stroke-width="10" stroke-linecap="round"/>
      <line x1="86" y1="90" x2="86" y2="100" stroke="${a.color}" stroke-width="10" stroke-linecap="round"/>
    </svg>`;
  },
  hippo(a) {
    return `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="70" rx="42" ry="24" fill="${a.color}"/>
      <ellipse cx="48" cy="54" rx="28" ry="20" fill="${a.color}"/>
      <ellipse cx="42" cy="44" rx="14" ry="10" fill="${a.color}"/>
      <ellipse cx="34" cy="46" rx="5" ry="4" fill="#333"/>
      <ellipse cx="50" cy="46" rx="5" ry="4" fill="#333"/>
      <ellipse cx="38" cy="36" rx="4" ry="6" fill="${a.color}"/>
      <ellipse cx="50" cy="36" rx="4" ry="6" fill="${a.color}"/>
      <ellipse cx="42" cy="52" rx="8" ry="5" fill="#8FA87A"/>
      <line x1="32" y1="90" x2="32" y2="100" stroke="${a.color}" stroke-width="12" stroke-linecap="round"/>
      <line x1="50" y1="92" x2="50" y2="100" stroke="${a.color}" stroke-width="12" stroke-linecap="round"/>
      <line x1="72" y1="92" x2="72" y2="100" stroke="${a.color}" stroke-width="12" stroke-linecap="round"/>
      <line x1="88" y1="90" x2="88" y2="100" stroke="${a.color}" stroke-width="12" stroke-linecap="round"/>
    </svg>`;
  },
  buffalo(a) {
    return `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="68" rx="38" ry="22" fill="${a.color}"/>
      <ellipse cx="48" cy="50" rx="24" ry="18" fill="${a.color}"/>
      <ellipse cx="40" cy="42" rx="18" ry="14" fill="${a.color}"/>
      <path d="M24 38 Q18 28 28 30 Q32 38 40 38" fill="${a.color}"/>
      <path d="M56 38 Q62 28 52 30 Q48 38 40 38" fill="${a.color}"/>
      <ellipse cx="34" cy="46" rx="4" ry="5" fill="#111"/>
      <ellipse cx="48" cy="46" rx="4" ry="5" fill="#111"/>
      <ellipse cx="40" cy="52" rx="7" ry="5" fill="#5a3a2a"/>
      <ellipse cx="40" cy="38" rx="10" ry="7" fill="#5C4A3A"/>
      <line x1="32" y1="90" x2="32" y2="100" stroke="${a.color}" stroke-width="10" stroke-linecap="round"/>
      <line x1="48" y1="92" x2="48" y2="100" stroke="${a.color}" stroke-width="10" stroke-linecap="round"/>
      <line x1="70" y1="92" x2="70" y2="100" stroke="${a.color}" stroke-width="10" stroke-linecap="round"/>
      <line x1="86" y1="90" x2="86" y2="100" stroke="${a.color}" stroke-width="10" stroke-linecap="round"/>
    </svg>`;
  },
  gazelle(a) {
    return `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="64" cy="68" rx="30" ry="18" fill="${a.color}"/>
      <rect x="54" y="36" width="12" height="36" rx="6" fill="${a.color}"/>
      <circle cx="50" cy="36" r="16" fill="${a.color}"/>
      <ellipse cx="44" cy="30" rx="4" ry="8" fill="${a.color}"/>
      <ellipse cx="56" cy="30" rx="4" ry="8" fill="${a.color}"/>
      <ellipse cx="44" cy="37" rx="3" ry="4" fill="#333"/>
      <ellipse cx="56" cy="37" rx="3" ry="4" fill="#333"/>
      <ellipse cx="50" cy="43" rx="4" ry="3" fill="#D4906A"/>
      <line x1="48" y1="24" x2="44" y2="12" stroke="${a.color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="52" y1="24" x2="55" y2="12" stroke="${a.color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="44" y1="12" x2="40" y2="8" stroke="#333" stroke-width="2"/>
      <line x1="55" y1="12" x2="59" y2="8" stroke="#333" stroke-width="2"/>
      <line x1="46" y1="88" x2="44" y2="100" stroke="${a.color}" stroke-width="5" stroke-linecap="round"/>
      <line x1="56" y1="90" x2="56" y2="100" stroke="${a.color}" stroke-width="5" stroke-linecap="round"/>
      <line x1="72" y1="88" x2="70" y2="100" stroke="${a.color}" stroke-width="5" stroke-linecap="round"/>
      <line x1="82" y1="86" x2="84" y2="100" stroke="${a.color}" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  },
  meerkat(a) {
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="85" rx="18" ry="28" fill="${a.color}"/>
      <ellipse cx="60" cy="85" rx="10" ry="22" fill="#E8D5B0"/>
      <circle cx="60" cy="52" r="18" fill="${a.color}"/>
      <ellipse cx="53" cy="47" rx="4" ry="5" fill="#333"/>
      <ellipse cx="67" cy="47" rx="4" ry="5" fill="#333"/>
      <ellipse cx="60" cy="56" rx="5" ry="3.5" fill="#D4906A"/>
      <ellipse cx="52" cy="40" rx="5" ry="7" fill="${a.color}"/>
      <ellipse cx="68" cy="40" rx="5" ry="7" fill="${a.color}"/>
      <ellipse cx="52" cy="38" rx="3" ry="5" fill="#E8D5B0"/>
      <ellipse cx="68" cy="38" rx="3" ry="5" fill="#E8D5B0"/>
      <line x1="42" y1="75" x2="34" y2="68" stroke="${a.color}" stroke-width="5" stroke-linecap="round"/>
      <line x1="78" y1="75" x2="86" y2="68" stroke="${a.color}" stroke-width="5" stroke-linecap="round"/>
      <line x1="50" y1="112" x2="48" y2="120" stroke="${a.color}" stroke-width="6" stroke-linecap="round"/>
      <line x1="70" y1="112" x2="72" y2="120" stroke="${a.color}" stroke-width="6" stroke-linecap="round"/>
    </svg>`;
  },
  wildebeest(a) {
    return `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="62" cy="68" rx="36" ry="22" fill="${a.color}"/>
      <ellipse cx="46" cy="50" rx="22" ry="16" fill="${a.color}"/>
      <ellipse cx="38" cy="42" rx="16" ry="12" fill="${a.color}"/>
      <ellipse cx="38" cy="34" rx="10" ry="8" fill="#5a5a48"/>
      <line x1="30" y1="90" x2="30" y2="100" stroke="${a.color}" stroke-width="8" stroke-linecap="round"/>
      <line x1="46" y1="92" x2="46" y2="100" stroke="${a.color}" stroke-width="8" stroke-linecap="round"/>
      <line x1="70" y1="92" x2="70" y2="100" stroke="${a.color}" stroke-width="8" stroke-linecap="round"/>
      <line x1="86" y1="90" x2="86" y2="100" stroke="${a.color}" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="30" cy="44" rx="4" ry="5" fill="#111"/>
      <ellipse cx="46" cy="44" rx="4" ry="5" fill="#111"/>
    </svg>`;
  },
  ostrich(a) {
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="52" y="30" width="10" height="45" rx="5" fill="#8B7355"/>
      <circle cx="57" cy="26" r="12" fill="${a.color}"/>
      <ellipse cx="57" cy="28" rx="5" ry="4" fill="#fff"/>
      <ellipse cx="55" cy="27" rx="3" ry="3.5" fill="#333"/>
      <circle cx="54" cy="26" r="1.5" fill="#fff"/>
      <ellipse cx="57" cy="32" rx="3" ry="2" fill="#FF8C00"/>
      <ellipse cx="60" cy="72" rx="28" ry="30" fill="${a.color}"/>
      <ellipse cx="60" cy="62" rx="20" ry="18" fill="${a.featherColor}"/>
      <ellipse cx="36" cy="75" rx="12" ry="20" fill="${a.featherColor}" opacity="0.7"/>
      <ellipse cx="84" cy="75" rx="12" ry="20" fill="${a.featherColor}" opacity="0.7"/>
      <line x1="48" y1="100" x2="44" y2="120" stroke="#8B4513" stroke-width="5" stroke-linecap="round"/>
      <line x1="68" y1="100" x2="72" y2="120" stroke="#8B4513" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  }
};

// ── Screen init registry ──────────────────────────────────────────────────────

const SCREEN_INIT = {};

function registerScreen(id, fn) {
  SCREEN_INIT[id] = fn;
}

// ── Utility helpers ───────────────────────────────────────────────────────────

function randomAnimal() {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateClassCode() {
  return 'GA-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function formatRarity(rarity) {
  const map = { common: '⭐', rare: '⭐⭐', special: '⭐⭐⭐' };
  return map[rarity] || rarity;
}

function el(id) { return document.getElementById(id); }

function setText(id, text) {
  const node = el(id);
  if (node) node.textContent = text;
}

function makeEl(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
