import { shallowMount } from '@vue/test-utils';
import TrackLane from '@/components/TrackLane.vue';

const defaultHorse = {
  id: 1,
  name: 'Thunder Bolt',
  condition: 80,
  color: '#E6194B',
};

function mountLane(propsData = {}) {
  return shallowMount(TrackLane, {
    propsData: {
      horse: defaultHorse,
      position: 0,
      laneNumber: 1,
      ...propsData,
    },
  });
}

describe('TrackLane component', () => {
  describe('lane number', () => {
    test('renders lane number', () => {
      const wrapper = mountLane({ laneNumber: 5 });
      expect(wrapper.find('.lane-number').text()).toBe('5');
    });

    test('lane number background uses horse color', () => {
      const wrapper = mountLane();
      const style = wrapper.find('.lane-number').attributes('style');
      expect(style).toContain('background-color');
      // jsdom converts hex to rgb
      expect(style).toMatch(/rgb\(230, 25, 75\)|#E6194B/i);
    });
  });

  describe('horseStyle computed', () => {
    const TRACK_WIDTH = 1000;
    const usable = TRACK_WIDTH - 90; // trackWidth - (horseIconWidth:70 + finishLineGap:20)

    test('at position 0 the horse starts at translateX(0px)', async () => {
      const wrapper = mountLane({ position: 0 });
      await wrapper.setData({ trackWidth: TRACK_WIDTH });
      const style = wrapper.find('.horse-icon').attributes('style');
      expect(style).toContain('translateX(0px)');
    });

    test('at position 50 the horse is at the midpoint of usable width', async () => {
      const wrapper = mountLane({ position: 50 });
      await wrapper.setData({ trackWidth: TRACK_WIDTH });
      const style = wrapper.find('.horse-icon').attributes('style');
      expect(style).toContain(`translateX(${Math.round(0.5 * usable)}px)`);
    });

    test('at position 100 horse nose aligns with finish line (translateX = usableWidth)', async () => {
      const wrapper = mountLane({ position: 100 });
      await wrapper.setData({ trackWidth: TRACK_WIDTH });
      const style = wrapper.find('.horse-icon').attributes('style');
      expect(style).toContain(`translateX(${usable}px)`);
    });

    test('position above 100 is clamped to 100', async () => {
      const wrapper = mountLane({ position: 120 });
      await wrapper.setData({ trackWidth: TRACK_WIDTH });
      const style = wrapper.find('.horse-icon').attributes('style');
      expect(style).toContain(`translateX(${usable}px)`);
    });

    test('formula is consistent at a smaller track width (e.g. 500px laptop)', async () => {
      const wrapper = mountLane({ position: 100 });
      await wrapper.setData({ trackWidth: 500 });
      const style = wrapper.find('.horse-icon').attributes('style');
      expect(style).toContain(`translateX(${500 - 90}px)`);
    });
  });

  describe('finish marker', () => {
    test('not shown when position < 100', () => {
      const wrapper = mountLane({ position: 99 });
      expect(wrapper.find('.finish-marker').exists()).toBe(false);
    });

    test('shown when position >= 100', () => {
      const wrapper = mountLane({ position: 100 });
      expect(wrapper.find('.finish-marker').exists()).toBe(true);
      expect(wrapper.find('.finish-marker').text()).toBe('✓');
    });
  });
});
