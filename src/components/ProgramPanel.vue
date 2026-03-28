<template>
  <div class="program-panel">
    <div class="panel-header program-header">Program</div>
    <div class="panel-body">
      <div v-if="rounds.length === 0" class="empty-state">
        No program generated yet.
      </div>
      <div
        v-for="(round, idx) in rounds"
        :key="round.roundIndex"
        class="round-section"
        :class="{ active: idx === currentRound }"
      >
        <div class="round-header" :class="roundHeaderClass(idx)">
          {{ roundLabel(idx) }}
        </div>
        <table class="round-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(horse, pos) in round.horses" :key="horse.id">
              <td class="center">{{ pos + 1 }}</td>
              <td>{{ horse.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { roundDisplayMixin } from '@/mixins/roundDisplay';

export default {
  name: 'ProgramPanel',
  mixins: [roundDisplayMixin],
  computed: {
    ...mapGetters('schedule', ['allRounds']),
    ...mapGetters('race', ['currentRound']),
    rounds() {
      return this.allRounds;
    },
  },
};
</script>

<style scoped>
.program-panel {
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.program-header {
  background: #42a5f5;
  color: #fff;
}

.round-section.active {
  outline: 2px solid #42a5f5;
  outline-offset: -2px;
}

.round-section {
  border-bottom: 1px solid #ddd;
}

.round-header {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  color: #fff;
}

.round-hdr-1 { background: #5c9ae6; }
.round-hdr-2 { background: #f4a742; }
.round-hdr-3 { background: #e85d5d; }
.round-hdr-4 { background: #5cb85c; }
.round-hdr-5 { background: #9b59b6; }
.round-hdr-6 { background: #17a2b8; }

.round-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.round-table th {
  padding: 3px 8px;
  border-bottom: 1px solid #ddd;
  background: #f9f9f9;
  font-weight: 600;
  text-align: left;
  font-size: 11px;
}

.round-table td {
  padding: 2px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.round-table td.center {
  text-align: center;
}

.panel-header {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  flex-shrink: 0;
}

.panel-body {
  overflow-y: auto;
  flex: 1;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
  font-size: 13px;
}
</style>
