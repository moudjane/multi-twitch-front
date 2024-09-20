<template>
  <div class="twitch-player-container">
    <iframe
      :src="twitchEmbedUrl"
      width="100%"
      height="100%"
      allowfullscreen>
    </iframe>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'TwitchPlayer',
  props: {
    channel: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const twitchEmbedUrl = ref('');

    onMounted(() => {
      twitchEmbedUrl.value = `https://player.twitch.tv/?channel=${props.channel}&parent=${window.location.hostname}`;
    });

    return {
      twitchEmbedUrl
    };
  }
};
</script>

<style scoped>
.twitch-player-container {
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9;
}

iframe {
  border: none;
}
</style>