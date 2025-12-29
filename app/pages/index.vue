<script setup lang="ts">
import UserCard from '~/components/UserCard/UserCard.vue';
import { useAuthStore } from '~/stores/authStore';

const { currentUser } = useAuthStore()

</script>

<template>
    <template v-if="currentUser">
        <UserCard v-model="currentUser" />
    </template>
    <template v-else>
        <InformationForGuest/>  
    </template>
</template>