<template>
    <div class="login-container">
      <h1>Connexion à Twitch</h1>
      <button @click="redirectToTwitch" class="login-button">Se connecter avec Twitch</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    methods: {
      redirectToTwitch() {
        const twitchAuthUrl = 'https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=1ikj4d9r8gob7we9590v2dend4z9rz&redirect_uri=http://localhost:5173/callback&scope=user:read:follows';
        window.location.href = twitchAuthUrl;
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  .login-button {
    background-color: #9146ff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 18px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .login-button:hover {
    background-color: #772ce8;
  }
  </style>
  