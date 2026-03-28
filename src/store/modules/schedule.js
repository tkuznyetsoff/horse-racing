import { ROUND_DISTANCES, HORSES_PER_ROUND } from '@/constants/rounds';
import { pickRandom } from '@/utils/raceEngine';

const state = () => ({
  rounds: [],
});

const getters = {
  allRounds: (state) => state.rounds,
  roundByIndex: (state) => (index) => state.rounds[index] || null,
};

const mutations = {
  SET_SCHEDULE(state, rounds) {
    state.rounds = rounds;
  },
};

const actions = {
  generateSchedule({ commit, rootGetters }) {
    const horses = rootGetters['horses/allHorses'];
    // Pick min(10, available) horses per round
    const perRound = Math.min(HORSES_PER_ROUND, horses.length);
    const rounds = ROUND_DISTANCES.map((distance, index) => {
      const selected = pickRandom(horses, perRound);
      return {
        roundIndex: index,
        distance,
        horses: selected.map((h) => ({ ...h })),
      };
    });
    commit('SET_SCHEDULE', rounds);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
