import raceModule from '@/store/modules/race';

const { getters, mutations, actions } = raceModule;

function freshState() {
  return {
    currentRound: 0,
    raceStatus: 'idle',
    horsePositions: {},
    finishOrder: [],
  };
}

function makeRound(horseCount = 3, distance = 1200) {
  const horses = Array.from({ length: horseCount }, (_, i) => ({
    id: i + 1,
    name: `Horse ${i + 1}`,
    condition: 50,
    color: '#000',
  }));
  return { roundIndex: 0, distance, horses };
}

describe('race store module', () => {
  describe('mutations', () => {
    test('SET_RACE_STATUS updates status', () => {
      const state = freshState();
      mutations.SET_RACE_STATUS(state, 'running');
      expect(state.raceStatus).toBe('running');
    });

    test('SET_CURRENT_ROUND updates round', () => {
      const state = freshState();
      mutations.SET_CURRENT_ROUND(state, 3);
      expect(state.currentRound).toBe(3);
    });

    test('INIT_POSITIONS sets all horses to 0 and clears finishOrder', () => {
      const state = freshState();
      state.finishOrder = [{ id: 99 }];
      mutations.INIT_POSITIONS(state, [1, 2, 3]);
      expect(state.horsePositions).toEqual({ 1: 0, 2: 0, 3: 0 });
      expect(state.finishOrder).toEqual([]);
    });

    test('UPDATE_POSITION updates horse position, capped at 100', () => {
      const state = freshState();
      state.horsePositions = { 1: 50, 2: 20 };

      mutations.UPDATE_POSITION(state, { horseId: 1, position: 75 });
      expect(state.horsePositions[1]).toBe(75);

      mutations.UPDATE_POSITION(state, { horseId: 2, position: 120 });
      expect(state.horsePositions[2]).toBe(100);
    });

    test('UPDATE_POSITION preserves other horse positions (immutable spread)', () => {
      const state = freshState();
      state.horsePositions = { 1: 10, 2: 20, 3: 30 };
      mutations.UPDATE_POSITION(state, { horseId: 2, position: 50 });
      expect(state.horsePositions).toEqual({ 1: 10, 2: 50, 3: 30 });
    });

    test('ADD_TO_FINISH appends horse to finishOrder', () => {
      const state = freshState();
      const horse = { id: 5, name: 'Test' };
      mutations.ADD_TO_FINISH(state, horse);
      expect(state.finishOrder).toHaveLength(1);
      expect(state.finishOrder[0]).toBe(horse);
    });

    test('RESET_RACE restores initial state', () => {
      const state = {
        currentRound: 3,
        raceStatus: 'running',
        horsePositions: { 1: 50 },
        finishOrder: [{ id: 1 }],
      };
      mutations.RESET_RACE(state);
      expect(state).toEqual(freshState());
    });
  });

  describe('getters', () => {
    test('currentRound returns current round', () => {
      expect(getters.currentRound({ currentRound: 2 })).toBe(2);
    });

    test('raceStatus returns status', () => {
      expect(getters.raceStatus({ raceStatus: 'paused' })).toBe('paused');
    });

    test('isRunning is true only when running', () => {
      expect(getters.isRunning({ raceStatus: 'running' })).toBe(true);
      expect(getters.isRunning({ raceStatus: 'paused' })).toBe(false);
      expect(getters.isRunning({ raceStatus: 'idle' })).toBe(false);
    });

    test('horsePositions returns positions object', () => {
      const positions = { 1: 50 };
      expect(getters.horsePositions({ horsePositions: positions })).toBe(positions);
    });

    test('finishOrder returns finish order', () => {
      const order = [{ id: 1 }];
      expect(getters.finishOrder({ finishOrder: order })).toBe(order);
    });
  });

  describe('actions', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      // Clean up any running timers between tests
      actions.resetRace({ commit: jest.fn() });
      jest.useRealTimers();
    });

    test('resetRace clears timers and commits RESET_RACE', () => {
      const commit = jest.fn();
      actions.resetRace({ commit });
      expect(commit).toHaveBeenCalledWith('RESET_RACE');
    });

    test('startOrToggleRace dispatches pauseRace when running', () => {
      const dispatch = jest.fn();
      const state = { ...freshState(), raceStatus: 'running' };
      actions.startOrToggleRace({ state, dispatch });
      expect(dispatch).toHaveBeenCalledWith('pauseRace');
    });

    test('startOrToggleRace dispatches resumeRace when paused', () => {
      const dispatch = jest.fn();
      const state = { ...freshState(), raceStatus: 'paused' };
      actions.startOrToggleRace({ state, dispatch });
      expect(dispatch).toHaveBeenCalledWith('resumeRace');
    });

    test('startOrToggleRace dispatches runRound when ready', () => {
      const dispatch = jest.fn();
      const state = { ...freshState(), raceStatus: 'ready' };
      actions.startOrToggleRace({ state, dispatch });
      expect(dispatch).toHaveBeenCalledWith('runRound');
    });

    test('startOrToggleRace dispatches runRound when round_complete', () => {
      const dispatch = jest.fn();
      const state = { ...freshState(), raceStatus: 'round_complete' };
      actions.startOrToggleRace({ state, dispatch });
      expect(dispatch).toHaveBeenCalledWith('runRound');
    });

    test('startOrToggleRace does nothing when finished', () => {
      const dispatch = jest.fn();
      const state = { ...freshState(), raceStatus: 'finished' };
      actions.startOrToggleRace({ state, dispatch });
      expect(dispatch).not.toHaveBeenCalled();
    });

    test('runRound initializes positions and sets status to running', () => {
      const round = makeRound(3, 1200);
      const state = freshState();
      const commit = jest.fn();
      const dispatch = jest.fn();
      const rootGetters = { 'schedule/roundByIndex': () => round };

      actions.runRound({ state, commit, rootGetters, dispatch });

      expect(commit).toHaveBeenCalledWith('INIT_POSITIONS', [1, 2, 3]);
      expect(commit).toHaveBeenCalledWith('SET_RACE_STATUS', 'running');
    });

    test('runRound does nothing when round is null', () => {
      const state = freshState();
      const commit = jest.fn();
      const dispatch = jest.fn();
      const rootGetters = { 'schedule/roundByIndex': () => null };

      actions.runRound({ state, commit, rootGetters, dispatch });

      expect(commit).not.toHaveBeenCalled();
    });

    test('runRound starts ticking and updates positions over time', () => {
      const round = makeRound(2, 1200);
      const state = freshState();
      state.horsePositions = { 1: 0, 2: 0 };
      const commit = jest.fn((type, payload) => {
        if (type === 'INIT_POSITIONS') {
          state.horsePositions = {};
          payload.forEach((id) => { state.horsePositions[id] = 0; });
        } else if (type === 'UPDATE_POSITION') {
          state.horsePositions[payload.horseId] = Math.min(payload.position, 100);
        } else if (type === 'ADD_TO_FINISH') {
          state.finishOrder.push(payload);
        }
      });
      const dispatch = jest.fn();
      const rootGetters = { 'schedule/roundByIndex': () => round };

      actions.runRound({ state, commit, rootGetters, dispatch });

      // Advance one tick
      jest.advanceTimersByTime(50);

      // UPDATE_POSITION should have been called for each horse
      const updateCalls = commit.mock.calls.filter((c) => c[0] === 'UPDATE_POSITION');
      expect(updateCalls.length).toBeGreaterThanOrEqual(2);
    });

    test('pauseRace sets status to paused', () => {
      const commit = jest.fn();
      actions.pauseRace({ commit });
      expect(commit).toHaveBeenCalledWith('SET_RACE_STATUS', 'paused');
    });

    test('same-tick finishers are ordered by overshoot (higher newPos first)', () => {
      const raceEngine = require('@/utils/raceEngine');
      const calculateStepSpy = jest
        .spyOn(raceEngine, 'calculateStep')
        .mockReturnValueOnce(3)  // horse 1 (first in array): 99 + 3 = 102
        .mockReturnValueOnce(5); // horse 2 (second in array): 99 + 5 = 104 (larger overshoot)

      const round = {
        roundIndex: 0,
        distance: 1200,
        horses: [
          { id: 1, name: 'Horse A', condition: 50, color: '#f00' },
          { id: 2, name: 'Horse B', condition: 50, color: '#0f0' },
        ],
      };
      const state = freshState();

      const commit = jest.fn((type, payload) => {
        if (type === 'INIT_POSITIONS') {
          // Place both horses just below the finish line
          payload.forEach((id) => { state.horsePositions[id] = 99; });
        } else if (type === 'UPDATE_POSITION') {
          state.horsePositions[payload.horseId] = Math.min(payload.position, 100);
        } else if (type === 'ADD_TO_FINISH') {
          state.finishOrder.push(payload);
        }
      });
      const dispatch = jest.fn();
      const rootGetters = { 'schedule/roundByIndex': () => round };

      actions.runRound({ state, commit, rootGetters, dispatch });
      jest.advanceTimersByTime(50);

      calculateStepSpy.mockRestore();

      // horse 2 overshoots to 104, horse 1 overshoots to 102;
      // despite horse 1 being first in the round array, horse 2 is ranked first
      expect(state.finishOrder).toHaveLength(2);
      expect(state.finishOrder[0].id).toBe(2);
      expect(state.finishOrder[1].id).toBe(1);
    });

    test('completeRound dispatches result and sets finished on last round', () => {
      const state = { ...freshState(), currentRound: 5, finishOrder: [{ id: 1 }] };
      const commit = jest.fn();
      const dispatch = jest.fn();
      const rootGetters = { 'schedule/allRounds': new Array(6) };

      actions.completeRound({ state, commit, dispatch, rootGetters });

      expect(dispatch).toHaveBeenCalledWith(
        'results/addResult',
        expect.objectContaining({ roundIndex: 5 }),
        { root: true },
      );
      expect(commit).toHaveBeenCalledWith('SET_RACE_STATUS', 'finished');
    });

    test('completeRound auto-advances to next round when not last', () => {
      const state = { ...freshState(), currentRound: 2, finishOrder: [{ id: 1 }] };
      const commit = jest.fn();
      const dispatch = jest.fn();
      const rootGetters = { 'schedule/allRounds': new Array(6) };

      actions.completeRound({ state, commit, dispatch, rootGetters });

      expect(commit).toHaveBeenCalledWith('SET_RACE_STATUS', 'round_complete');
      expect(dispatch).not.toHaveBeenCalledWith('runRound');

      // After the auto-advance delay
      jest.advanceTimersByTime(1500);

      expect(commit).toHaveBeenCalledWith('SET_CURRENT_ROUND', 3);
      expect(dispatch).toHaveBeenCalledWith('runRound');
    });
  });
});
