<script setup lang="ts">
import { type FormInst, type FormRules, NModal, NForm, NFormItem, NInput, NButton, useMessage, NCard } from 'naive-ui';
import { cloneDeep } from 'lodash-es'
import type { CreateCardRequest } from '~/utils/Requests/CreateCardRequest';
import type { UpdateCardRequest } from '~/utils/Requests/UpdateCardRequest';
import type { CardResponse } from '~/utils/Responses/CardResponse';

const { getUserErrorMessages } = useApiError();
const message = useMessage();

const isVisible = defineModel<boolean>({required: true});

const props = defineProps<{
    card: CreateCardRequest | UpdateCardRequest;
    userId: string;
    cardType: 'experience' | 'challenge';
    mode: 'edit' | 'create';
}>();

const emit = defineEmits<{
  (event: 'refresh'): void;
}>();

const isEditingMode = computed(() => props.mode === 'edit');
const isLoading = ref<boolean>(false);
const draftCard = ref<CreateCardRequest | UpdateCardRequest | null>(null);
const formRef = ref<FormInst | null>(null);

const createApiMap = {
  experience: api.createExperienceCard,
  challenge: api.createChallengeCard
};

const updateApiMap = {
  experience: api.updateExperienceCard,
  challenge: api.updateChallengeCard
};

watchEffect(() => {
  draftCard.value = isVisible.value
    ? cloneDeep(props.card)
    : null;
});

const rules: FormRules = {
  title: {
    required: true,
    message: 'Please input the title',
    trigger: ['blur', 'input']
  },
  description: {
    required: true,
    message: 'Please input the description',
    trigger: ['blur', 'input']
  }
};

async function handleConfirmAction(event: MouseEvent) {
    event.preventDefault();
    if (isLoading.value || !draftCard || !draftCard.value) return;

    
    try {
        await formRef.value?.validate();
        isLoading.value = true;
        let response: CardResponse | undefined;
        if (!isEditingMode.value) {
            response = await handleCreateCard();
        }
        else {
            response = await handleUpdateCard();
        }
        if (!response) throw new Error('No response from server');
        message.success(`Card ${isEditingMode.value ? 'updated' : 'created'} successfully`);
        isLoading.value = false;
        isVisible.value = false;
        emit('refresh');
    } catch (error: any) {
        if (Array.isArray(error)) return
        const errorMessages = getUserErrorMessages(error);
        for (const errorMessage of errorMessages) {
            message.error(errorMessage);
        }
    }
}

async function handleCreateCard() {
  return createApiMap[props.cardType](
    props.userId,
    draftCard.value as CreateCardRequest
  );
}

async function handleUpdateCard() {
  const cardId = (props.card as UpdateCardRequest).cardId;
  return updateApiMap[props.cardType](
    props.userId,
    cardId,
    draftCard.value as UpdateCardRequest
  );
}
</script>

<template>
    <n-modal
        v-model:show="isVisible">
        <n-card
            style="width: 600px"
            :title="isEditingMode ? 'Edit Card' : 'Create Card'"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true">
                <n-form v-if="draftCard"
                  ref="formRef"
                  :label-width="80"
                  :model="draftCard"
                  :rules="rules"
                  :size="'medium'"
                  autocomplete="off">
                    <div class="space-y-4">
                        <n-form-item label="Title" path="title">
                            <n-input v-model:value="draftCard.title" placeholder="Enter title" />
                        </n-form-item>
                        <n-form-item label="Description" path="description">
                            <n-input
                                type="textarea"
                                v-model:value="draftCard.description"
                                placeholder="Enter description"
                                :rows="6"
                            />
                        </n-form-item>
                    </div>

                    <div class="mt-8 flex justify-end gap-3">
                        <n-button
                            :disabled="isLoading"
                            @click="isVisible = false">
                            Cancel
                        </n-button>
                        <n-button
                            type="primary"
                            :loading="isLoading"
                            @click="handleConfirmAction">
                            {{ isLoading ? 'Loading...' : 'Save' }}
                        </n-button>
                    </div>
                </n-form>
        </n-card>
    </n-modal>
</template>