<script setup lang="ts">
import { NImage, NButton } from 'naive-ui'

const isLoginDialogVisible = ref(false)
const isRegisterDialogVisible = ref(false)
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-white">
    <!-- Header -->
    <header
      class="sticky top-0 z-10 mx-auto flex max-w-5xl items-center justify-between px-4 py-4
             bg-neutral-900/80 backdrop-blur"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 cursor-pointer">
        <n-image
          width="220"
          src="/images/NextHome.jpeg"
          preview-disabled
        />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <n-button @click="isLoginDialogVisible = true">
          Login
        </n-button>
        <n-button @click="isRegisterDialogVisible = true">
          Register
        </n-button>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4">
      <slot />
    </main>

    <UserLoginDialog
      v-model="isLoginDialogVisible"
    />

    <UserRegistrationDialog
      v-model="isRegisterDialogVisible"
    />
  </div>
</template>
