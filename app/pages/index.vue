<script setup lang="ts">
import UserCard from '~/components/UserCard/UserCard.vue';
import { useAuthStore } from '~/stores/authStore';

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);
</script>

<template>
    <template v-if="currentUser">
        <UserCard v-model="currentUser" />
    </template>
    <template v-else>
        <InformationForGuest/>  
    </template>
</template>