<template>
  <div class="race-track">
    <div class="track-area" v-if="currentRoundData">
      <div class="track-lanes">
        <TrackLane
          v-for="(horse, index) in currentRoundData.horses"
          :key="horse.id"
          :horse="horse"
          :position="getPosition(horse.id)"
          :laneNumber="index + 1"
        />
      </div>
      <div class="finish-line"></div>
    </div>
    <div class="track-placeholder" v-else>
      <p>Generate a program and start the race!</p>
    </div>
    <div class="track-footer" v-if="currentRoundData">
      <span class="round-label">{{ roundLabel }}</span>
      <span class="finish-text">FINISH</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ROUND_DISTANCES, ROUND_LABELS } from '@/constants/rounds';
import TrackLane from './TrackLane.vue';

export default {
  name: 'RaceTrack',
  components: { TrackLane },
  computed: {
    ...mapGetters('race', ['currentRound', 'horsePositions', 'raceStatus']),
    ...mapGetters('schedule', ['roundByIndex']),
    currentRoundData() {
      return this.roundByIndex(this.currentRound);
    },
    roundLabel() {
      if (!this.currentRoundData) return '';
      const idx = this.currentRoundData.roundIndex;
      return `${ROUND_LABELS[idx]} Lap ${ROUND_DISTANCES[idx]}m`;
    },
  },
  methods: {
    getPosition(horseId) {
      return this.horsePositions[horseId] || 0;
    },
  },
};
</script>

<style scoped>
.race-track {
  background: #3d6e32;
  border: 2px solid #2e5527;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.track-area {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

.track-lanes {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.finish-line {
  position: absolute;
  right: 40px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: repeating-linear-gradient(
    to bottom,
    #ff0000 0,
    #ff0000 8px,
    #ffffff 8px,
    #ffffff 16px
  );
  z-index: 10;
}

.track-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  font-style: italic;
}

.track-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 16px;
  background: #2e5527;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

.round-label {
  color: #ffeb3b;
  font-size: 16px;
}

.finish-text {
  color: #ff5252;
  font-size: 16px;
  font-weight: 700;
}
</style>
