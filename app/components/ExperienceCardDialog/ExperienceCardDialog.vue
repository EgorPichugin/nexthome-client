<script setup lang="ts">
import { type FormInst, type FormRules, NModal, NForm, NFormItem, NInput, NButton, useMessage, NCard } from 'naive-ui';
import type { ExperienceCardResponse } from '~/utils/Responses/ExperienceCardResponse';
import { cloneDeep } from 'lodash-es'
import type { ExperienceCardCreateRequest } from '~/utils/Requests/ExperienceCardCreateRequest';
import type { ExperienceCardUpdateRequest } from '~/utils/Requests/ExperienceCardUpdateRequest';

const { getUserErrorMessages } = useApiError();
const message = useMessage();

const isVisible = defineModel<boolean>({required: true});

const props = defineProps<{
    card: ExperienceCardCreateRequest | ExperienceCardUpdateRequest;
    userId: string;
    mode: 'edit' | 'create';
}>();

const emit = defineEmits<{
  (event: 'refresh'): void;
}>();

const isEditingMode = computed(() => props.mode === 'edit');
const isLoading = ref<boolean>(false);
const draftCard = ref<ExperienceCardCreateRequest | ExperienceCardUpdateRequest | null>(null);
const formRef = ref<FormInst | null>(null);

watch(() => isVisible.value, (newValue) => {
  if (newValue) {
    draftCard.value = {
      ...cloneDeep(props.card)
    };
  } else {
    draftCard.value = null;
  }
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

    isLoading.value = true;

    try {
        await formRef.value?.validate();
        let response: ExperienceCardResponse | undefined;
        if (!isEditingMode.value) {
            response = await handleCreateExperienceCard();
        }
        else {
            response = await handleUpdateExperienceCard();
        }
        if (!response) throw new Error('No response from server');
        message.success(`Experience card ${isEditingMode.value ? 'updated' : 'created'} successfully`);
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

async function handleCreateExperienceCard(): Promise<ExperienceCardResponse | undefined> {
    try {
        let response = await api.createExperienceCard(props.userId, draftCard.value as ExperienceCardCreateRequest);
        return response;
    } catch (error: any) {
        const errorMessages = getUserErrorMessages(error);
        for (const errorMessage of errorMessages) {
            message.error(errorMessage);
        }
    }
}

async function handleUpdateExperienceCard(): Promise<ExperienceCardResponse | undefined> {
    try {
        let response = await api.updateExperienceCard(props.userId, (props.card as ExperienceCardUpdateRequest).cardId, draftCard.value! as ExperienceCardUpdateRequest);
        return response;
    } catch (error: any) {
        const errorMessages = getUserErrorMessages(error);
        for (const errorMessage of errorMessages) {
            message.error(errorMessage);
        }
    }
}
</script>

<template>
    <n-modal
        v-model:show="isVisible">
        <n-card
            style="width: 600px"
            :title="isEditingMode ? 'Edit Experience Card' : 'Create Experience Card'"
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