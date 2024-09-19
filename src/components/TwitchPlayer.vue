<template>
    <div>
      <iframe
        :src="twitchEmbedUrl"
        height="480"
        width="720"
        allowfullscreen>
      </iframe>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TwitchPlayer',
    props: {
      channel: {
        type: String,
        required: true
      }
    },
    computed: {
      twitchEmbedUrl() {
        return `https://player.twitch.tv/?channel=${this.channel}&parent=${window.location.hostname}`;
      }
    }
  };
  </script>
  
  <style scoped>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>