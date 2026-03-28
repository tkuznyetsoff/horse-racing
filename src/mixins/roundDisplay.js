import { ROUND_DISTANCES, ROUND_LABELS } from '@/constants/rounds';

export const roundDisplayMixin = {
  methods: {
    roundLabel(idx) {
      return `${ROUND_LABELS[idx]} Lap - ${ROUND_DISTANCES[idx]}m`;
    },
    roundHeaderClass(idx) {
      const classes = [
        'round-hdr-1', 'round-hdr-2', 'round-hdr-3',
        'round-hdr-4', 'round-hdr-5', 'round-hdr-6',
      ];
      return classes[idx] || '';
    },
  },
};
