import assert from 'node:assert/strict';
import test from 'node:test';
import { assignFactions, BASE_FACTIONS } from '../src/randomizer.js';

test('assigns one unique faction to each player', () => {
  const players = [
    { id: 'p1', name: 'A' },
    { id: 'p2', name: 'B' },
    { id: 'p3', name: 'C' },
  ];

  const assignments = assignFactions({ players, factions: BASE_FACTIONS, random: () => 0.4 });

  assert.equal(assignments.length, 3);
  assert.equal(new Set(assignments.map((item) => item.faction.id)).size, 3);
  assert.deepEqual(assignments.map((item) => item.player.id), ['p1', 'p2', 'p3']);
});

test('respects no-repeat choices from the previous game', () => {
  const players = [
    { id: 'p1', name: 'A' },
    { id: 'p2', name: 'B' },
  ];

  const assignments = assignFactions({
    players,
    factions: BASE_FACTIONS.slice(0, 2),
    previousByPlayer: { p1: BASE_FACTIONS[0].id, p2: BASE_FACTIONS[1].id },
    random: () => 0.1,
  });

  assert.notEqual(assignments[0].faction.id, BASE_FACTIONS[0].id);
  assert.notEqual(assignments[1].faction.id, BASE_FACTIONS[1].id);
});

test('rejects games with fewer than two players', () => {
  assert.throws(
    () => assignFactions({ players: [{ id: 'p1', name: 'A' }], factions: BASE_FACTIONS }),
    /between 2 and 4/,
  );
});
