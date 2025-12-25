<script setup lang="ts">
    import { NImage } from 'naive-ui';
    import { NButton } from 'naive-ui';
    import { api } from '~/utils/api';
    import type { UserRegisterRequest } from '~/utils/api';

    const isRegisterDialogVisible = ref<boolean>(false);
    const isLoginDialogVisible = ref<boolean>(false);
    
    async function handleConfirmAction(request: UserRegisterRequest) {
        let response = await api.registerUser(request)
    }
</script>

<template>
  <div>
    <n-image
        width="300"
        src="/images/NextHome.jpeg"/>
    <n-button type="primary" @click="isRegisterDialogVisible = true">
      Regtister
    </n-button>

    <UserRegistrationDialog
        v-model="isRegisterDialogVisible"
        @confirm="handleConfirmAction" />

    <main>
      <slot />
    </main>
  </div>
</template>
