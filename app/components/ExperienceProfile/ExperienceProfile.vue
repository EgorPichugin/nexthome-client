<script lang="ts" setup>
import { type ExperienceCardResponse } from '~/utils/Responses/ExperienceCardResponse';
import type { UserResponse } from '~/utils/Responses/UserResponse';
import { NSpace } from 'naive-ui';
import ExperienceCardItem from '~/components/ExperienceCardItem/ExperienceCardItem.vue';

const user = defineModel<UserResponse>({required: true});
const cards = defineModel<ExperienceCardResponse[]>('cards', {required: false});

defineEmits<{
  (event: 'refresh'): void;
}>();
</script>

<template>

<n-space vertical size="large" style="width: 100%;">
    <div v-if="cards && cards.length > 0">
        <ExperienceCardItem
            v-for="card in cards"
            :card="card"
            :key="card.cardId"
            :user-id="user.userId"
            @refresh="$emit('refresh')"
        />
    </div>
    <div v-else class="flex w-full justify-center py-8">
      <span class="text-gray-500">You have not added any experience cards yet.</span>
    </div>
</n-space>

</template>