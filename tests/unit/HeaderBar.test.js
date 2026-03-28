import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import HeaderBar from '@/components/HeaderBar.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

function createStore(overrides = {}) {
  return new Vuex.Store({
    actions: {
      generateProgram: jest.fn(),
    },
    modules: {
      race: {
        namespaced: true,
        state: { raceStatus: 'idle' },
        getters: {
          raceStatus: (s) => s.raceStatus,
          isRunning: (s) => s.raceStatus === 'running',
        },
        mutations: {
          SET_RACE_STATUS(s, v) { s.raceStatus = v; },
        },
        actions: {
          resetRace: jest.fn(),
          startOrToggleRace: jest.fn(),
        },
        ...overrides.race,
      },
      schedule: {
        namespaced: true,
        state: { rounds: overrides.rounds || [] },
        getters: {
          allRounds: (s) => s.rounds,
        },
        actions: { generateSchedule: jest.fn() },
      },
      horses: {
        namespaced: true,
        actions: { generateHorses: jest.fn() },
      },
      results: {
        namespaced: true,
        actions: { clearResults: jest.fn() },
      },
    },
  });
}

function mountHeader(overrides = {}) {
  const store = createStore(overrides);
  return { wrapper: shallowMount(HeaderBar, { localVue, store }), store };
}

describe('HeaderBar component', () => {
  describe('button labels', () => {
    test('shows START by default', () => {
      const { wrapper } = mountHeader();
      expect(wrapper.find('.btn-start').text()).toBe('START');
    });

    test('shows PAUSE when running', async () => {
      const { wrapper, store } = mountHeader();
      store.commit('race/SET_RACE_STATUS', 'running');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.btn-start').text()).toBe('PAUSE');
    });

    test('shows RESUME when paused', async () => {
      const { wrapper, store } = mountHeader();
      store.commit('race/SET_RACE_STATUS', 'paused');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.btn-start').text()).toBe('RESUME');
    });
  });

  describe('button disabled states', () => {
    test('START is disabled when no schedule', () => {
      const { wrapper } = mountHeader();
      expect(wrapper.find('.btn-start').attributes('disabled')).toBeDefined();
    });

    test('START is enabled when schedule exists', () => {
      const { wrapper } = mountHeader({ rounds: [{ roundIndex: 0 }] });
      expect(wrapper.find('.btn-start').attributes('disabled')).toBeUndefined();
    });

    test('START is disabled when finished', async () => {
      const { wrapper, store } = mountHeader({ rounds: [{ roundIndex: 0 }] });
      store.commit('race/SET_RACE_STATUS', 'finished');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.btn-start').attributes('disabled')).toBeDefined();
    });

    test('GENERATE PROGRAM is always enabled', () => {
      const { wrapper } = mountHeader();
      expect(wrapper.find('.btn-generate').attributes('disabled')).toBeUndefined();
    });
  });

  describe('interactions', () => {
    test('GENERATE PROGRAM click dispatches generateProgram', async () => {
      const { wrapper, store } = mountHeader();
      jest.spyOn(store, 'dispatch');

      await wrapper.find('.btn-generate').trigger('click');

      expect(store.dispatch).toHaveBeenCalledWith('generateProgram');
    });

    test('START click dispatches startOrToggleRace', async () => {
      const { wrapper, store } = mountHeader({ rounds: [{ roundIndex: 0 }] });
      jest.spyOn(store, 'dispatch');

      await wrapper.find('.btn-start').trigger('click');

      expect(store.dispatch).toHaveBeenCalledWith('race/startOrToggleRace');
    });
  });
});
