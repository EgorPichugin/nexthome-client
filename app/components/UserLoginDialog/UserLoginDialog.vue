<script setup lang="ts">
import { NForm, useMessage } from 'naive-ui';
import { NModal } from 'naive-ui';
import { NCard } from 'naive-ui';
import { NFormItem } from 'naive-ui';
import { NInput } from 'naive-ui';
import { NButton } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui'
import type { UserLoginRequest } from '~/utils/Requests/UserLoginRequest';
import { useApiError } from '~/composables/useApiError';
import { useAuthStore } from '~/stores/authStore';

const message = useMessage();
const { login } = useAuthStore();
const { getUserErrorMessages } = useApiError();

const isVisible = defineModel<boolean>({required: true});

const loginRequest = ref<UserLoginRequest>({
  email: '',
  password: ''
});
const formRef = ref<FormInst | null>(null);
const isLoading = ref<boolean>(false);

async function handleConfirmAction(event: MouseEvent) {
  event.preventDefault()
  if (isLoading.value) return

  isLoading.value = true

  try {
    await formRef.value?.validate()
    await login(loginRequest.value)

    message.success('Login successfully')
    isVisible.value = false
  } catch (error: any) {
    if (Array.isArray(error)) return
    const errorMessages = getUserErrorMessages(error);
    for (const errorMessage of errorMessages) {
      message.error(errorMessage);
    }
  } finally {
    isLoading.value = false
  }
}

watch(() => isVisible.value, (newValue) => {
  if (!newValue) {
  formRef.value?.restoreValidation()
  loginRequest.value.email = ''
  loginRequest.value.password = ''
}
});

const rules: FormRules = {
  password: {
    required: true,
    message: 'Please input your password',
    trigger: ['input', 'blur']
  },
  email: {
    required: true,
    message: 'Please input your email',
    trigger: ['input', 'blur']
  }
}
</script>

<template>
    <n-modal 
    v-model:show="isVisible">
        <n-card
        style="width: 600px"
        title="Login"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true">
        <n-form
            ref="formRef"
            :label-width="80"
          :model="loginRequest"
            :rules="rules"
            :size="'medium'">
          <div class="space-y-4">
            <n-form-item label="Email" path="email">
              <n-input v-model:value="loginRequest.email" :disabled="isLoading" placeholder="Input Email" class="w-full" />
            </n-form-item>
            <n-form-item label="Password" path="password">
              <n-input v-model:value="loginRequest.password" :disabled="isLoading" placeholder="Input Password" class="w-full" type="password" />
            </n-form-item>
          </div>
          <div class="mt-8 flex justify-end gap-3">
            <n-button @click="isVisible = false" :disabled="isLoading" secondary>
              Cancel
            </n-button>
            <n-button @click="handleConfirmAction" :loading="isLoading" type="primary">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </n-button>
          </div>
        </n-form>
        </n-card>
    </n-modal>
</template>