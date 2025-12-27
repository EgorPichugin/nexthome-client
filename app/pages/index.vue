<script setup lang="ts">
import { NButton } from 'naive-ui';
import { api } from '~/utils/api';
import { useMessage } from 'naive-ui';
import type { UserResponse } from '~/utils/Responses/UserResponse';
import { useApiError } from '~/composables/useApiError';

const { getUserErrorMessage } = useApiError()
const message = useMessage();
const response = ref<string>('');
async function getAllUsers() {
    let users: UserResponse[];
    try {
        let users = await api.getAllUsers();
        response.value = JSON.stringify(users, null, 2);
    } catch (error: any) {
        message.error(getUserErrorMessage(error));
    }
}
</script>

<template>
    <n-button @click="getAllUsers">
        Show all users
    </n-button>
    response: {{ response }}
</template>