<template>
    <div>
      <h1>Multi-Twitch Viewer</h1>
      <div v-if="streamersArray.length">
        <div
          v-for="(streamer, index) in streamersArray"
          :key="index"
          class="twitch-container"
          :style="{ left: positions[index].x + 'px', top: positions[index].y + 'px', width: positions[index].width + 'px', height: positions[index].height + 'px' }"
          @mousedown="startDrag($event, index)"
        >
          <div class="resize-handle" @mousedown.stop="startResize($event, index)"></div>
          <TwitchPlayer
            :channel="streamer"
            :width="positions[index].width"
            :height="positions[index].height"
          />
        </div>
      </div>
      <div v-else>
        <p>Aucun streamer spécifié dans l'URL.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from 'vue';
  import TwitchPlayer from '../components/TwitchPlayer.vue';
  
  export default {
    name: 'MultiStreamerView',
    components: {
      TwitchPlayer
    },
    setup() {
      const streamersArray = ref([]);
      const positions = ref([]);
      let draggingIndex = -1;
      let resizingIndex = -1;
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;
  
      const initializePositions = () => {
        positions.value = streamersArray.value.map((_, index) => ({
          x: index * 50,
          y: index * 50,
          width: 400,
          height: 300
        }));
      };
  
      const startDrag = (event, index) => {
        draggingIndex = index;
        startX = event.clientX - positions.value[index].x;
        startY = event.clientY - positions.value[index].y;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
      };
  
      const onDrag = (event) => {
        if (draggingIndex > -1) {
          positions.value[draggingIndex].x = event.clientX - startX;
          positions.value[draggingIndex].y = event.clientY - startY;
        }
      };
  
      const stopDrag = () => {
        draggingIndex = -1;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
      };
  
      const startResize = (event, index) => {
        resizingIndex = index;
        startX = event.clientX;
        startY = event.clientY;
        startWidth = positions.value[index].width;
        startHeight = positions.value[index].height;
        document.addEventListener('mousemove', onResize);
        document.addEventListener('mouseup', stopResize);
      };
  
      const onResize = (event) => {
        if (resizingIndex > -1) {
          const dx = event.clientX - startX;
          const dy = event.clientY - startY;
          positions.value[resizingIndex].width = Math.max(200, startWidth + dx);
          positions.value[resizingIndex].height = Math.max(150, startHeight + dy);
        }
      };
  
      const stopResize = () => {
        resizingIndex = -1;
        document.removeEventListener('mousemove', onResize);
        document.removeEventListener('mouseup', stopResize);
      };
  
      onMounted(() => {
        const streamers = window.location.pathname.split('/').pop();
        streamersArray.value = streamers ? streamers.split('.') : [];
        initializePositions();
      });
  
      onUnmounted(() => {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('mousemove', onResize);
        document.removeEventListener('mouseup', stopResize);
      });
  
      return {
        streamersArray,
        positions,
        startDrag,
        startResize
      };
    }
  };
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
  }
  
  .twitch-container {
    position: absolute;
    border: 1px solid #ddd;
    background: #f8f8f8;
    overflow: hidden;
  }
  
  .resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    background: #ccc;
    cursor: se-resize;
  }
  </style>