import Vue from 'vue';
import { calculateStep } from '@/utils/raceEngine';

const TICK_INTERVAL = 50; // ms between animation frames

// Runtime handles kept outside Vuex state (non-serializable)
let _intervalId = null;
let _timeoutId = null;

function clearTimers() {
  if (_intervalId) {
    clearInterval(_intervalId);
    _intervalId = null;
  }
  if (_timeoutId) {
    clearTimeout(_timeoutId);
    _timeoutId = null;
  }
}

const state = () => ({
  currentRound: 0,
  // idle | ready | running | paused | round_complete | finished
  raceStatus: 'idle',
  horsePositions: {},  // { horseId: percentComplete (0-100) }
  finishOrder: [],     // horses that crossed the finish line this round
});

const getters = {
  currentRound: (state) => state.currentRound,
  raceStatus: (state) => state.raceStatus,
  horsePositions: (state) => state.horsePositions,
  finishOrder: (state) => state.finishOrder,
  isRunning: (state) => state.raceStatus === 'running',
};

const mutations = {
  SET_RACE_STATUS(state, status) {
    state.raceStatus = status;
  },
  SET_CURRENT_ROUND(state, round) {
    state.currentRound = round;
  },
  INIT_POSITIONS(state, horseIds) {
    const positions = {};
    horseIds.forEach((id) => {
      positions[id] = 0;
    });
    state.horsePositions = positions;
    state.finishOrder = [];
  },
  UPDATE_POSITION(state, { horseId, position }) {
    Vue.set(state.horsePositions, horseId, Math.min(position, 100));
  },
  ADD_TO_FINISH(state, horse) {
    state.finishOrder.push(horse);
  },
  RESET_RACE(state) {
    state.currentRound = 0;
    state.raceStatus = 'idle';
    state.horsePositions = {};
    state.finishOrder = [];
  },
};

/**
 * Shared race-tick logic used by both runRound and resumeRace.
 */
function startTicking(state, commit, dispatch, horsesInRound, distance) {
  clearTimers();
  _intervalId = setInterval(() => {
    const allFinished = horsesInRound.every(
      (h) => state.horsePositions[h.id] >= 100,
    );

    if (allFinished) {
      clearTimers();
      dispatch('completeRound');
      return;
    }

    const newFinishers = [];
    horsesInRound.forEach((horse) => {
      const currentPos = state.horsePositions[horse.id];
      if (currentPos >= 100) return;

      const step = calculateStep(horse.condition, distance);
      const newPos = currentPos + step;
      commit('UPDATE_POSITION', { horseId: horse.id, position: newPos });

      if (newPos >= 100 && !state.finishOrder.find((h) => h.id === horse.id)) {
        newFinishers.push({ horse: { ...horse }, newPos });
      }
    });

    // Sort by overshoot descending — more overshoot means the horse crossed first within the tick
    newFinishers.sort((a, b) => b.newPos - a.newPos);
    newFinishers.forEach(({ horse }) => commit('ADD_TO_FINISH', horse));
  }, TICK_INTERVAL);
}

const actions = {
  resetRace({ commit }) {
    clearTimers();
    commit('RESET_RACE');
  },

  startOrToggleRace({ state, dispatch }) {
    if (state.raceStatus === 'running') {
      dispatch('pauseRace');
    } else if (state.raceStatus === 'paused') {
      dispatch('resumeRace');
    } else if (
      state.raceStatus === 'ready' ||
      state.raceStatus === 'idle' ||
      state.raceStatus === 'round_complete'
    ) {
      dispatch('runRound');
    }
  },

  runRound({ state, commit, rootGetters, dispatch }) {
    const round = rootGetters['schedule/roundByIndex'](state.currentRound);
    if (!round) return;

    const horseIds = round.horses.map((h) => h.id);
    commit('INIT_POSITIONS', horseIds);
    commit('SET_RACE_STATUS', 'running');

    startTicking(state, commit, dispatch, round.horses, round.distance);
  },

  completeRound({ state, commit, dispatch, rootGetters }) {
    const roundIndex = state.currentRound;
    const result = {
      roundIndex,
      finishOrder: [...state.finishOrder],
    };
    dispatch('results/addResult', result, { root: true });

    const totalRounds = rootGetters['schedule/allRounds'].length;
    if (roundIndex + 1 < totalRounds) {
      commit('SET_RACE_STATUS', 'round_complete');
      // Auto-advance after a short delay (tracked so it can be cancelled on reset)
      _timeoutId = setTimeout(() => {
        _timeoutId = null;
        commit('SET_CURRENT_ROUND', roundIndex + 1);
        dispatch('runRound');
      }, 1500);
    } else {
      commit('SET_RACE_STATUS', 'finished');
    }
  },

  pauseRace({ commit }) {
    clearTimers();
    commit('SET_RACE_STATUS', 'paused');
  },

  resumeRace({ state, commit, rootGetters, dispatch }) {
    const round = rootGetters['schedule/roundByIndex'](state.currentRound);
    if (!round) return;

    commit('SET_RACE_STATUS', 'running');
    startTicking(state, commit, dispatch, round.horses, round.distance);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
