import resultsModule from '@/store/modules/results';

const { getters, mutations, actions } = resultsModule;

describe('results store module', () => {
  describe('mutations', () => {
    test('ADD_RESULT appends a result', () => {
      const state = { results: [] };
      const result = { roundIndex: 0, finishOrder: [{ id: 1 }] };
      mutations.ADD_RESULT(state, result);
      expect(state.results).toHaveLength(1);
      expect(state.results[0]).toBe(result);
    });

    test('ADD_RESULT accumulates results', () => {
      const state = { results: [] };
      mutations.ADD_RESULT(state, { roundIndex: 0, finishOrder: [] });
      mutations.ADD_RESULT(state, { roundIndex: 1, finishOrder: [] });
      expect(state.results).toHaveLength(2);
    });

    test('CLEAR_RESULTS empties the list', () => {
      const state = { results: [{ roundIndex: 0, finishOrder: [] }] };
      mutations.CLEAR_RESULTS(state);
      expect(state.results).toEqual([]);
    });
  });

  describe('getters', () => {
    const results = [
      { roundIndex: 0, finishOrder: [{ id: 1 }] },
      { roundIndex: 2, finishOrder: [{ id: 3 }] },
    ];

    test('allResults returns all results', () => {
      expect(getters.allResults({ results })).toBe(results);
    });

    test('resultByRound finds by roundIndex', () => {
      const finder = getters.resultByRound({ results });
      expect(finder(0)).toBe(results[0]);
      expect(finder(2)).toBe(results[1]);
      expect(finder(1)).toBeNull();
    });
  });

  describe('actions', () => {
    test('addResult commits ADD_RESULT', () => {
      const committed = [];
      const commit = (type, payload) => committed.push({ type, payload });
      const result = { roundIndex: 0, finishOrder: [] };

      actions.addResult({ commit }, result);

      expect(committed[0]).toEqual({ type: 'ADD_RESULT', payload: result });
    });

    test('clearResults commits CLEAR_RESULTS', () => {
      const committed = [];
      const commit = (type) => committed.push(type);
      actions.clearResults({ commit });
      expect(committed[0]).toBe('CLEAR_RESULTS');
    });
  });
});
