<template>
  <div class="home-page">
    <LiveChannels @channel-selected="showStream" />
    
    <div class="main-content">
      <h1>Bienvenue sur la page d'accueil</h1>

      <div v-if="selectedChannel && twitchPlayerUrl" class="twitch-player">
        <iframe
          :src="twitchPlayerUrl"
          height="480"
          width="720"
          allowfullscreen>
        </iframe>
      </div>

      <p v-else>Veuillez sélectionner une chaîne pour afficher le stream.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import LiveChannels from '../components/LiveChannels.vue';

export default {
  name: 'HomeView',
  components: {
    LiveChannels
  },
  setup() {
    const selectedChannel = ref(null);
    const twitchPlayerUrl = ref(null);

    const showStream = (channelLogin) => {
      selectedChannel.value = channelLogin;
    };

    onMounted(() => {
      if (selectedChannel.value) {
        twitchPlayerUrl.value = `https://player.twitch.tv/?channel=${selectedChannel.value}&parent=${window.location.hostname}`;
      }
    });

    return {
      selectedChannel,
      twitchPlayerUrl,
      showStream
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
