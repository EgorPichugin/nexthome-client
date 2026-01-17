<script lang="ts" setup>

import { useAuthUser } from '~/composables/useAuthUser';
import UserInfoCard from '~/components/UserInfoCard/UserInfoCard.vue';

const { user } = useAuthUser();

</script>

<template>
  <UserCard
    v-if="user && user.isCompleted"
    v-model="user"
  />

  <UserInfoCard
    v-else-if="user && !user.isCompleted"
    v-model="user"
    :mode="'edit'"
  />
</template>
