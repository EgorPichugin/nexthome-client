<script setup lang="ts">
import { NImage } from 'naive-ui'
import AuthButtons from '~/components/AuthButtons/AuthButtons.client.vue'
import { ETab } from '~/components/UserCard/ETab'

function handleLogoClick() {
  const selectedTab = useState<ETab>('userCardTab')
  selectedTab.value = ETab.Profile
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-white">
    <header
      class="sticky top-0 z-10 mx-auto flex max-w-5xl items-center justify-between
             px-4 py-4 bg-neutral-900/80 backdrop-blur"
    >
      <div class="flex items-center gap-3 cursor-pointer" @click="handleLogoClick">
        <n-image
          width="220"
          src="/images/NextHome.jpeg"
          preview-disabled
        />
      </div>

      <ClientOnly>
        <AuthButtons />
      </ClientOnly>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
