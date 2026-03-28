<template>
  <header class="header-bar">
    <h1 class="header-title">Horse Racing</h1>
    <div class="header-actions">
      <button
        class="btn btn-generate"
        @click="generateProgram"
      >
        GENERATE PROGRAM
      </button>
      <button
        class="btn btn-start"
        :disabled="!hasSchedule || isFinished || isAutoAdvancing"
        @click="toggleRace"
      >
        {{ startButtonLabel }}
      </button>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HeaderBar',
  computed: {
    ...mapGetters('race', ['raceStatus', 'isRunning']),
    ...mapGetters('schedule', ['allRounds']),
    hasSchedule() {
      return this.allRounds.length > 0;
    },
    isFinished() {
      return this.raceStatus === 'finished';
    },
    isAutoAdvancing() {
      return this.raceStatus === 'round_complete';
    },
    startButtonLabel() {
      if (this.raceStatus === 'running') return 'PAUSE';
      if (this.raceStatus === 'paused') return 'RESUME';
      return 'START';
    },
  },
  methods: {
    generateProgram() {
      this.$store.dispatch('generateProgram');
    },
    toggleRace() {
      this.$store.dispatch('race/startOrToggleRace');
    },
  },
};
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2c2c2c;
  color: #fff;
  padding: 12px 24px;
  height: 56px;
  flex-shrink: 0;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #fff;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: opacity 0.2s;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-generate {
  background: #f0f0f0;
  color: #333;
  border-color: #aaa;
}

.btn-generate:hover:not(:disabled) {
  background: #fff;
}

.btn-start {
  background: #333;
  color: #fff;
  border-color: #fff;
}

.btn-start:hover:not(:disabled) {
  background: #555;
}

@media (max-width: 540px) {
  .header-bar {
    flex-direction: column;
    height: auto;
    padding: 8px 12px;
    gap: 8px;
    align-items: flex-start;
  }

  .header-title {
    font-size: 16px;
  }

  .header-actions {
    width: 100%;
  }

  .btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
