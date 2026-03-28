<template>
  <div class="results-panel">
    <div class="panel-header results-header">Results</div>
    <div class="panel-body">
      <div v-if="results.length === 0" class="empty-state">
        Race results will appear here.
      </div>
      <div
        v-for="result in results"
        :key="result.roundIndex"
        class="round-section"
      >
        <div class="round-header" :class="roundHeaderClass(result.roundIndex)">
          {{ roundLabel(result.roundIndex) }}
        </div>
        <table class="round-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(horse, pos) in result.finishOrder" :key="horse.id">
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
  name: 'ResultsPanel',
  mixins: [roundDisplayMixin],
  computed: {
    ...mapGetters('results', ['allResults']),
    results() {
      return this.allResults;
    },
  },
};
</script>

<style scoped>
.results-panel {
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.results-header {
  background: #66bb6a;
  color: #fff;
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
