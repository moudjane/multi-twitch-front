<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <Header @toggle-theme="toggleTheme" :isDarkMode="isDarkMode" />
    <div class="main-layout">
      <Transition name="slide-fade">
        <LiveChannels v-if="showSidebar" class="sidebar" @close-sidebar="toggleSidebar" />
      </Transition>
      <div class="stream-area" :class="{ 'sidebar-open': showSidebar }">
        <button class="toggle-sidebar" @click="toggleSidebar">
          {{ showSidebar ? '◀' : '▶' }}
        </button>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Header from './components/Header.vue';
import LiveChannels from './components/LiveChannels.vue';

export default {
  name: 'App',
  components: {
    Header,
    LiveChannels
  },
  setup() {
    const isDarkMode = ref(false);
    const showSidebar = ref(true);

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
    };

    const toggleSidebar = () => {
      showSidebar.value = !showSidebar.value;
    };

    return {
      isDarkMode,
      showSidebar,
      toggleTheme,
      toggleSidebar
    };
  }
};
</script>

<style>
:root {
  --primary-color: #9146ff;
  --secondary-color: #772ce8;
  --background-color: #f7f7f7;
  --text-color: #333;
  --sidebar-width: 250px;
  --primary-color: #9146ff;
  --primary-color-rgb: 145, 70, 255;
}

.dark-mode {
  --primary-color: #bf94ff;
  --secondary-color: #9146ff;
  --background-color: #18181b;
  --text-color: #efeff1;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

.main-layout {
  display: flex;
  flex: 1;
  position: relative;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 10vh;
  bottom: 0;
  width: var(--sidebar-width);
  z-index: 10;
  background-color: var(--background-color);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: transform 0.3s ease-in-out;
}

.stream-area {
  flex-grow: 1;
  padding: 20px;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease-in-out;
}

.stream-area.sidebar-open {
  margin-left: var(--sidebar-width);
}

.toggle-sidebar {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 20;
  transition: left 0.3s ease-in-out;
}

.sidebar-open .toggle-sidebar {
  left: var(--sidebar-width);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  margin-bottom: 1rem;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: var(--secondary-color);
}

button {
  cursor: pointer;
  font-family: inherit;
}
</style>