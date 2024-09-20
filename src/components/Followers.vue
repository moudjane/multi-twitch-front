<template>
    <div class="followers-container">
      <h1>Chaînes suivies par {{ userLogin }}</h1>
      <ul v-if="followers.length > 0">
        <li v-for="(follower, index) in followers" :key="index">
          <p><strong>{{ follower.broadcaster_name }}</strong> ({{ follower.broadcaster_login }})</p>
          <p>Suivi depuis : {{ new Date(follower.followed_at).toLocaleDateString() }}</p>
        </li>
      </ul>
      <p v-else>Aucune chaîne suivie trouvée.</p>
      
      <button v-if="hasMore" @click="loadMoreFollowers" class="load-more-btn">
        Charger plus
      </button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'Followers',
    setup() {
      const followers = ref([]);
      const userLogin = ref('');
      const paginationCursor = ref(null);
      const hasMore = ref(false);
  
      const fetchFollowers = (userId, accessToken, cursor = null) => {
        console.log('fetchFollowers', userId, accessToken, cursor);
        let url = `http://localhost:3000/getFollowed/${userId}`;
        if (cursor) {
          url += `?cursor=${cursor}`;
        }
  
        return fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        .then(response => response.json());
      };
  
      const loadMoreFollowers = () => {
        const userInfo = JSON.parse(localStorage.getItem('twitch_user_info'));
        const accessToken = localStorage.getItem('twitch_access_token');
  
        if (userInfo && accessToken) {
          fetchFollowers(userInfo.user_id, accessToken, paginationCursor.value)
            .then(data => {
              followers.value = [...followers.value, ...data.data];
              paginationCursor.value = data.pagination?.cursor || null;
              hasMore.value = !!paginationCursor.value;
            })
            .catch(error => {
              console.error('Erreur lors de la récupération des chaînes suivies:', error);
            });
        } else {
          console.error('Utilisateur non connecté ou informations manquantes dans le localStorage.');
        }
      };
  
      onMounted(() => {
        const userInfo = JSON.parse(localStorage.getItem('twitch_user_info'));
        const accessToken = localStorage.getItem('twitch_access_token');
  
        if (userInfo && accessToken) {
          userLogin.value = userInfo.login;
          loadMoreFollowers();
        } else {
          console.error('Utilisateur non connecté ou informations manquantes dans le localStorage.');
        }
      });
  
      return {
        followers,
        userLogin,
        hasMore,
        loadMoreFollowers
      };
    }
  };
  </script>
  
  <style scoped>
  .followers-container {
    padding: 20px;
  }
  
  h1 {
    color: #9146ff;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    background-color: #f0f0f0;
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
  }
  
  li p {
    margin: 5px 0;
  }
  
  .load-more-btn {
    background-color: #9146ff;
    color: white;
    border: none;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
  }
  
  .load-more-btn:hover {
    background-color: #772ce8;
  }
  </style>
  