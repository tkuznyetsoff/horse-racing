<template>
  <div class="horse-list">
    <div class="horse-list-header">
      <h3>Horse List ({{ horseCount > 0 ? '1 - ' + horseCount : '1 - 20' }})</h3>
    </div>
    <div class="horse-list-table-wrapper">
      <table class="horse-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse.id">
            <td>{{ horse.name }}</td>
            <td class="center">{{ horse.condition }}</td>
            <td class="center">
              <span
                class="color-swatch"
                :style="{ backgroundColor: horse.color }"
              ></span>
            </td>
          </tr>
          <tr v-if="horses.length === 0">
            <td colspan="3" class="empty">Generate a program to see horses</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HorseList',
  computed: {
    ...mapGetters('horses', ['allHorses', 'horseCount']),
    horses() {
      return this.allHorses;
    },
  },
};
</script>

<style scoped>
.horse-list {
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.horse-list-header {
  background: #ffeb3b;
  padding: 8px 12px;
  border-bottom: 2px solid #ccc;
}

.horse-list-header h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.horse-list-table-wrapper {
  overflow-y: auto;
  flex: 1;
}

.horse-list-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.horse-list-table thead {
  position: sticky;
  top: 0;
  background: #f5f5f5;
}

.horse-list-table th {
  padding: 6px 8px;
  border-bottom: 2px solid #ccc;
  font-weight: 600;
  text-align: left;
  font-size: 12px;
}

.horse-list-table td {
  padding: 5px 8px;
  border-bottom: 1px solid #eee;
}

.horse-list-table td.center,
.horse-list-table th.center {
  text-align: center;
}

.horse-list-table td.empty {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

.color-swatch {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid #0002;
  vertical-align: middle;
}
</style>
