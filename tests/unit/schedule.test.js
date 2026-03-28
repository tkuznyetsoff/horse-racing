import { ROUND_DISTANCES, HORSES_PER_ROUND } from '@/constants/rounds';
import scheduleModule from '@/store/modules/schedule';

const { getters, mutations, actions } = scheduleModule;

describe('schedule store module', () => {
  describe('mutations', () => {
    test('SET_SCHEDULE sets rounds', () => {
      const state = { rounds: [] };
      const rounds = [{ roundIndex: 0, distance: 1200, horses: [] }];
      mutations.SET_SCHEDULE(state, rounds);
      expect(state.rounds).toBe(rounds);
    });
  });

  describe('getters', () => {
    const rounds = [
      { roundIndex: 0, distance: 1200, horses: [] },
      { roundIndex: 1, distance: 1400, horses: [] },
    ];

    test('allRounds returns all rounds', () => {
      expect(getters.allRounds({ rounds })).toBe(rounds);
    });

    test('roundByIndex returns correct round or null', () => {
      const finder = getters.roundByIndex({ rounds });
      expect(finder(0)).toBe(rounds[0]);
      expect(finder(1)).toBe(rounds[1]);
      expect(finder(5)).toBeNull();
    });
  });

  describe('actions', () => {
    function makeHorses(count) {
      return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Horse ${i + 1}`,
        condition: 50,
        color: `#${String(i).padStart(6, '0')}`,
      }));
    }

    test('generateSchedule creates 6 rounds with correct distances', () => {
      let schedule;
      const commit = (_, rounds) => { schedule = rounds; };
      const rootGetters = { 'horses/allHorses': makeHorses(20) };

      actions.generateSchedule({ commit, rootGetters });

      expect(schedule).toHaveLength(6);
      schedule.forEach((round, idx) => {
        expect(round.roundIndex).toBe(idx);
        expect(round.distance).toBe(ROUND_DISTANCES[idx]);
      });
    });

    test('each round selects 10 horses from 20', () => {
      let schedule;
      const commit = (_, rounds) => { schedule = rounds; };
      const allHorses = makeHorses(20);
      const rootGetters = { 'horses/allHorses': allHorses };

      actions.generateSchedule({ commit, rootGetters });

      schedule.forEach((round) => {
        expect(round.horses).toHaveLength(HORSES_PER_ROUND);
        round.horses.forEach((h) => {
          expect(allHorses.find((ah) => ah.id === h.id)).toBeTruthy();
        });
        // No duplicate horses within a round
        const ids = round.horses.map((h) => h.id);
        expect(new Set(ids).size).toBe(ids.length);
      });
    });

    test('horses are shallow-copied (not references to originals)', () => {
      let schedule;
      const commit = (_, rounds) => { schedule = rounds; };
      const allHorses = makeHorses(20);
      const rootGetters = { 'horses/allHorses': allHorses };

      actions.generateSchedule({ commit, rootGetters });

      schedule[0].horses.forEach((h) => {
        const original = allHorses.find((ah) => ah.id === h.id);
        expect(h).not.toBe(original);
        expect(h).toEqual(original);
      });
    });
  });
});
