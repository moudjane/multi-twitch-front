<template>
  <div class="channel-card" :class="{ 'is-favorite': isFavorite }">
    <div class="channel-thumbnail">
      <img :src="thumbnailUrl" :alt="channel.user_name + ' thumbnail'" />
      <div class="viewer-count">
        <span class="viewer-icon">👁️</span>
        {{ formatViewerCount(channel.viewer_count) }}
      </div>
    </div>
    <div class="channel-info">
      <h4 class="channel-name">{{ channel.user_name }}</h4>
      <p class="game-name">{{ channel.game_name }}</p>
    </div>
    <div class="channel-actions">
      <button @click="$emit('add-streamer', channel.user_login)" class="action-button watch-button">
        Regarder
      </button>
      <button @click="$emit('toggle-favorite', channel.user_id)" class="action-button favorite-button">
        {{ isFavorite ? '★' : '☆' }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ChannelCard',
  props: {
    channel: {
      type: Object,
      required: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  emits: ['add-streamer', 'toggle-favorite'],
  setup(props) {
    const thumbnailUrl = computed(() => 
      props.channel.thumbnail_url.replace('{width}', '320').replace('{height}', '180')
    );

    const formatViewerCount = (count) => {
      if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
      } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
      }
      return count.toString();
    };

    return {
      thumbnailUrl,
      formatViewerCount
    };
  }
};
</script>

<style scoped>
.channel-card {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.channel-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.channel-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
}

.channel-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.viewer-count {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.viewer-icon {
  margin-right: 4px;
  font-size: 14px;
}

.channel-info {
  padding: 10px;
}

.channel-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-name {
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.8;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.channel-actions {
  display: flex;
  padding: 0 10px 10px;
}

.action-button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.watch-button {
  background-color: var(--primary-color);
  color: white;
  margin-right: 5px;
}

.watch-button:hover {
  background-color: var(--secondary-color);
}

.favorite-button {
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--text-color);
}

.favorite-button:hover {
  background-color: var(--text-color);
  color: var(--background-color);
}

.is-favorite .favorite-button {
  background-color: gold;
  color: var(--text-color);
  border: none;
}

.is-favorite .favorite-button:hover {
  background-color: #ffd700;
}
</style>