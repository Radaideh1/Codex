import { assignFactions, BASE_FACTIONS } from './randomizer.js';

const copy = {
  ar: {
    dir: 'rtl',
    title: 'موزّع فصائل Root',
    subtitle: 'اختر اللغة، الفصائل، اللاعبين، ثم دع البرنامج يوزّع الفصائل عشوائياً بدون تكرار اختياري.',
    language: 'اللغة', setup: 'إعداد اللعبة', playerCount: 'عدد اللاعبين', factionPool: 'الفصائل التي ستلعب',
    selectAll: 'اختيار الكل', selected: 'مختارة', addFaction: 'إضافة فصيلة من توسعة', factionName: 'اسم الفصيلة',
    factionImage: 'رابط صورة اختياري', add: 'إضافة', players: 'أسماء اللاعبين', playerName: 'اسم اللاعب',
    noRepeat: 'عدم التكرار من اللعبة السابقة', previousFaction: 'ماذا لعب في القيم السابق؟', none: 'لا شيء',
    randomize: 'اختيار عشوائي', reset: 'إعادة ضبط', results: 'النتيجة', resultHint: 'اضغط اختيار عشوائي لإظهار التوزيع.',
    errorMin: 'لا يمكن أن يكون هناك لاعب واحد، والحد الأعلى أربعة لاعبين.', errorPool: 'اختر فصائل بعدد اللاعبين على الأقل.',
    errorNames: 'اكتب أسماء كل اللاعبين.', errorFactionName: 'اكتب اسم الفصيلة أولاً.',
    impossible: 'لا يوجد توزيع ممكن بسبب خيارات عدم التكرار. غيّر اختياراً واحداً وحاول مرة أخرى.',
  },
  en: {
    dir: 'ltr',
    title: 'Root Faction Randomizer',
    subtitle: 'Pick a language, factions, players, then randomly assign every player a faction with optional no-repeat rules.',
    language: 'Language', setup: 'Game setup', playerCount: 'Player count', factionPool: 'Factions in this game',
    selectAll: 'Select all', selected: 'Selected', addFaction: 'Add expansion faction', factionName: 'Faction name',
    factionImage: 'Optional image URL', add: 'Add', players: 'Player names', playerName: 'Player name',
    noRepeat: 'Avoid last game repeats', previousFaction: 'What did they play last game?', none: 'None',
    randomize: 'Randomize', reset: 'Reset', results: 'Results', resultHint: 'Press Randomize to reveal the assignments.',
    errorMin: 'There must be 2 to 4 players; one player is not allowed.', errorPool: 'Choose at least as many factions as players.',
    errorNames: 'Enter every player name.', errorFactionName: 'Enter the faction name first.',
    impossible: 'No valid assignment is possible with these no-repeat choices. Change one choice and try again.',
  },
};

const state = {
  lang: 'ar',
  factions: [...BASE_FACTIONS],
  selectedIds: BASE_FACTIONS.map((faction) => faction.id),
  playerCount: 4,
  players: [{ id: 'p1', name: '' }, { id: 'p2', name: '' }, { id: 'p3', name: '' }, { id: 'p4', name: '' }],
  avoidRepeat: false,
  previousByPlayer: {},
  assignments: [],
  error: '',
};

const app = document.getElementById('app');
const byId = (id) => state.factions.find((faction) => faction.id === id);
const activePlayers = () => state.players.slice(0, state.playerCount);
const selectedFactions = () => state.selectedIds.map(byId).filter(Boolean);
const label = (faction) => (state.lang === 'ar' ? faction.nameAr || faction.nameEn : faction.nameEn || faction.nameAr);
const detail = (faction) => (state.lang === 'ar' ? faction.detailAr || faction.detailEn : faction.detailEn || faction.detailAr);
const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));

function factionVisual(faction) {
  if (faction.imageUrl) return `<img class="faction-art" src="${escapeHtml(faction.imageUrl)}" alt="" />`;
  return `<div class="faction-emoji" style="--faction-color: ${faction.color}"><span>${faction.emoji || '⭐'}</span></div>`;
}

function render() {
  const t = copy[state.lang];
  document.documentElement.lang = state.lang;
  document.documentElement.dir = t.dir;
  app.dir = t.dir;

  app.innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">🌐 ${t.language}</p>
        <h1>${t.title}</h1>
        <p>${t.subtitle}</p>
      </div>
      <div class="language-switch" aria-label="${t.language}">
        <button data-lang="ar" class="${state.lang === 'ar' ? 'active' : ''}">عربي</button>
        <button data-lang="en" class="${state.lang === 'en' ? 'active' : ''}">English</button>
      </div>
    </section>

    <section class="panel">
      <h2>${t.setup}</h2>
      <div class="count-row">
        <span>${t.playerCount}</span>
        ${[2, 3, 4].map((count) => `<button data-count="${count}" class="pill ${state.playerCount === count ? 'active' : ''}">${count}</button>`).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="section-heading"><h2>${t.factionPool}</h2><button class="ghost" data-select-all>${t.selectAll}</button></div>
      <div class="faction-grid">
        ${state.factions.map((faction) => `
          <button class="faction-card ${state.selectedIds.includes(faction.id) ? 'selected' : ''}" data-faction="${faction.id}">
            ${factionVisual(faction)}
            <strong>${escapeHtml(label(faction))}</strong>
            <small>${escapeHtml(detail(faction))}</small>
            ${state.selectedIds.includes(faction.id) ? `<span class="badge">${t.selected}</span>` : ''}
          </button>`).join('')}
      </div>
      <form class="add-form" data-add-form>
        <h3>➕ ${t.addFaction}</h3>
        <input name="name" placeholder="${t.factionName}" />
        <input name="imageUrl" placeholder="${t.factionImage}" />
        <button type="submit">${t.add}</button>
      </form>
    </section>

    <section class="panel">
      <h2>${t.players}</h2>
      <div class="players-grid">
        ${activePlayers().map((player, index) => `
          <label><span>${t.playerName} ${index + 1}</span><input data-player="${index}" value="${escapeHtml(player.name)}" placeholder="${t.playerName} ${index + 1}" /></label>`).join('')}
      </div>
      <label class="check-row"><input type="checkbox" data-repeat ${state.avoidRepeat ? 'checked' : ''} /><span>${t.noRepeat}</span></label>
      ${state.avoidRepeat ? `<div class="repeat-grid">
        ${activePlayers().map((player, index) => `
          <label>
            <span>${escapeHtml(player.name || `${t.playerName} ${index + 1}`)}: ${t.previousFaction}</span>
            <select data-previous="${player.id}">
              <option value="">${t.none}</option>
              ${selectedFactions().map((faction) => `<option value="${faction.id}" ${state.previousByPlayer[player.id] === faction.id ? 'selected' : ''}>${escapeHtml(label(faction))}</option>`).join('')}
            </select>
          </label>`).join('')}
      </div>` : ''}
    </section>

    ${state.error ? `<div class="error" role="alert">${state.error}</div>` : ''}

    <div class="actions">
      <button class="primary" data-randomize>🔀 ${t.randomize}</button>
      <button class="secondary" data-reset>↺ ${t.reset}</button>
    </div>

    <section class="panel results-panel">
      <h2>${t.results}</h2>
      ${state.assignments.length === 0 ? `<p class="hint">${t.resultHint}</p>` : `<div class="results-grid">
        ${state.assignments.map(({ player, faction }) => `
          <article class="result-card">
            ${factionVisual(faction)}
            <div><span>${escapeHtml(player.name)}</span><strong>${escapeHtml(label(faction))}</strong><small>${escapeHtml(detail(faction))}</small></div>
          </article>`).join('')}
      </div>`}
    </section>`;
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;

  if (target.dataset.lang) state.lang = target.dataset.lang;
  if (target.dataset.count) state.playerCount = Number(target.dataset.count);
  if (target.dataset.faction) {
    state.selectedIds = state.selectedIds.includes(target.dataset.faction)
      ? state.selectedIds.filter((id) => id !== target.dataset.faction)
      : [...state.selectedIds, target.dataset.faction];
  }
  if (target.hasAttribute('data-select-all')) state.selectedIds = state.factions.map((faction) => faction.id);
  if (target.hasAttribute('data-randomize')) randomize();
  if (target.hasAttribute('data-reset')) reset();
  state.error = target.hasAttribute('data-randomize') ? state.error : '';
  render();
});

app.addEventListener('input', (event) => {
  if (event.target.dataset.player) state.players[Number(event.target.dataset.player)].name = event.target.value;
  if (event.target.dataset.previous) state.previousByPlayer[event.target.dataset.previous] = event.target.value;
  if (event.target.dataset.repeat !== undefined) state.avoidRepeat = event.target.checked;
  render();
});

app.addEventListener('submit', (event) => {
  if (!event.target.matches('[data-add-form]')) return;
  event.preventDefault();
  const form = new FormData(event.target);
  const name = String(form.get('name') || '').trim();
  const imageUrl = String(form.get('imageUrl') || '').trim();
  if (!name) {
    state.error = copy[state.lang].errorFactionName;
    render();
    return;
  }
  const faction = { id: `custom-${Date.now()}`, nameEn: name, nameAr: name, detailEn: 'Custom faction', detailAr: 'فصيلة مضافة', color: '#8b5cf6', emoji: '✨', imageUrl };
  state.factions.push(faction);
  state.selectedIds.push(faction.id);
  state.error = '';
  render();
});

function randomize() {
  const t = copy[state.lang];
  const players = activePlayers().map((player) => ({ ...player, name: player.name.trim() }));
  if (state.playerCount < 2 || state.playerCount > 4) state.error = t.errorMin;
  else if (selectedFactions().length < state.playerCount) state.error = t.errorPool;
  else if (players.some((player) => !player.name)) state.error = t.errorNames;
  else {
    try {
      state.assignments = assignFactions({ players, factions: selectedFactions(), previousByPlayer: state.avoidRepeat ? state.previousByPlayer : {} });
      state.error = '';
    } catch {
      state.error = t.impossible;
    }
  }
}

function reset() {
  state.lang = 'ar';
  state.factions = [...BASE_FACTIONS];
  state.selectedIds = BASE_FACTIONS.map((faction) => faction.id);
  state.playerCount = 4;
  state.players = [{ id: 'p1', name: '' }, { id: 'p2', name: '' }, { id: 'p3', name: '' }, { id: 'p4', name: '' }];
  state.avoidRepeat = false;
  state.previousByPlayer = {};
  state.assignments = [];
  state.error = '';
}

render();
