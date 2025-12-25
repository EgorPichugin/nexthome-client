<script setup lang="ts">
    import { NButton } from 'naive-ui';
    import { api } from '~/utils/api';
    import { useMessage } from 'naive-ui';

    const message = useMessage();
    const response = ref<string>('');
    async function getAllUsers() {
        try {
            let users = await api.getAllUsers();
            response.value = JSON.stringify(users);
        } catch (e: any) {
            if (e.message === 'NOT_AUTHENTICATED') {
                message.error('You are not authorized user, please login first')
            } else {
                message.error('Something went wrong')
            }
        }
    }
</script>

<template>
    <n-button @click="getAllUsers">
          Show all users
    </n-button>
    response: {{ response }}
</template>