<script lang="ts" setup>
import type { UserResponse } from '~/utils/Responses/UserResponse';
import { NSpace } from 'naive-ui';
import CardItem from '~/components/CardItem/CardItem.vue';
import type { CardResponse } from '~/utils/Responses/CardResponse';

const user = defineModel<UserResponse>({required: true});
const cards = defineModel<CardResponse[]>('cards', {required: false});

defineProps<{
  cardType: 'experience' | 'challenge'
}>();

defineEmits<{
  (event: 'refresh'): void;
}>();
</script>

<template>

<n-space vertical size="large" style="width: 100%;">
    <div v-if="cards && cards.length > 0" class="grid gap-4">
        <CardItem
            v-for="card in cards"
            :card="card"
            :key="card.cardId"
            :user-id="user.userId"
            :card-type="cardType"
            @refresh="$emit('refresh')"
        />
    </div>
    <div v-else class="flex w-full justify-center py-8">
      <span class="text-gray-500">You have not added any cards yet.</span>
    </div>
</n-space>

</template>