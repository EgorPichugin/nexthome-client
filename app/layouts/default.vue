<script setup lang="ts">
import { NImage } from 'naive-ui'
import { NButton } from 'naive-ui';
import { api } from '~/utils/api'
import UserEditDialog from '~/components/UserEditDialog/UserEditDialog.vue';
import { type UserResponse } from '~/utils/Responses/UserResponse';
import type { CountryResponse } from '~/utils/Responses/CountryResponse';
import { useAuthStore } from '~/stores/authStore';
import { storeToRefs } from 'pinia'

const authStore = useAuthStore();
const { accessToken } = storeToRefs(authStore);
const { logout } = authStore;
const isLoginDialogVisible = ref(false)
const isRegisterDialogVisible = ref(false)
const isAuthenticated = computed<boolean>(() => Boolean((accessToken.value ?? '').trim()))
const newUser = ref<UserResponse>(<UserResponse>{
  userId: '',
  email: '',
  firstName: '',
  lastName: '',
  country: '',
  city: '',
});
  
const countries = ref<CountryResponse[]>([]);
async function handleOpenRegisterDialog() {
  countries.value = await api.fetchCountries();
  isRegisterDialogVisible.value = true;
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
          <n-button @click="handleOpenRegisterDialog">
            Register
          </n-button>
        </template>

        <template v-else>
          <n-button @click="logout">
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

    <UserEditDialog
      mode="register"
      v-model="isRegisterDialogVisible"
      v-model:user="newUser" 
      v-model:countries="countries"/>
  </div>
</template>
