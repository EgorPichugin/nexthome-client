<script setup lang="ts">
import { NImage } from 'naive-ui'
import { NButton } from 'naive-ui';
import { accessToken, api, currentUser } from '~/utils/api'

const isLoginDialogVisible = ref(false)
const isRegisterDialogVisible = ref(false)

const isAuthenticated = computed<boolean>(() => Boolean(accessToken.value))

function handleLogoutAction() {
  api.logout()
}
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-white">
    <header
      class="sticky top-0 z-10 mx-auto flex max-w-5xl items-center justify-between px-4 py-4
             bg-neutral-900/80 backdrop-blur">
      <div class="flex items-center gap-3 cursor-pointer">
        <n-image
          width="220"
          src="/images/NextHome.jpeg"
          preview-disabled
        />
      </div>

      <div class="flex items-center gap-3">
        <template v-if="!isAuthenticated">
          <n-button @click="isLoginDialogVisible = true">
            Login
          </n-button>
          <n-button @click="isRegisterDialogVisible = true">
            Register
          </n-button>
        </template>

        <template v-else>
          <n-button @click="handleLogoutAction">
            Logout
          </n-button>
        </template>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4">
      <slot />
    </main>

    <UserLoginDialog
      v-model="isLoginDialogVisible"/>

    <UserRegistrationDialog
      v-model="isRegisterDialogVisible"/>
  </div>
</template>
