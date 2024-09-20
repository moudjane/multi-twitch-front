<template>
  <div id="app">
    <Header />
    <div class="main-layout">
      <LiveChannels class="sidebar" /> 
      <div class="stream-area">
        <router-view /> 
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import LiveChannels from './components/LiveChannels.vue';

export default {
  name: 'App',
  components: {
    Header,
    LiveChannels
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 90vh;
}

.main-layout {
  display: flex;
  flex: 1;
  position: relative;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 50px;
  bottom: 0;
  width: 220px;
  z-index: 10; 
  background-color: #f7f7f7;
  overflow-y: auto;
  padding: 20px;
}

.stream-area {
  margin-left: 240px;
  padding: 10px;
  z-index: 1;
  flex-grow: 1;
  overflow-y: auto;
}
</style>
