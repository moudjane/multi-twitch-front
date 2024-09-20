<template>
  <main>
    <h1>Connexion en cours...</h1>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const hash = window.location.hash

  if (hash) {
    const tokenFragment = hash.substring(1)
    const params = new URLSearchParams(tokenFragment)
    const accessToken = params.get('access_token')

    if (accessToken) {
      fetch('http://localhost:3000/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: accessToken }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Token handled by backend', data)

        localStorage.setItem('twitch_access_token', accessToken)
        localStorage.setItem('twitch_user_info', JSON.stringify({
          client_id: data.client_id,
          login: data.login,
          scopes: data.scopes,
          user_id: data.user_id,
          expires_in: data.expires_in
        }))

        window.location.href = '/home'
      })
      .catch(error => {
        console.error('Error sending token to backend', error)
        router.push('/login')
      })
    } else {
      console.error('Access token is missing in the URL')
      router.push('/login')
    }
  } else {
    console.error('No hash fragment found in the URL')
    router.push('/login')
  }
})
</script>