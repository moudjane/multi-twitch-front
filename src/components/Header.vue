<template>
    <header class="header">
        <h1 class="header-title">Multi-Twitch Viewer</h1>
        <div class="header-actions">
            <div v-if="isAuthenticated">
                <button @click="goToFollowers" class="followers-button">Voir les chaînes suivies</button>
                <span>Connecté en tant que : {{ userLogin }}</span>
                <button @click="logout" class="logout-button">Se déconnecter</button>
            </div>
            <div v-else>
                <router-link to="/login" class="login-link">Se connecter</router-link>
            </div>
        </div>
    </header>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Header',
    setup() {
        const isAuthenticated = ref(false);
        const userLogin = ref('');
        const router = useRouter();

        // Fonction pour vérifier l'authentification
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

        // Fonction de déconnexion
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
    padding: 10px 20px;
    background-color: #9146ff;
    color: white;
}

.header-title {
    font-size: 24px;
}

.header-actions {
    display: flex;
    align-items: center;
}

.login-link,
.logout-button,
.followers-button {
    background-color: transparent;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

.logout-button {
    margin-left: 20px;
    background-color: #ff4f4f;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
}

.logout-button:hover {
    background-color: #ff3b3b;
}

.followers-button {
    margin-left: 20px;
    background-color: #9146ff;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
}

.followers-button:hover {
    background-color: #772ce8;
}
</style>