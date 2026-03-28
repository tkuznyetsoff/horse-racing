<template>
  <div id="app">
    <HeaderBar />
    <div class="main-content">
      <HorseList class="panel-horses" />
      <RaceTrack class="panel-track" />
      <ProgramPanel class="panel-program" />
      <ResultsPanel class="panel-results" />
    </div>
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue';
import HorseList from './components/HorseList.vue';
import RaceTrack from './components/RaceTrack.vue';
import ProgramPanel from './components/ProgramPanel.vue';
import ResultsPanel from './components/ResultsPanel.vue';

export default {
  name: 'App',
  components: {
    HeaderBar,
    HorseList,
    RaceTrack,
    ProgramPanel,
    ResultsPanel,
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #e8e8e8;
  overflow-x: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 8px;
  padding: 8px;
}

.panel-horses {
  width: 200px;
  flex-shrink: 0;
}

.panel-track {
  flex: 2;
  min-width: 0;
}

.panel-program {
  flex: 1;
  min-width: 0;
}

.panel-results {
  flex: 1;
  min-width: 0;
}

@media (max-width: 900px) {
  .main-content {
    flex-wrap: wrap;
    overflow-y: auto;
    height: auto;
  }

  .panel-horses {
    width: 100%;
    max-height: 200px;
    flex-shrink: 0;
  }

  .panel-track {
    flex: 1 1 100%;
    min-height: 320px;
    max-height: 400px;
  }

  .panel-program,
  .panel-results {
    flex: 1 1 calc(50% - 4px);
    min-width: 200px;
  }
}

@media (max-width: 540px) {
  .panel-track {
    width: 100%;
    height: 400px;
    flex: 0 0 auto;
  }

  .panel-program,
  .panel-results {
    width: 100%;
    min-width: unset;
    flex: 0 0 auto;
  }
}
</style>
