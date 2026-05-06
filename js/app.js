/* ============================================================
   🎮 GB SOUND ENGINE
============================================================ */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let _ctx = null;
function getCtx() {
  if (!_ctx) _ctx = new AudioCtx();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

function playGBSound(type) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square'; // GB-style pulse wave

    if (type === 'add') {
      // Rising two-note chime (capture!)
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === 'remove') {
      // Falling note (release)
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'complete') {
      // Victory fanfare — 5 ascending notes
      const notes = [523, 659, 784, 1047, 1319];
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'square';
        o.frequency.value = freq;
        const t = ctx.currentTime + i * 0.1;
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        o.start(t); o.stop(t + 0.18);
      });
    }
  } catch(e) {}
}

/* ============================================================
   🎉 CONFETTI ENGINE
============================================================ */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#ffd700','#00e89a','#c084fc','#60a5fa','#f87171','#fff'];
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 80,
    r: 4 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 6,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }));

  let frame;
  let alpha = 1;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = alpha;
    particles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.05; // gravity
      p.rot += p.rotV;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r);
      else { ctx.beginPath(); ctx.arc(0, 0, p.r/2, 0, Math.PI*2); ctx.fill(); }
      ctx.restore();
    });
    // Fade out after 2s
    if (particles.every(p => p.y > canvas.height * 0.6)) alpha -= 0.02;
    if (alpha > 0) frame = requestAnimationFrame(draw);
    else { canvas.style.display = 'none'; ctx.clearRect(0,0,canvas.width,canvas.height); alpha = 1; }
  }
  cancelAnimationFrame(frame);
  draw();
}

/* ============================================================
   STATE — DYNAMIC DATA
============================================================ */

/** Collection: key "set|number" → true if owned */
let collection = {};

/** Currently displayed set */
let currentSet = 'base';

/** Active filter: 'all' | 'owned' | 'missing' */
let currentFilter = 'all';

/** Active language: 'fr' | 'en' | 'jp' */

/** Extras sort: 'none' | 'name' | 'type' */

/** Showcase mode active */
let currentExtraSort = 'none';
let currentLang = 'fr';
let editingExtraIdx = null;
let albumMode    = false;
let readOnlyMode = false;

/** Pokémon name cache for datalist autocomplete */
const POKEMON_NAMES_KEY = 'pkm-pokedex-names-v1';
let pokemonNamesCache = null;

function normalizePokemonSlug(slug) {
  const overrides = {
    'nidoran-f': 'Nidoran♀', 'nidoran-m': 'Nidoran♂',
    'mr-mime': 'Mr. Mime', 'farfetchd': "Farfetch'd",
    'mime-jr': 'Mime Jr.', 'porygon2': 'Porygon2',
    'porygon-z': 'Porygon-Z', 'ho-oh': 'Ho-Oh',
    'type-null': 'Type: Null', 'mr-rime': 'Mr. Rime',
    'sirfetchd': "Sirfetch'd", 'jangmo-o': 'Jangmo-o',
    'hakamo-o': 'Hakamo-o', 'kommo-o': 'Kommo-o',
    'tapu-koko': 'Tapu Koko', 'tapu-lele': 'Tapu Lele',
    'tapu-bulu': 'Tapu Bulu', 'tapu-fini': 'Tapu Fini',
  };
  if (overrides[slug]) return overrides[slug];
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
}

async function loadPokemonNames() {
  if (pokemonNamesCache) return pokemonNamesCache;
  const cached = localStorage.getItem(POKEMON_NAMES_KEY);
  if (cached) { pokemonNamesCache = JSON.parse(cached); return pokemonNamesCache; }
  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
    const data = await res.json();
    pokemonNamesCache = data.results.map((p, i) => ({
      d: i + 1,
      name: normalizePokemonSlug(p.name),
    }));
    localStorage.setItem(POKEMON_NAMES_KEY, JSON.stringify(pokemonNamesCache));
  } catch { pokemonNamesCache = []; }
  return pokemonNamesCache;
}

async function updatePokemonDatalist() {
  const names = await loadPokemonNames();
  const dl = document.getElementById('pokemon-datalist');
  if (!dl || !names.length) return;
  dl.innerHTML = names.map(p => {
    const dex = String(p.d).padStart(3, '0');
    return `<option value="${dex} - ${p.name}">`;
  }).join('');
}

function onPokemonSearchInput() {
  const val = document.getElementById('extra-pokemon-search')?.value || '';
  const match = val.match(/^(\d{1,4})\s*-/);
  if (match) {
    const dexField = document.getElementById('extra-dex');
    if (dexField) dexField.value = parseInt(match[1], 10);
  }
}

/** localStorage key */
const STORAGE_KEY = 'pkm-collection-v1';


/* ============================================================
   PERSISTANCE
============================================================ */

function loadCollection() {
  try {
    collection = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    collection = {};
  }
}

function saveCollection() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  } catch (e) {
    showToast('⚠️ Impossible de sauvegarder');
  }
}


/* ============================================================
   HELPERS
============================================================ */

/** Generates the unique key for a card */
const cardKey = (setId, cardNumber) => `${setId}|${cardNumber}`;

/** Returns the card name in the current language */
/** Strips accents for accent-insensitive search */
const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const getCardName = (card) => card[currentLang];

/** Returns the secondary name (reference language) */
const getCardSubName = (card) => currentLang === 'jp' ? card.en : card.jp;

/** Returns all names of a card (for multilingual search) */
const getAllCardNames = (card) => normalize(`${card.jp} ${card.fr} ${card.en}`);

/** Counts owned cards in a set */
const countOwned = (setId) =>
  SETS[setId].cards.filter(c => collection[cardKey(setId, c.n)]).length;


/* ============================================================
   CARD RENDERING
============================================================ */

function renderSet(setId) {
  const set = SETS[setId];

  // Ordre pokecardex — les cartes sont déjà dans le bon ordre dans data.js
  const cards = set.cards;

  const html = `
    <div class="set-header">
      <span class="set-header__name">${set.name[currentLang]}</span>
      <span class="set-header__jp">${set.subtitle}</span>
    </div>
    <div class="cards-grid">
      ${cards.map(card => renderCard(setId, card)).join('')}
    </div>
  `;

  document.getElementById('cards-container').innerHTML = html;

  // Lazy-load TCGdex JP card images after render
  loadTCGdexImages(setId, cards);
}

function renderCard(setId, card) {
  const key     = cardKey(setId, card.n);
  const isOwned = !!collection[key];
  const classes = [
    'card',
    `card--${card.r}`,
    isOwned ? 'card--owned' : '',
  ].filter(Boolean).join(' ');

  // Build fallback sprite (pixel art GB or item or emoji)
  const fallbackHtml = card.d
    ? `<img
          class="card__sprite card__sprite--fallback-gb"
          src="${getSpriteUrl(card.d)}"
          alt="${card.en}"
          width="56" height="56"
       />`
    : card.item
    ? `<img
          class="card__sprite card__sprite--item card__sprite--fallback-gb"
          src="${getItemSpriteUrl(card.item)}"
          alt="${card.en}"
          width="36" height="36"
       />`
    : `<span class="card__sprite-emoji">${card.t}</span>`;

  // Skeleton + real card image zone (image loaded async via loadTCGdexImages)
  const cardImgHtml = `
    <div class="card__tcg-img-wrap">
      <div class="card__tcg-skeleton"></div>
      <img
        class="card__tcg-img"
        data-set="${setId}"
        data-num="${card.n}"
        alt="${card.en}"
        loading="lazy"
      />
      <div class="card__tcg-fallback">
        ${fallbackHtml}
      </div>
    </div>
  `;

  return `
    <div
      class="${classes}"
      data-key="${key}"
      data-names="${getAllCardNames(card).replace(/"/g, '&quot;')}"
      data-owned="${isOwned}"
      onclick="${readOnlyMode ? '' : `toggleCard('${setId}', '${card.n}')`}"
    >
      <div class="card__number">#${card.n} <span class="card__rarity-pip-inline card__rarity-pip-inline--${card.r}"></span></div>
      <div class="card__sprite-zone card__sprite-zone--tcg">
        ${cardImgHtml}
      </div>
      <div class="card__name">${getCardName(card)}</div>
      <div class="card__name-sub">${getCardSubName(card)}</div>
    </div>
  `;
}


/* ============================================================
   POKECARDEX CDN IMAGE LOADER
============================================================ */

/**
 * Charge les images depuis le CDN pokecardex pour toutes les cartes du set.
 * URL : https://pokecardex-scans.b-cdn.net/sets_jp/{cdnSet}/{img}.jpg?class=md
 * Skeleton → vraie image JP → fallback pixel art si échec.
 */
function loadTCGdexImages(setId, cards) {
  const cdnSet = SETS[setId]?.cdnSet;

  cards.forEach(card => {
    const imgEl = document.querySelector(
      `.card__tcg-img[data-set="${setId}"][data-num="${card.n}"]`
    );
    if (!imgEl) return;

    const wrap    = imgEl.closest('.card__tcg-img-wrap');
    const skeleton = wrap?.querySelector('.card__tcg-skeleton');
    const fallback = wrap?.querySelector('.card__tcg-fallback');

    if (!cdnSet || !card.img) {
      skeleton?.remove();
      imgEl.remove();
      if (fallback) fallback.classList.add('card__tcg-fallback--visible');
      return;
    }

    const url = getPokecardexUrl(cdnSet, card.img);
    imgEl.src = url;

    imgEl.onload = () => {
      skeleton?.classList.add('card__tcg-skeleton--hidden');
      imgEl.classList.add('card__tcg-img--loaded');
      if (fallback) fallback.style.display = 'none';
    };
    imgEl.onerror = () => {
      skeleton?.remove();
      imgEl.remove();
      if (fallback) fallback.classList.add('card__tcg-fallback--visible');
    };
  });
}

/* ============================================================
   INTERACTIONS CARTES
============================================================ */

function toggleCard(setId, cardNumber) {
  // Lock mode: open flip modal instead of toggling
  if (lockMode) {
    const card = SETS[setId]?.cards.find(c => c.n === cardNumber);
    if (card) openCardModal(setId, card);
    return;
  }
  const key = cardKey(setId, cardNumber);
  collection[key] = !collection[key];
  saveCollection();

  // DOM update without full re-render
  const el = document.querySelector(`[data-key="${key}"]`);
  if (el) {
    const isOwned = collection[key];
    el.classList.toggle('card--owned', isOwned);
    el.dataset.owned = isOwned;

    // Click animation
    el.classList.add(isOwned ? 'card--flash-add' : 'card--flash-remove');
    setTimeout(() => el.classList.remove('card--flash-add', 'card--flash-remove'), 400);
  }

  // GB Sound
  playGBSound(collection[key] ? 'add' : 'remove');

  updateStats();
  updateTabCounters();
  applyFilters();
  showToast(collection[key] ? '✓ Carte ajoutée !' : '✗ Carte retirée');

  // 🎉 Set completion check
  if (collection[key] && currentSet !== 'extras') {
    const setCards = SETS[currentSet].cards;
    const owned    = countOwned(currentSet);
    if (owned === setCards.length) {
      playGBSound('complete');
      launchConfetti();
      showToast(`🏆 SET COMPLET ! ${SETS[currentSet].name[currentLang] || SETS[currentSet].name.fr} 🏆`, 'victory');
    }
  }
}


/* ============================================================
   STATS
============================================================ */

function updateStats() {
  // Current set stats (progress bar)
  let setTotal, setOwned;
  if (currentSet === 'extras') {
    const ex = loadExtras();
    setTotal = ex.length;
    setOwned = setTotal;
  } else {
    const setCards = SETS[currentSet].cards;
    setTotal       = setCards.length;
    setOwned       = countOwned(currentSet);
  }
  const setPct = setTotal ? Math.round(setOwned / setTotal * 100) : 0;
  document.getElementById('progress-text').textContent = `${setOwned} / ${setTotal}`;
  document.getElementById('progress-pct').textContent  = `${setPct}%`;
  document.getElementById('progress-fill').style.width = `${setPct}%`;

  // Global stats (header)
  let globalTotal = 0;
  let globalOwned = 0;
  Object.keys(SETS).forEach(setId => {
    globalTotal += SETS[setId].cards.length;
    globalOwned += countOwned(setId);
  });
  const extrasArr = loadExtras();
  globalTotal += extrasArr.length;
  globalOwned += extrasArr.length;
  const globalPct = globalTotal ? Math.round(globalOwned / globalTotal * 100) : 0;

  document.getElementById('stat-owned').textContent = globalOwned;
  document.getElementById('stat-total').textContent = globalTotal;
  document.getElementById('stat-pct').textContent   = `${globalPct}%`;
}


/* ============================================================
   TAB COUNTERS & PROGRESS INDICATORS
============================================================ */

function updateTabCounters() {
  Object.keys(SETS).forEach(setId => {
    const tab = document.querySelector(`.set-nav__tab[data-set="${setId}"]`);
    if (!tab) return;
    const total = SETS[setId].cards.length;
    const owned = countOwned(setId);
    const pct   = Math.round(owned / total * 100);

    // Update or create counter span
    let counter = tab.querySelector('.set-nav__counter');
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'set-nav__counter';
      tab.appendChild(counter);
    }
    counter.textContent = `${owned}/${total}`;


  });

  // Extras tab counter
  const extrasTab = document.querySelector('.set-nav__tab[data-set="extras"]');
  if (extrasTab) {
    const ex = loadExtras();
    let counter = extrasTab.querySelector('.set-nav__counter');
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'set-nav__counter';
      extrasTab.appendChild(counter);
    }
    counter.textContent = ex.length > 0 ? `${ex.length}` : '';
  }
}


/* ============================================================
   FILTRES & RECHERCHE
============================================================ */

function applyFilters() {
  const query = normalize(document.getElementById('search-input').value.trim());

  document.querySelectorAll('.card').forEach(el => {
    const matchesSearch = !query || el.dataset.names?.includes(query);
    // In album mode, all slots are always visible (filter only applied to search)
    const matchesFilter =
      albumMode            ||
      currentFilter === 'all'    ||
      (currentFilter === 'owned'   && el.dataset.owned === 'true') ||
      (currentFilter === 'missing' && el.dataset.owned === 'false');

    el.classList.toggle('hidden', !(matchesSearch && matchesFilter));
  });
}

function toggleClearBtn() {
  const val = document.getElementById('search-input').value;
  document.getElementById('search-clear').style.display = val ? 'block' : 'none';
}

function clearSearch() {
  document.getElementById('search-input').value = '';
  document.getElementById('search-clear').style.display = 'none';
  applyFilters();
}

function setFilter(filter) {
  currentFilter = filter;
  updateFilterButtons();
  applyFilters();
}


/* ============================================================
   SET NAVIGATION
============================================================ */

function selectSet(setId) {
  currentSet = setId;

  // Update tabs
  document.querySelectorAll('.set-nav__tab').forEach(tab => {
    tab.classList.toggle('set-nav__tab--active', tab.dataset.set === setId);
  });

  // Exit album mode on tab change and reset filter
  if (albumMode) {
    albumMode = false;
    document.getElementById('btn-album-toggle')?.classList.remove('active');
    document.getElementById('cards-container')?.classList.remove('album-mode');
  }
  currentFilter = 'all';
  updateFilterButtons();

  // Album/lock FABs only make sense on card sets
  const isCardSet = !['extras', 'stats'].includes(setId);
  document.getElementById('btn-album-toggle').style.display = isCardSet ? '' : 'none';

  if (setId === 'extras') {
    renderExtras();
  } else if (setId === 'stats') {
    editingExtraIdx = null;
    renderStats();
  } else {
    editingExtraIdx = null;
    renderSet(setId);
  }
  updateStats();
  updateTabCounters();
  applyFilters();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ============================================================
   LANGUE
============================================================ */

function setLanguage(lang) {
  currentLang = lang;

  // Update language buttons
  document.querySelectorAll('.lang-switch__btn').forEach(btn => {
    btn.classList.toggle('lang-switch__btn--active', btn.dataset.lang === lang);
  });

  // Update UI labels
  const labels = UI_LABELS[lang];
  document.getElementById('stat-owned-lbl').textContent  = labels.owned;
  document.getElementById('stat-total-lbl').textContent  = labels.total;
  document.getElementById('stat-pct-lbl').textContent    = labels.complete;
  document.getElementById('filter-all').textContent      = labels.all;
  document.getElementById('filter-owned').textContent    = labels.yes;
  document.getElementById('filter-missing').textContent  = labels.no;
  document.getElementById('search-input').placeholder    = labels.search;

  // Header title
  document.getElementById('header-subtitle').textContent = labels.subtitle;

  // Toolbar buttons
  document.getElementById('btn-export').textContent = labels.export;
  document.getElementById('btn-import').textContent = labels.import;
  document.getElementById('btn-reset').textContent  = labels.reset;
  const shareEl = document.getElementById('btn-share');
  if (shareEl) shareEl.textContent = labels.share;
  document.getElementById('btn-album').textContent  = labels.albumMode;
  document.getElementById('btn-lock').textContent   = lockMode ? labels.unlock : labels.lock;

  // Set tab names
  Object.keys(SETS).forEach(setId => {
    const el = document.getElementById(`tab-${setId}`);
    if (el) el.textContent = SETS[setId].name[lang];
  });
  const extrasTabEl = document.getElementById('tab-extras');
  if (extrasTabEl) extrasTabEl.textContent = labels.extrasTab;
  const statsTabEl = document.getElementById('tab-stats');
  if (statsTabEl) statsTabEl.textContent = labels.statsTab;

  // Update card names without full re-render
  document.querySelectorAll('.card').forEach(el => {
    const [setId, cardNum] = el.dataset.key.split('|');
    const card = SETS[setId]?.cards.find(c => c.n === cardNum);
    if (!card) return;
    el.querySelector('.card__name').textContent     = getCardName(card);
    el.querySelector('.card__name-sub').textContent = getCardSubName(card);
  });

  // Re-render extras tab if active (labels are embedded in the HTML)
  if (currentSet === 'extras') renderExtras();

  applyFilters();
}


/* ============================================================
   SHARE — URL-based read-only collection view
============================================================ */

function shareCollection() {
  const labels = UI_LABELS[currentLang];
  const ownedKeys = Object.keys(collection).filter(k => collection[k]);
  if (!ownedKeys.length) { showToast(labels.noCards); return; }

  const payload = {
    v:  2,
    c:  ownedKeys,
    e:  loadExtras(),
  };
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const url     = `${location.origin}${location.pathname}?share=${encoded}`;
    navigator.clipboard.writeText(url)
      .then(() => showToast(labels.shareSuccess))
      .catch(() => {
        // Fallback: show URL in a prompt
        prompt(labels.shareSuccess, url);
      });
  } catch {
    showToast('⚠️ Impossible de générer le lien');
  }
}

function initShareMode() {
  const param = new URLSearchParams(location.search).get('share');
  if (!param) return;

  try {
    const payload = JSON.parse(decodeURIComponent(escape(atob(param))));
    if (!payload?.c) return;

    // Override collection with shared data (in-memory only)
    collection = {};
    payload.c.forEach(k => { collection[k] = true; });
    readOnlyMode = true;

    // Save extras temporarily (not to localStorage)
    if (Array.isArray(payload.e)) saveExtras(payload.e);

    // Show banner
    const banner = document.getElementById('share-banner');
    const text   = document.getElementById('share-banner-text');
    if (banner) { banner.style.display = ''; }
    if (text)   { text.textContent = UI_LABELS[currentLang].shareView; }

    // Hide settings menu (no edit in read-only)
    document.getElementById('settings-menu')?.style.setProperty('display', 'none');
    // Hide lock FAB
    document.getElementById('btn-lock-toggle')?.style.setProperty('display', 'none');

  } catch {
    showToast('⚠️ Lien de partage invalide');
  }
}

function exitShareMode() {
  // Reload without ?share= param — restores own localStorage collection
  location.href = location.origin + location.pathname;
}

/* ============================================================
   EXPORT / IMPORT / RESET
============================================================ */

function exportCollection() {
  const labels    = UI_LABELS[currentLang];
  const ownedKeys = Object.keys(collection).filter(k => collection[k]);

  if (ownedKeys.length === 0) {
    showToast(labels.noCards);
    return;
  }

  const exportData = {
    version:    2,
    date:       new Date().toISOString().slice(0, 10),
    collection: collection,
    extras:     loadExtras(),
  };
  const json = JSON.stringify(exportData, null, 2);
  const uri  = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
  const link = document.createElement('a');
  link.href     = uri;
  link.download = `pokemon-collection-${exportData.date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(`💾 ${ownedKeys.length} ${labels.imported}`);
}

function importCollection(event) {
  const labels = UI_LABELS[currentLang];
  const file   = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const parsed   = JSON.parse(e.target.result);
      const imported = (parsed?.collection && typeof parsed.collection === 'object')
        ? parsed.collection
        : parsed;

      if (typeof imported !== 'object' || Array.isArray(imported)) {
        throw new Error('Format invalide');
      }

      const count = Object.keys(imported).filter(k => imported[k]).length;
      Object.assign(collection, imported);
      if (Array.isArray(parsed.extras)) saveExtras(parsed.extras);
      saveCollection();
      selectSet(currentSet);
      showToast(`📂 ${count} ${labels.imported}`);

    } catch {
      showToast('❌ Fichier invalide');
    }

    event.target.value = '';
  };

  reader.onerror = () => showToast('❌ Impossible de lire le fichier');
  reader.readAsText(file);
}

function confirmReset() {
  const labels     = UI_LABELS[currentLang];
  const ownedCount = Object.keys(collection).filter(k => collection[k]).length;

  if (ownedCount === 0) {
    showToast(labels.alreadyEmpty);
    return;
  }

  const modal = createModal({
    title:   `⚠️ ${labels.resetTitle} ${ownedCount} ${labels.resetCards}`,
    hint:    labels.resetHint,
    danger:  true,
    actions: `
      <button class="modal__btn modal__btn--danger" onclick="resetCollection()">${labels.resetYes}</button>
      <button class="modal__btn modal__btn--cancel" onclick="closeModal()">${labels.resetNo}</button>
    `,
  });

  document.body.appendChild(modal);
}

function resetCollection() {
  const labels = UI_LABELS[currentLang];
  collection = {};
  saveCollection();
  saveExtras([]);
  closeModal();
  selectSet(currentSet);
  showToast(labels.resetDone);
}

/* ============================================================
   UI HELPERS — MODAL & TOAST
============================================================ */

/**
 * Creates an overlay modal.
 * @param {{ title, hint, content, actions, danger }} options
 */
function createModal({ title, hint = '', content = '', actions, danger = false }) {
  closeModal(); // close any already-open modal

  const overlay = document.createElement('div');
  overlay.className  = 'modal-overlay';
  overlay.id         = 'modal-overlay';

  // Click outside = close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  overlay.innerHTML = `
    <div class="modal ${danger ? 'modal--danger' : ''}">
      <div class="modal__title">${title}</div>
      ${hint ? `<div class="modal__hint">${hint}</div>` : ''}
      ${content}
      <div class="modal__actions">${actions}</div>
    </div>
  `;

  return overlay;
}

function closeModal() {
  document.getElementById('modal-overlay')?.remove();
}

/** Shows a temporary toast notification */
let toastTimer = null;

function showToast(message, type = 'normal') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('toast--visible');
  toast.classList.toggle('toast--victory', type === 'victory');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast--visible', 'toast--victory');
  }, type === 'victory' ? 4000 : 2500);
}


/* ============================================================
   ALBUM MODE
============================================================ */

function toggleAlbum() {
  if (currentSet === 'extras' || currentSet === 'stats') return;
  albumMode = !albumMode;

  const btn       = document.getElementById('btn-album-toggle');
  const container = document.getElementById('cards-container');

  btn.classList.toggle('active', albumMode);

  if (albumMode) {
    container.classList.add('album-mode');
    // Force "all" filter so every slot is visible
    currentFilter = 'all';
    updateFilterButtons();
    applyFilters();
    showToast('📖 Mode Album activé');
  } else {
    container.classList.remove('album-mode');
    showToast('📖 Mode Album désactivé');
  }
}

function updateFilterButtons() {
  ['all', 'owned', 'missing'].forEach(f => {
    document.getElementById(`filter-${f}`)
      ?.classList.toggle('filter-bar__btn--active', f === currentFilter);
  });
}



/* ============================================================
   LOCK MODE
============================================================ */

let lockMode = true; // locked by default

function toggleLock() {
  lockMode = !lockMode;
  updateLockUI();
  document.body.classList.toggle('lock-mode', lockMode);
  showToast(lockMode ? '🔒 Collection verrouillée' : '🔓 Collection déverrouillée');
}

function updateLockUI() {
  const btn     = document.getElementById('btn-lock-toggle');
  const iconEl  = document.getElementById('btn-lock-icon');
  const labelEl = document.getElementById('btn-lock');

  btn.classList.toggle('active', lockMode);
  if (iconEl)  iconEl.textContent  = lockMode ? '🔒' : '🔓';
  // Short label: always 4 chars max for the compact button
  if (labelEl) labelEl.textContent = lockMode ? 'LOCK' : 'EDIT';
}

/* Settings dropdown */
function toggleSettingsMenu() {
  document.getElementById('settings-dropdown').classList.toggle('settings-menu__dropdown--open');
}

function closeSettingsMenu() {
  document.getElementById('settings-dropdown').classList.remove('settings-menu__dropdown--open');
}

// Close dropdown on outside click
document.addEventListener('click', e => {
  const menu = document.getElementById('settings-menu');
  if (menu && !menu.contains(e.target)) closeSettingsMenu();
});

/* ============================================================
   CARD FLIP MODAL
============================================================ */

let _pokeDescCache = {};

async function openCardModal(setId, card) {
  const modal = document.getElementById('card-modal');
  const flip  = document.getElementById('card-modal-flip');
  const img   = document.getElementById('card-modal-img');
  const loader = document.getElementById('card-modal-img-loader');
  const info  = document.getElementById('card-modal-info');

  // Reset flip to back
  flip.classList.remove('card-modal__flip--flipped');
  img.src = '';
  loader.style.display = 'block';
  info.innerHTML = '';

  // Show modal
  modal.classList.add('card-modal--visible');

  // Image JP pokecardex CDN — haute résolution (class=lg)
  const cdnSet = SETS[setId]?.cdnSet;
  const jpImgUrl = cdnSet && card.img
    ? `https://pokecardex-scans.b-cdn.net/sets_jp/${cdnSet}/${card.img}.jpg?class=lg`
    : null;

  if (jpImgUrl) {
    img.src = jpImgUrl;
    img.onload  = () => { loader.style.display = 'none'; };
    img.onerror = () => { loader.textContent = '🃏'; };
  } else {
    loader.textContent = '🃏';
  }
  setTimeout(() => flip.classList.add('card-modal__flip--flipped'), 200);

  // Build info panel immediately
  const rarityLabels = { common: 'Commune', uncommon: 'Peu commune', rare: 'Rare', holo: 'Holo Rare' };
  const setNames = { base: 'Set de Base (1996)', jungle: 'Jungle (1997)', fossil: 'Fossile (1997)', rocket: 'Rocket (1997)', gym1: "Leaders' Stadium (1998)", gym2: 'Challenge from the Darkness (1999)', vmblue: 'Vending Machine Blue (1998)', vmred: 'Vending Machine Red (1998)', vmgreen: 'Vending Machine Green (1998)', neo4: 'Neo Destiny (2001)', promo: 'Unnumbered Promotional (1996–)' };
  const isOwned  = !!collection[cardKey(setId, card.n)];
  const tcgQuery = encodeURIComponent(`${card.en} ${setNames[setId] || ''}`);
  const tcgUrl   = `https://www.tcgplayer.com/search/pokemon/product?q=${tcgQuery}&view=grid`;

  let descHtml = '';
  if (card.d) {
    descHtml = `<div class="card-modal__desc" id="modal-desc">⏳ Chargement de la description...</div>`;
    // Fetch description async
    fetchPokeDesc(card.d).then(desc => {
      const el = document.getElementById('modal-desc');
      if (el) el.textContent = desc;
    });
  }

  info.innerHTML = `
    <div class="card-modal__info-row">
      <span class="card-modal__info-label">Carte</span>
      <span class="card-modal__info-value">${card.fr || card.en} <span style="color:var(--muted)">#${card.n}</span></span>
    </div>
    <div class="card-modal__info-row">
      <span class="card-modal__info-label">Set</span>
      <span class="card-modal__info-value">${setNames[setId] || setId}</span>
    </div>
    <div class="card-modal__info-row">
      <span class="card-modal__info-label">Rareté</span>
      <span class="card-modal__info-value card-modal__info-value--gold">${rarityLabels[card.r] || card.r}</span>
    </div>
    <div class="card-modal__info-row">
      <span class="card-modal__info-label">Statut</span>
      <span class="card-modal__info-value ${isOwned ? 'card-modal__info-value--green' : ''}">${isOwned ? '✓ Possédée' : '✗ Manquante'}</span>
    </div>
    <div class="card-modal__info-row">
      <span class="card-modal__info-label">Prix</span>
      <span class="card-modal__info-value">
        <a class="card-modal__tcgplayer" href="${tcgUrl}" target="_blank" rel="noopener">Voir sur TCGPlayer →</a>
      </span>
    </div>
    ${descHtml}
  `;
}

let _tcgImgCache   = {};  // card image URLs
let _tcgSetCache   = {};  // full set card lists from API

async function fetchTCGdexImage(setId, card) {
  const cacheKey = `${setId}-${card.n}`;
  if (_tcgImgCache[cacheKey] !== undefined) return _tcgImgCache[cacheKey];

  const tcgSetId = TCGDEX_SET[setId];
  if (!tcgSetId) { _tcgImgCache[cacheKey] = null; return null; }

  try {
    // Fetch the full set once and cache it (endpoint returns {cards:[{id,image,localId,name}]})
    if (!_tcgSetCache[tcgSetId]) {
      const res  = await fetch(`https://api.tcgdex.net/v2/en/sets/${tcgSetId}`);
      const data = await res.json();
      _tcgSetCache[tcgSetId] = data.cards || [];
    }

    const setCards = _tcgSetCache[tcgSetId];

    // Find by exact EN name match
    const norm = s => s?.toLowerCase().replace(/[^a-z0-9]/g, '');
    const match = setCards.find(c => norm(c.name) === norm(card.en));

    if (match?.image) {
      const url = `${match.image}/high.webp`;
      _tcgImgCache[cacheKey] = url;
      return url;
    }

    _tcgImgCache[cacheKey] = null;
    return null;

  } catch(e) {
    _tcgImgCache[cacheKey] = null;
    return null;
  }
}

async function fetchPokeDesc(dexId) {
  if (_pokeDescCache[dexId]) return _pokeDescCache[dexId];
  try {
    const res  = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${dexId}/`);
    const data = await res.json();
    const entry = data.flavor_text_entries?.find(e => e.language.name === 'fr')
               || data.flavor_text_entries?.find(e => e.language.name === 'en');
    const desc = entry?.flavor_text.replace(/\f|\n/g, ' ') || '—';
    _pokeDescCache[dexId] = desc;
    return desc;
  } catch { return '—'; }
}

function closeCardModal() {
  const modal = document.getElementById('card-modal');
  modal.classList.remove('card-modal--visible');
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCardModal();
});

/* ============================================================
   INITIALISATION
============================================================ */

loadCollection();
initShareMode();
selectSet('base');
updateTabCounters();

// Apply default lock mode on startup
document.body.classList.add('lock-mode');
updateLockUI();

// Load Poké Ball sprite as favicon via canvas (bypasses external URL restriction)
(function() {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    const canvas  = document.createElement('canvas');
    canvas.width  = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, 32, 32);
    document.getElementById('favicon').href = canvas.toDataURL('image/png');
  };
  img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
})();


/* ============================================================
   EXTRAS — CUSTOM CARDS
============================================================ */

const EXTRAS_KEY = 'pkm-extras-v1';

/** Load extras from localStorage */
function loadExtras() {
  try {
    return JSON.parse(localStorage.getItem(EXTRAS_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Save extras to localStorage */
function saveExtras(list) {
  try {
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(list));
  } catch {
    showToast('⚠️ Impossible de sauvegarder');
  }
}

/* ============================================================
   STATS TAB
============================================================ */

function renderStats() {
  const labels = UI_LABELS[currentLang];

  // Per-set breakdown
  const setRows = Object.keys(SETS).map(setId => {
    const set     = SETS[setId];
    const total   = set.cards.length;
    const owned   = countOwned(setId);
    const pct     = total ? Math.round(owned / total * 100) : 0;
    const color   = { base: '#e53935', jungle: '#43a047', fossil: '#c89020', rocket: '#7986cb', gym1: '#8bc34a', gym2: '#5c6bc0', vmblue: '#1e88e5', vmred: '#e53935', vmgreen: '#43a047', neo4: '#7b1fa2', promo: '#f9a825' }[setId] || '#ff9800';
    return `
      <div class="stats-row">
        <div class="stats-row__label"><span class="stats-row__dot" style="background:${color}"></span>${set.name[currentLang]}</div>
        <div class="stats-row__count">${owned}<span class="stats-row__sep">/</span>${total}</div>
        <div class="stats-row__bar"><div class="stats-row__fill" style="width:${pct}%;background:${color}"></div></div>
        <div class="stats-row__pct">${pct}%</div>
      </div>`;
  }).join('');

  // Per-rarity breakdown (all sets combined)
  const rarityTotals = { holo: [0,0], rare: [0,0], uncommon: [0,0], common: [0,0] };
  Object.keys(SETS).forEach(setId => {
    SETS[setId].cards.forEach(c => {
      if (rarityTotals[c.r]) {
        rarityTotals[c.r][1]++;
        if (collection[cardKey(setId, c.n)]) rarityTotals[c.r][0]++;
      }
    });
  });
  const rarityColors = { holo: '#ffd700', rare: '#a78bfa', uncommon: '#60a5fa', common: '#9ca3af' };
  const rarityLabels = RARITY_LABELS[currentLang];
  const rarityRows = Object.entries(rarityTotals).map(([r, [owned, total]]) => {
    const pct = total ? Math.round(owned / total * 100) : 0;
    return `
      <div class="stats-row">
        <div class="stats-row__label">${rarityLabels[r]}</div>
        <div class="stats-row__count">${owned}<span class="stats-row__sep">/</span>${total}</div>
        <div class="stats-row__bar"><div class="stats-row__fill" style="width:${pct}%;background:${rarityColors[r]}"></div></div>
        <div class="stats-row__pct">${pct}%</div>
      </div>`;
  }).join('');

  // Global numbers
  let globalTotal = 0, globalOwned = 0;
  Object.keys(SETS).forEach(s => { globalTotal += SETS[s].cards.length; globalOwned += countOwned(s); });
  const extrasArr = loadExtras();
  globalTotal += extrasArr.length; globalOwned += extrasArr.length;
  const globalPct = globalTotal ? Math.round(globalOwned / globalTotal * 100) : 0;

  document.getElementById('cards-container').innerHTML = `
    <div class="set-header">
      <span class="set-header__name">${labels.statsTab}</span>
      <span class="set-header__jp">統計</span>
    </div>
    <div class="stats-page">
      <div class="stats-global">
        <div class="stats-global__numbers">${globalOwned} <span class="stats-global__sep">/</span> ${globalTotal}</div>
        <div class="stats-global__pct">${globalPct}%</div>
        <div class="stats-global__bar"><div class="stats-global__fill" style="width:${globalPct}%"></div></div>
        <div class="stats-global__label">${labels.statsGlobal}</div>
      </div>
      <div class="stats-section">
        <div class="stats-section__title">${labels.statsPerSet}</div>
        ${setRows}
      </div>
      <div class="stats-section">
        <div class="stats-section__title">${labels.statsPerRarity}</div>
        ${rarityRows}
      </div>
    </div>
  `;
}


/** Render the EXTRAS tab */
function renderExtras() {
  const labels = UI_LABELS[currentLang];
  const extras = loadExtras();
  const editCard = editingExtraIdx !== null ? extras[editingExtraIdx] : null;

  const typeOptions = EXTRA_TYPES[currentLang].map(t =>
    `<option value="${t.emoji}" ${editCard && editCard.t === t.emoji ? 'selected' : ''}>${t.emoji} ${t.label}</option>`
  ).join('');

  // Apply sort
  let displayExtras = [...extras];
  if (currentExtraSort === 'name') {
    displayExtras.sort((a, b) => normalize(a.name).localeCompare(normalize(b.name)));
  } else if (currentExtraSort === 'type') {
    displayExtras.sort((a, b) => a.type.localeCompare(b.type));
  }

  // Sort buttons
  const sortBtns = extras.length > 1 ? `
    <div class="extras-sort">
      <button class="extras-sort__btn ${currentExtraSort === 'none' ? 'extras-sort__btn--active' : ''}" onclick="setExtraSort('none')">${labels.sortDefault || 'DÉFAUT'}</button>
      <button class="extras-sort__btn ${currentExtraSort === 'name' ? 'extras-sort__btn--active' : ''}" onclick="setExtraSort('name')">${labels.sortName || 'NOM'}</button>
      <button class="extras-sort__btn ${currentExtraSort === 'type' ? 'extras-sort__btn--active' : ''}" onclick="setExtraSort('type')">${labels.sortType || 'TYPE'}</button>
    </div>` : '';

  const cardsHtml = extras.length === 0
    ? `<div class="extras-empty">${labels.extrasEmpty}</div>`
    : `${sortBtns}<div class="cards-grid">
        ${displayExtras.map((card) => {
          const idx = extras.indexOf(card);
          return renderExtraCard(card, idx);
        }).join('')}
       </div>`;

  const isEditing = editingExtraIdx !== null;
  const editBanner = isEditing
    ? `<div class="extras-form__edit-banner">✎ ${labels.extrasEditing} — EXTRA #${String(editingExtraIdx + 1).padStart(3, '0')}</div>`
    : '';

  document.getElementById('cards-container').innerHTML = `
    <datalist id="pokemon-datalist"></datalist>
    <div class="set-header">
      <span class="set-header__name">${labels.extrasTab}</span>
      <span class="set-header__jp">カスタム</span>
    </div>
    <div class="extras-form${isEditing ? ' extras-form--editing' : ''}">
      ${editBanner}
      <input
        type="text"
        id="extra-name"
        class="extras-form__input"
        placeholder="${labels.extrasName}"
        maxlength="40"
        value="${editCard ? editCard.name.replace(/"/g, '&quot;') : ''}"
      />
      <select id="extra-type" class="extras-form__select">
        ${typeOptions}
      </select>
      <input
        type="text"
        id="extra-pokemon-search"
        class="extras-form__input"
        placeholder="${labels.extrasPokemonSearch}"
        list="pokemon-datalist"
        oninput="onPokemonSearchInput()"
        autocomplete="off"
      />
      <input
        type="number"
        id="extra-dex"
        class="extras-form__input"
        placeholder="${labels.extrasDex}"
        min="1" max="1025"
        value="${editCard && editCard.d ? editCard.d : ''}"
      />
      <button class="extras-form__btn${isEditing ? ' extras-form__btn--save' : ''}" onclick="addExtraCard()">
        ${isEditing ? `✎ ${labels.extrasSave}` : `✚ ${labels.extrasAdd}`}
      </button>
      ${isEditing ? `<button class="extras-form__btn extras-form__btn--cancel" onclick="cancelEditExtra()">✕ ${labels.extrasCancel}</button>` : ''}
    </div>
    ${cardsHtml}
  `;

  updatePokemonDatalist();
}

function setExtraSort(sort) {
  currentExtraSort = sort;
  renderExtras();
}

/** Render a single extra card */
function renderExtraCard(card, idx) {
  const spriteHtml = card.d
    ? `<img
          class="card__sprite"
          src="${getSpriteUrl(card.d)}"
          alt="${card.name}"
          loading="lazy"
          width="68" height="68"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
       /><span class="card__sprite-fallback" style="display:none">${card.t}</span>`
    : `<span class="card__sprite-fallback">${card.t}</span>`;

  const isBeingEdited = editingExtraIdx === idx;
  return `
    <div class="card card--owned card--extra${isBeingEdited ? ' card--extra-editing' : ''}">
      <div class="card__number">EXTRA #${String(idx + 1).padStart(3, '0')}</div>
      <div class="card__sprite-zone">${spriteHtml}</div>
      <div class="card__name">${card.name}</div>
      <div class="card__name-sub">${card.t}</div>
      <div class="card__footer">
        <div class="card__rarity-pip"></div>
        <span class="card__type">${card.t}</span>
      </div>
      <button class="card__edit-btn" onclick="startEditExtra(${idx})" title="${UI_LABELS[currentLang].extrasEdit}">✎</button>
      <button class="card__delete-btn" onclick="deleteExtraCard(${idx})" title="${UI_LABELS[currentLang].extrasDelete}">✕</button>
    </div>
  `;
}

/** Add a new extra card (or save edit if in edit mode) */
function addExtraCard() {
  const name = document.getElementById('extra-name').value.trim();
  const type = document.getElementById('extra-type').value;
  const dex  = parseInt(document.getElementById('extra-dex').value) || null;

  if (!name) {
    showToast('⚠️ ' + UI_LABELS[currentLang].extrasName + ' ?');
    return;
  }

  const list = loadExtras();

  if (editingExtraIdx !== null) {
    list[editingExtraIdx] = { name, t: type, d: dex };
    editingExtraIdx = null;
    saveExtras(list);
    renderExtras();
    updateStats();
    showToast('✎ ' + name);
  } else {
    list.push({ name, t: type, d: dex });
    saveExtras(list);
    renderExtras();
    updateStats();
    showToast('✚ ' + name);
  }
}

/** Start editing an extra card — pre-fills form */
function startEditExtra(idx) {
  editingExtraIdx = idx;
  renderExtras();
  document.getElementById('cards-container').scrollTop = 0;
  document.getElementById('extra-name')?.focus();
}

/** Cancel edit mode without saving */
function cancelEditExtra() {
  editingExtraIdx = null;
  renderExtras();
}

/** Delete an extra card by index */
function deleteExtraCard(idx) {
  if (editingExtraIdx === idx) { editingExtraIdx = null; }
  const list    = loadExtras();
  const removed = list.splice(idx, 1);
  saveExtras(list);
  renderExtras();
  updateStats();
  if (removed.length) showToast('✕ ' + removed[0].name);
}
