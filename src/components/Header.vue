<template>
    <header class="header" :class="{ 'dark-mode': isDarkMode }">
      <h1 class="header-title">Multi-Twitch Viewer</h1>
      <div class="header-actions">
        <button @click="$emit('toggle-theme')" class="theme-toggle">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
        <div v-if="isAuthenticated" class="user-info">
          <button @click="goToFollowers" class="button followers-button">
            Voir les chaînes suivies
          </button>
          <span class="username">{{ userLogin }}</span>
          <button @click="logout" class="button logout-button">Se déconnecter</button>
        </div>
        <div v-else>
          <router-link to="/login" class="button login-link">Se connecter</router-link>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Header',
    props: {
      isDarkMode: Boolean
    },
    emits: ['toggle-theme'],
    setup() {
      const isAuthenticated = ref(false);
      const userLogin = ref('');
      const router = useRouter();
  
      const checkAuth = () => {
        const token = localStorage.getItem('twitch_access_token');
        const userInfo = JSON.parse(localStorage.getItem('twitch_user_info'));
  
        if (token && userInfo) {
          isAuthenticated.value = true;
          userLogin.value = userInfo.login;
        } else {
          isAuthenticated.value = false;
          userLogin.value = '';
        }
      };
  
      onMounted(() => {
        checkAuth();
      });
  
      const logout = () => {
        localStorage.removeItem('twitch_access_token');
        localStorage.removeItem('twitch_user_info');
        isAuthenticated.value = false;
        userLogin.value = '';
        window.location.href = '/';
      };
  
      const goToFollowers = () => {
        router.push('/followers');
      };
  
      return {
        isAuthenticated,
        userLogin,
        logout,
        goToFollowers
      };
    }
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .header-title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .username {
    font-weight: 500;
  }
  
  .button {
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .login-link {
    background-color: white;
    color: var(--primary-color);
    text-decoration: none;
  }
  
  .login-link:hover {
    background-color: #f0f0f0;
  }
  
  .followers-button {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  .followers-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  .logout-button {
    background-color: #ff4f4f;
    color: white;
  }
  
  .logout-button:hover {
    background-color: #ff3b3b;
  }
  
  .theme-toggle {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .theme-toggle:hover {
    transform: scale(1.1);
  }
  
  .dark-mode {
    background: linear-gradient(135deg, #18181b, #0e0e10);
  }
  
  .dark-mode .login-link {
    background-color: var(--primary-color);
    color: white;
  }
  
  .dark-mode .login-link:hover {
    background-color: var(--secondary-color);
  }
  </style>