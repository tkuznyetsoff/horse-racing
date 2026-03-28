import Vue from 'vue';
import Vuex from 'vuex';
import horses from './modules/horses';
import schedule from './modules/schedule';
import race from './modules/race';
import results from './modules/results';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    horses,
    schedule,
    race,
    results,
  },
  actions: {
    async generateProgram({ dispatch, commit }) {
      await dispatch('race/resetRace');
      await dispatch('results/clearResults');
      await dispatch('horses/generateHorses');
      await dispatch('schedule/generateSchedule');
      commit('race/SET_RACE_STATUS', 'ready');
    },
  },
});
