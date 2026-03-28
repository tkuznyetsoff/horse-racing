import { HORSE_NAMES, HORSE_COLORS } from '@/constants/horses';
import { TOTAL_HORSES } from '@/constants/rounds';
import horsesModule from '@/store/modules/horses';

const { getters, mutations, actions } = horsesModule;

function freshState() {
  return { horses: [] };
}

describe('horses store module', () => {
  describe('mutations', () => {
    test('SET_HORSES replaces the horse list', () => {
      const state = freshState();
      const list = [{ id: 1, name: 'A', condition: 50, color: '#fff' }];
      mutations.SET_HORSES(state, list);
      expect(state.horses).toBe(list);
    });
  });

  describe('getters', () => {
    const horses = [
      { id: 1, name: 'A', condition: 50, color: '#f00' },
      { id: 2, name: 'B', condition: 80, color: '#0f0' },
    ];

    test('allHorses returns all horses', () => {
      expect(getters.allHorses({ horses })).toEqual(horses);
    });

    test('horseById returns correct horse', () => {
      const finder = getters.horseById({ horses });
      expect(finder(2)).toEqual(horses[1]);
      expect(finder(99)).toBeUndefined();
    });

    test('horseCount returns length', () => {
      expect(getters.horseCount({ horses })).toBe(2);
    });
  });

  describe('actions', () => {
    test('generateHorses creates exactly 20 horses', () => {
      const committed = [];
      const commit = (type, payload) => committed.push({ type, payload });
      actions.generateHorses({ commit });

      expect(committed).toHaveLength(1);
      expect(committed[0].type).toBe('SET_HORSES');
      expect(committed[0].payload).toHaveLength(TOTAL_HORSES);
    });

    test('each horse has unique id, name, color, and valid condition', () => {
      let horses;
      actions.generateHorses({ commit: (_, p) => { horses = p; } });

      const ids = horses.map((h) => h.id);
      const names = horses.map((h) => h.name);
      const colors = horses.map((h) => h.color);

      expect(new Set(ids).size).toBe(TOTAL_HORSES);
      expect(new Set(names).size).toBe(TOTAL_HORSES);
      expect(new Set(colors).size).toBe(TOTAL_HORSES);

      names.forEach((n) => expect(HORSE_NAMES).toContain(n));
      colors.forEach((c) => expect(HORSE_COLORS).toContain(c));

      horses.forEach((h) => {
        expect(h.condition).toBeGreaterThanOrEqual(1);
        expect(h.condition).toBeLessThanOrEqual(100);
      });
    });
  });
});
