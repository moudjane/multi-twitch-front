<template>
  <div class="live-channels-sidebar" :class="{ 'dark-mode': isDarkMode }">
    <div class="sidebar-header">
      <h2>Chaînes en direct</h2>
      <button @click="$emit('close-sidebar')" class="close-button">×</button>
    </div>

    <div class="category-section">
      <h3>
        <span class="category-icon">⭐</span>
        Favoris
        <span class="channel-count">({{ favoritesList.length }})</span>
      </h3>
      <transition-group name="list" tag="ul">
        <li v-for="channel in favoritesList" :key="channel.user_id" class="channel-item">
          <ChannelCard 
            :channel="channel" 
            @add-streamer="addStreamer" 
            @toggle-favorite="toggleFavorite"
            :isFavorite="true"
          />
        </li>
      </transition-group>
      <p v-if="favoritesList.length === 0" class="empty-message">Aucun favori en live</p>
    </div>

    <div class="category-section">
      <h3>
        <span class="category-icon">🔴</span>
        Chaînes suivies
        <span class="channel-count">({{ liveChannels.length }})</span>
      </h3>
      <transition-group name="list" tag="ul">
        <li v-for="channel in liveChannels" :key="channel.user_id" class="channel-item">
          <ChannelCard 
            :channel="channel" 
            @add-streamer="addStreamer" 
            @toggle-favorite="toggleFavorite"
            :isFavorite="isFavorite(channel.user_id)"
          />
        </li>
      </transition-group>
      <p v-if="liveChannels.length === 0" class="empty-message">Aucune chaîne en direct suivie</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted,  onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStreamsStore } from '../stores/streamsStore';
import ChannelCard from './ChannelCard.vue';

export default {
  name: 'LiveChannels',
  components: {
    ChannelCard
  },
  props: {
    isDarkMode: Boolean
  },
  emits: ['close-sidebar'],
  setup() {
    const liveChannels = ref([]);
    const favorites = ref([]);
    const router = useRouter();
    const streamsStore = useStreamsStore();

    const favoritesList = computed(() => 
      liveChannels.value.filter(channel => favorites.value.includes(channel.user_id))
        .sort((a, b) => b.viewer_count - a.viewer_count)
    );

    const fetchLiveChannels = async () => {
      const userInfo = JSON.parse(localStorage.getItem('twitch_user_info'));
      const accessToken = localStorage.getItem('twitch_access_token');

      if (userInfo && accessToken) {
        try {
          const response = await fetch(`http://localhost:3000/getFollowedLive/${userInfo.user_id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          const data = await response.json();
          liveChannels.value = data.data || [];
        } catch (error) {
          console.error('Erreur lors de la récupération des chaînes en live:', error);
        }

        try {
          const response = await fetch(`http://localhost:3000/getFavorites/${userInfo.user_id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          const data = await response.json();
          favorites.value = data || [];
        } catch (error) {
          console.error('Erreur lors de la récupération des favoris:', error);
        }
      } else {
        console.error('Utilisateur non connecté ou informations manquantes dans le localStorage.');
      }
    };

    const addStreamer = (channelLogin) => {
      streamsStore.addStream(channelLogin);
      const streamers = streamsStore.activeStreams.join('.');
      router.push({ name: 'multi-streamers', params: { streamers } });
    };

    const isFavorite = (channelId) => {
      return favorites.value.includes(channelId);
    };

    const toggleFavorite = async (channelId) => {
      const userInfo = JSON.parse(localStorage.getItem('twitch_user_info'));
      const accessToken = localStorage.getItem('twitch_access_token');

      if (isFavorite(channelId)) {
        favorites.value = favorites.value.filter(id => id !== channelId);
        try {
          await fetch(`http://localhost:3000/deleteFavorites/${userInfo.user_id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ favoriteId: channelId }),
          });
        } catch (error) {
          console.error('Erreur lors de la suppression du favori:', error);
        }
      } else {
        favorites.value.push(channelId);
        try {
          await fetch(`http://localhost:3000/addFavorites/${userInfo.user_id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ favoriteId: channelId }),
          });
        } catch (error) {
          console.error('Erreur lors de l\'ajout du favori:', error);
        }
      }
    };

    onMounted(fetchLiveChannels);

    // Rafraîchir les données toutes les 5 minutes
    const refreshInterval = setInterval(fetchLiveChannels, 5 * 60 * 1000);

    // Nettoyer l'intervalle lors de la destruction du composant
    onUnmounted(() => {
      clearInterval(refreshInterval);
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
  background-color: var(--background-color);
  color: var(--text-color);
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  transition: all 0.3s ease;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sidebar-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-color);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.close-button:hover {
  transform: scale(1.1);
}

.category-section {
  margin-bottom: 30px;
}

.category-section h3 {
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-bottom: 15px;
  color: var(--secondary-color);
}

.category-icon {
  margin-right: 10px;
  font-size: 20px;
}

.channel-count {
  margin-left: 10px;
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.7;
}

ul {
  list-style: none;
  padding: 0;
}

.channel-item {
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.empty-message {
  font-style: italic;
  opacity: 0.7;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Scrollbar styling */
.live-channels-sidebar::-webkit-scrollbar {
  width: 8px;
}

.live-channels-sidebar::-webkit-scrollbar-track {
  background: var(--background-color);
}

.live-channels-sidebar::-webkit-scrollbar-thumb {
  background-color: var(--primary-color);
  border-radius: 4px;
}

.live-channels-sidebar::-webkit-scrollbar-thumb:hover {
  background-color: var(--secondary-color);
}
</style>