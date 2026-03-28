<template>
  <div class="track-lane">
    <div class="lane-number" :style="laneNumberStyle">
      {{ laneNumber }}
    </div>
    <div class="lane-track" ref="laneTrack">
      <div class="lane-dashes"></div>
      <div class="horse-icon" :style="horseStyle">
        <HorseIcon :color="horse.color" />
      </div>
    </div>
    <div class="finish-marker" v-if="position >= 100">✓</div>
  </div>
</template>

<script>
import HorseIcon from './HorseIcon.vue';

export default {
  name: 'TrackLane',
  components: { HorseIcon },
  props: {
    horse: { type: Object, required: true },
    position: { type: Number, default: 0 },
    laneNumber: { type: Number, required: true },
  },
  data() {
    return {
      trackWidth: 0,
    };
  },
  mounted() {
    this.updateTrackWidth();
    window.addEventListener('resize', this.updateTrackWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateTrackWidth);
  },
  computed: {
    laneNumberStyle() {
      return {
        backgroundColor: this.horse.color,
        color: '#fff',
      };
    },
    horseStyle() {
      const clampedPos = Math.min(this.position, 100);
      const pixelPos = Math.round((clampedPos / 100) * (this.trackWidth - 90));
      return {
        transform: `translateY(-50%) translateX(${pixelPos}px)`,
      };
    },
  },
  methods: {
    updateTrackWidth() {
      this.trackWidth = this.$refs.laneTrack ? this.$refs.laneTrack.clientWidth : 0;
    },
  },
};
</script>

<style scoped>
.track-lane {
  display: flex;
  align-items: center;
  height: 60px;
  position: relative;
  background: #4a7c3f;
  border-bottom: 1px dashed #3a6830;
}

.lane-number {
  width: 30px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
}

.lane-track {
  flex: 1;
  position: relative;
  height: 100%;
  overflow: hidden;
}

.lane-dashes {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
}

.horse-icon {
  position: absolute;
  top: 50%;
  left: 0;
  width: 70px;
  height: 50px;
  transition: transform 0.05s linear;
  will-change: transform;
}

.horse-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
}

.finish-marker {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  color: #4caf50;
  font-size: 18px;
  font-weight: bold;
}

@media (max-width: 540px) {
  .track-lane {
    height: 40px;
  }

  .horse-icon {
    width: 50px;
    height: 35px;
  }
}
</style>
