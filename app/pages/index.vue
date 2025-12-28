<script setup lang="ts">
import { currentUser } from '~/utils/api';
import { useApiError } from '~/composables/useApiError';
import UserCard from '~/components/UserCard/UserCard.vue';

const { getUserErrorMessage } = useApiError()

</script>

<template>
    <template v-if="currentUser">
        <UserCard v-model="currentUser" />
    </template>
    <template v-else>
        HI Guest   
    </template>
</template>