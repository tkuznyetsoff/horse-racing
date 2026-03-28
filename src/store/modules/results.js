const state = () => ({
  results: [], // Array of { roundIndex, finishOrder: [horse, ...] }
});

const getters = {
  allResults: (state) => state.results,
  resultByRound: (state) => (roundIndex) =>
    state.results.find((r) => r.roundIndex === roundIndex) || null,
};

const mutations = {
  ADD_RESULT(state, result) {
    state.results.push(result);
  },
  CLEAR_RESULTS(state) {
    state.results = [];
  },
};

const actions = {
  addResult({ commit }, result) {
    commit('ADD_RESULT', result);
  },
  clearResults({ commit }) {
    commit('CLEAR_RESULTS');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
