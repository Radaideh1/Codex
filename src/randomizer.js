export const BASE_FACTIONS = [
  {
    id: 'marquise',
    nameEn: 'Marquise de Cat',
    nameAr: 'القط البرتقالي',
    detailEn: 'Orange cats',
    detailAr: 'القط البرتقالي',
    color: '#f97316',
    emoji: '🐱',
  },
  {
    id: 'eyrie',
    nameEn: 'Eyrie Dynasties',
    nameAr: 'سلالات الطيور',
    detailEn: 'Blue birds',
    detailAr: 'الطيور الزرقاء',
    color: '#2563eb',
    emoji: '🐦',
  },
  {
    id: 'woodland',
    nameEn: 'Woodland Alliance',
    nameAr: 'تحالف الغابة',
    detailEn: 'Green alliance',
    detailAr: 'التحالف الأخضر',
    color: '#16a34a',
    emoji: '🦊',
  },
  {
    id: 'vagabond',
    nameEn: 'Vagabond',
    nameAr: 'المتجول',
    detailEn: 'Gray wanderer',
    detailAr: 'المتجول الرمادي',
    color: '#6b7280',
    emoji: '🦝',
  },
];

export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function searchAssignments(players, factions, previousByPlayer, index, used, current) {
  if (index === players.length) return current;

  const player = players[index];
  const blocked = previousByPlayer[player.id];

  for (const faction of factions) {
    if (used.has(faction.id) || blocked === faction.id) continue;
    used.add(faction.id);
    const result = searchAssignments(players, factions, previousByPlayer, index + 1, used, [
      ...current,
      { player, faction },
    ]);
    if (result) return result;
    used.delete(faction.id);
  }

  return null;
}

export function assignFactions({ players, factions, previousByPlayer = {}, random = Math.random }) {
  if (!Array.isArray(players) || players.length < 2 || players.length > 4) {
    throw new Error('Player count must be between 2 and 4.');
  }

  if (!Array.isArray(factions) || factions.length < players.length) {
    throw new Error('Faction count must be at least the player count.');
  }

  const shuffledPlayers = shuffle(players, random);
  const shuffledFactions = shuffle(factions, random);
  const assignments = searchAssignments(shuffledPlayers, shuffledFactions, previousByPlayer, 0, new Set(), []);

  if (!assignments) {
    throw new Error('No valid assignment is possible with the current no-repeat choices.');
  }

  return assignments.sort((a, b) => players.findIndex((p) => p.id === a.player.id) - players.findIndex((p) => p.id === b.player.id));
}
