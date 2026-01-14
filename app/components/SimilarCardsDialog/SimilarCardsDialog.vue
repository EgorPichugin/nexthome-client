<script lang="ts" setup>
import type { CardResponse } from '~/utils/Responses/CardResponse';
import { NModal, NCard, NButton } from 'naive-ui';
import CardsSpace from '../CardsSpace/CardsSpace.vue';
import type { UserResponse } from '~/utils/Responses/UserResponse';

const isVisible = defineModel<boolean>({required: true});
const similarCards = defineModel<CardResponse[] | null>('cards', {required: true});
const user = defineModel<UserResponse>('user', {required: true});

watch(() => isVisible.value, (newValue) => {
  if (!newValue) {
    similarCards.value = null;
  }
});
</script>

<template>
    <n-modal
        v-model:show="isVisible">
        <n-card
            style="width: 1000px"
            :title="'Found experience cards similar to your challenge card'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true">
            <CardsSpace v-if="similarCards && similarCards.length > 0"
                v-model="user"
                v-model:cards="similarCards"
                card-type="experience"
                :readonly="true"/>
            <div v-else class="flex w-full justify-center py-8">
                <span class="text-gray-500">There are no similar experience cards found. Try it later.</span>
            </div>
            <template #footer>
                <n-button size="small" @click="isVisible = false">
                    Close
                </n-button>
            </template>
        </n-card>
    </n-modal>
</template>