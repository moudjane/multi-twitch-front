<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const token = ref('')
const userInfo = ref({})

const router = useRouter()

onMounted(() => {
  const hash = window.location.hash

  if (hash) {
    const tokenFragment = hash.substring(1)
    const params = new URLSearchParams(tokenFragment)
    const accessToken = params.get('access_token')

    if (accessToken) {
      token.value = accessToken

      fetch('http://localhost:3000/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.value }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Token handled by backend', data)

        // Stocker les infos dans le localStorage
        localStorage.setItem('twitch_access_token', token.value)
        localStorage.setItem('twitch_user_info', JSON.stringify({
          client_id: data.client_id,
          login: data.login,
          scopes: data.scopes,
          user_id: data.user_id,
          expires_in: data.expires_in
        }))
        userInfo.value = {
          client_id: data.client_id,
          login: data.login,
          scopes: data.scopes,
          user_id: data.user_id,
          expires_in: data.expires_in
        }

        router.replace({ path: '/home' })
      })
      .catch(error => {
        console.error('Error sending token to backend', error)
      })
    } else {
      console.error('Access token is missing in the URL')
    }
  } else {
    console.error('No hash fragment found in the URL')
  }
})
</script>

<template>
  <main>
    <h1>Callback</h1>
    <p>Token: {{ token }}</p>
    <p>User Info: {{ userInfo }}</p>
  </main>
</template>
