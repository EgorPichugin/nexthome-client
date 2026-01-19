<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useAuthUser } from '~/composables/useAuthUser'

const { auth0, isAuthenticated } = useAuthUser()

const login = () => {
  auth0.loginWithRedirect()
}

const logout = () => {
  auth0.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  })
}
</script>

<template>
  <div class="flex items-center gap-3">
    <n-button v-if="!isAuthenticated" @click="login">
      Login
    </n-button>

    <n-button v-else @click="logout">
      Logout
    </n-button>
  </div>
</template>
