<template>
    <div class="live-channels-sidebar">
      <h2>Favoris</h2>
      <ul v-if="favoritesList.length > 0">
        <li v-for="(channel, index) in favoritesList" :key="index" class="channel-item">
          <a href="javascript:void(0);" @click="addStreamer(channel.user_login)" class="channel-link">
            <img :src="channel.thumbnail_url.replace('{width}', 80).replace('{height}', 45)" alt="thumbnail" class="thumbnail" />
            <div class="channel-info">
              <p class="channel-name">{{ channel.user_name }}</p>
              <p class="viewers">{{ channel.viewer_count }} spectateurs</p>
            </div>
          </a>
          <span 
            class="favorite-star favorited"
            @click.stop="toggleFavorite(channel.user_id)"
          >★</span>
        </li>
      </ul>
      <p v-else>Aucun favori en live</p>
  
      <h2>Chaînes en direct</h2>
      <ul v-if="liveChannels.length > 0">
        <li v-for="(channel, index) in liveChannels" :key="index" class="channel-item">
          <a href="javascript:void(0);" @click="addStreamer(channel.user_login)" class="channel-link">
            <img :src="channel.thumbnail_url.replace('{width}', 80).replace('{height}', 45)" alt="thumbnail" class="thumbnail" />
            <div class="channel-info">
              <p class="channel-name">{{ channel.user_name }}</p>
              <p class="viewers">{{ channel.viewer_count }} spectateurs</p>
            </div>
          </a>
          <span 
            class="favorite-star"
            :class="{ favorited: isFavorite(channel.user_id) }"
            @click.stop="toggleFavorite(channel.user_id)"
          >★</span>
        </li>
      </ul>
      <p v-else>Aucune chaîne en direct suivie</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  export default {
    name: 'LiveChannels',
    setup() {
      const liveChannels = ref([]);
      const favoritesList = ref([]);
      const favorites = ref([]);
      const router = useRouter();
      const route = useRoute();
  
      const fetchLiveChannels = () => {
        const userInfo = JSON.parse(localStorage.getItem('twitch_user_info'));
        const accessToken = localStorage.getItem('twitch_access_token');
  
        if (userInfo && accessToken) {
          fetch(`http://localhost:3000/getFollowedLive/${userInfo.user_id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
          .then(response => response.json())
          .then(data => {
            liveChannels.value = data.data || [];
            updateFavoritesList();
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des chaînes en live:', error);
          });
  
          // Fetch favorites
          fetch(`http://localhost:3000/getFavorites/${userInfo.user_id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
          .then(response => response.json())
          .then(data => {
            favorites.value = data || [];
            updateFavoritesList();
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des favoris:', error);
          });
        } else {
          console.error('Utilisateur non connecté ou informations manquantes dans le localStorage.');
        }
      };
  
      const updateFavoritesList = () => {
        favoritesList.value = liveChannels.value
          .filter(channel => favorites.value.includes(channel.user_id))
          .sort((a, b) => b.viewer_count - a.viewer_count);
      };
  
      const addStreamer = (channelLogin) => {
        const currentStreamers = route.params.streamers || '';
        const streamersArray = currentStreamers.split('.').filter(Boolean);
  
        if (!streamersArray.includes(channelLogin)) {
          streamersArray.push(channelLogin);
        }
  
        router.push({ name: 'multi-streamers', params: { streamers: streamersArray.join('.') } })
          .then(() => {
            window.location.reload();
          });
      };
  
      const isFavorite = (channelId) => {
        return favorites.value.includes(channelId);
      };
  
      const toggleFavorite = (channelId) => {
        const userInfo = JSON.parse(localStorage.getItem('twitch_user_info'));
        const accessToken = localStorage.getItem('twitch_access_token');
  
        if (isFavorite(channelId)) {
          favorites.value = favorites.value.filter(id => id !== channelId);
          updateFavoritesList();
  
          fetch(`http://localhost:3000/deleteFavorites/${userInfo.user_id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ favoriteId: channelId }),
          })
          .then(response => response.json())
          .then(data => {
            console.log('Favorite deleted', data);
          })
          .catch(error => {
            console.error('Erreur lors de la suppression du favori:', error);
          });
        } else {
          favorites.value.push(channelId);
          updateFavoritesList();
  
          fetch(`http://localhost:3000/addFavorites/${userInfo.user_id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ favoriteId: channelId }),
          })
          .then(response => response.json())
          .then(data => {
            console.log('Favorite added', data);
          })
          .catch(error => {
            console.error('Erreur lors de l\'ajout du favori:', error);
          });
        }
      };
  
      onMounted(() => {
        fetchLiveChannels();
      });
  
      return {
        liveChannels,
        favoritesList,
        addStreamer,
        toggleFavorite,
        isFavorite
      };
    }
  };
  </script>
  
  <style scoped>
  .live-channels-sidebar {
    width: 250px;
    background-color: #f7f7f7;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 100px;
    left: 0;
    height: calc(100% - 100px);
    overflow-y: auto;
  }
  
  h2 {
    font-size: 18px;
    color: #9146ff;
    text-align: center;
    margin-bottom: 20px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .channel-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .channel-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: black;
  }
  
  .thumbnail {
    width: 80px;
    height: 45px;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  .channel-info {
    display: flex;
    flex-direction: column;
  }
  
  .channel-name {
    font-weight: bold;
    font-size: 14px;
    margin: 0;
  }
  
  .viewers {
    font-size: 12px;
    color: #888;
    margin: 5px 0 0;
  }
  
  .favorite-star {
    margin-left: auto;
    font-size: 20px;
    cursor: pointer;
    color: #ddd;
  }
  
  .favorite-star.favorited {
    color: gold;
  }
  </style>
  