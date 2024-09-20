<template>
  <div class="multi-streamer-view">
    <h1>Multi-Twitch Viewer</h1>
    <div v-if="limitedStreamersArray.length" class="streams-grid" :class="gridClass">
      <div
        v-for="(streamer, index) in limitedStreamersArray"
        :key="index"
        class="twitch-container"
      >
        <TwitchPlayer
          :channel="streamer"
          :width="'100%'"
          :height="'100%'"
        />
      </div>
    </div>
    <div v-else>
      <p>Aucun streamer spécifié dans l'URL.</p>
    </div>
    <div v-if="streamersArray.length > 4" class="warning">
      <p>Vous ne pouvez afficher que 4 streams maximum.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import TwitchPlayer from '../components/TwitchPlayer.vue';

export default {
  name: 'MultiStreamerView',
  components: {
    TwitchPlayer
  },
  setup() {
    const streamersArray = ref([]);

    // Limitation à 4 streams maximum
    const limitedStreamersArray = computed(() => {
      return streamersArray.value.slice(0, 4);
    });

    // Calcul du style de grille en fonction du nombre de streams
    const gridClass = computed(() => {
      switch (limitedStreamersArray.value.length) {
        case 1:
          return 'grid-one';
        case 2:
          return 'grid-two';
        case 3:
          return 'grid-three';
        case 4:
          return 'grid-four';
        default:
          return '';
      }
    });

    onMounted(() => {
      const streamers = window.location.pathname.split('/').pop();
      streamersArray.value = streamers ? streamers.split('.') : [];
    });

    return {
      streamersArray,
      limitedStreamersArray,
      gridClass
    };
  }
};
</script>

<style scoped>
.multi-streamer-view {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
}

.streams-grid {
  flex: 1;
  display: grid;
  gap: 10px;
}

.grid-one {
  grid-template-columns: 1fr;
}

.grid-two {
  grid-template-columns: 1fr 1fr;
}

.grid-three {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.grid-three .twitch-container:nth-child(3) {
  grid-column: 1 / -1;
}

.grid-four {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.twitch-container {
  aspect-ratio: 16 / 9;
  width: 88%;
  height: 88%;
  max-height: 100%;
  overflow: hidden;
  border: 1px solid #9146ff;
  background-color: #000;
}

.warning {
  color: red;
  text-align: center;
  margin-top: 10px;
}

h1 {
  margin-top: 0;
  margin-bottom: 10px;
}
</style>