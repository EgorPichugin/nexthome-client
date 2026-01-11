<script setup lang="ts">
import { NCard, NText, NButton, NDivider, useMessage } from 'naive-ui'
import { ref, computed } from 'vue'
import { api } from '~/utils/api';
import type { UpdateCardRequest } from '~/utils/Requests/UpdateCardRequest';
import type { CardResponse } from '~/utils/Responses/CardResponse';

const message = useMessage();

const props = defineProps<{
    cardType: 'experience' | 'challenge',
    card: CardResponse,
    userId: string
}>();

const expanded = ref<boolean>(false)
const isLoading = ref<boolean>(false);
const isEditCardDialogVisible = ref<boolean>(false);

const shortDescription = computed(() => {
  if (expanded.value) return props.card.description
  return props.card.description.length > 150
    ? props.card.description.slice(0, 150) + '…'
    : props.card.description
})

const emit = defineEmits<{
  (event: 'refresh'): void;
}>();

function handleEditCardAction() {
    isEditCardDialogVisible.value = true;
}

async function handleDeleteCardAction() {
    isLoading.value = true;
    if (props.cardType === 'experience') {
      await api.deleteExperienceCardById(props.userId, props.card.cardId);
    } else if (props.cardType === 'challenge') {
      await api.deleteChallengeCardById(props.userId, props.card.cardId);
    }
    message.success('Card deleted successfully');
    emit('refresh');
    isLoading.value = false;
}

async function findExperienceCards() {
  console.log('Finding experience cards...');
  //TODO: Implement the logic to find experience cards here
}
</script>

<template>
  <div class="experience-card-wrap">
      <n-card
      hoverable
      size="medium"
      class="experience-card"
      >
      <template #header>
          <n-text strong>
          {{ card.title }}
          </n-text>
          <n-divider />
      </template>
      <n-text depth="3">
          {{ shortDescription }}
      </n-text>

      <template #footer>
          <div class="experience-card-footer">
          <n-button
              v-if="card.description.length > 150"
              text
              type="primary"
              size="small"
              class="experience-card-showmore"
              @click="expanded = !expanded"
          >
              {{ expanded ? 'Hide' : 'Show more' }}
          </n-button>

          <div class="experience-card-footer-actions">
              <n-button size="small" :disabled="isLoading" @click="handleEditCardAction">
                Edit
              </n-button>
              <n-button size="small" type="error" :loading="isLoading" secondary @click="handleDeleteCardAction">
                Delete
              </n-button>
              <n-button v-if="props.cardType === 'challenge'" size="small" type="primary" :loading="isLoading" secondary @click="findExperienceCards">
                Find Experiences
              </n-button>
          </div>
          </div>
      </template>
      </n-card>
  </div>

  <CardDialog 
      v-model="isEditCardDialogVisible" 
      :card="card as UpdateCardRequest" 
      :user-id="userId" 
      :mode="'edit'"
      :card-type="cardType"
      @refresh="emit('refresh')"/>
</template>

<style scoped>
.experience-card-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.experience-card {
  width: 100%;
  max-width: 1000px;
}

.experience-card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.experience-card-showmore {
  margin-right: auto;
}

.experience-card-footer-actions {
  display: flex;
  gap: 8px;
}
</style>
