<script setup lang="ts"> 
  import { darkTheme } from 'naive-ui'
  import { NConfigProvider } from 'naive-ui'
  import { NMessageProvider } from 'naive-ui'

</script>

<template>
  <n-config-provider :theme="darkTheme">
    <div class="min-h-screen bg-neutral-700"> 
      <n-message-provider>
        <NuxtPage />
      </n-message-provider>
    </div>
  </n-config-provider>
</template>
