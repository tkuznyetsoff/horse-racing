import { HORSE_NAMES, HORSE_COLORS } from '@/constants/horses';
import { TOTAL_HORSES } from '@/constants/rounds';
import { shuffleArray } from '@/utils/raceEngine';

const state = () => ({
  horses: [],
});

const getters = {
  allHorses: (state) => state.horses,
  horseById: (state) => (id) => state.horses.find((h) => h.id === id),
  horseCount: (state) => state.horses.length,
};

const mutations = {
  SET_HORSES(state, horses) {
    state.horses = horses;
  },
};

const actions = {
  generateHorses({ commit }) {
    // Always generate all 20 horses with random condition scores (spec: "total of 20 horses")
    const indices = shuffleArray(Array.from({ length: TOTAL_HORSES }, (_, i) => i));
    const horses = [];
    for (let i = 0; i < TOTAL_HORSES; i++) {
      const idx = indices[i];
      horses.push({
        id: i + 1,
        name: HORSE_NAMES[idx],
        condition: Math.floor(Math.random() * 100) + 1,
        color: HORSE_COLORS[idx],
      });
    }
    commit('SET_HORSES', horses);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
