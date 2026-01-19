<script setup lang="ts">

import HomeView from '~/components/HomeView/HomeView.vue'
import SpinLoader from '~/components/SpinLoader/SpinLoader.vue'
import { useAuthUser } from '~/composables/useAuthUser'

const { isAuthenticated, isLoading, user } = useAuthUser();
</script>

<template>
  <ClientOnly>
    <SpinLoader v-if="isLoading || (isAuthenticated && !user)" 
      class="flex min-h-[60vh] items-center justify-center"/>
    <InformationForGuest v-else-if="!isAuthenticated" />
    <HomeView v-else />
  </ClientOnly>
</template>
