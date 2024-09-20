<template>
  <div class="home-page">
    <div class="main-content">
      <h1>Bienvenue sur la page d'accueil</h1>
      <div v-if="streamsStore.streamCount" class="twitch-player">
        <TwitchPlayer
          :channel="streamsStore.activeStreams[0]"
          width="720"
          height="480"
        />
      </div>
      <p v-else>Veuillez sélectionner une chaîne pour afficher le stream.</p>
    </div>
  </div>
</template>

<script>
import { useStreamsStore } from '../stores/streamsStore';
import TwitchPlayer from '../components/TwitchPlayer.vue';

export default {
  name: 'HomeView',
  components: {
    TwitchPlayer
  },
  setup() {
    const streamsStore = useStreamsStore();

    return {
      streamsStore
    };
  }
};
</script>

<style scoped>
.home-page {
  display: flex;
  padding: 20px;
}

.main-content {
  flex: 1;
  margin-left: 270px;
  padding: 20px;
}

.twitch-player {
  margin-top: 20px;
}
</style>
