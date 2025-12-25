<script setup lang="ts">
import { NForm, useMessage } from 'naive-ui';
import { NModal } from 'naive-ui';
import { NCard } from 'naive-ui';
import { NFormItem } from 'naive-ui';
import { NInput } from 'naive-ui';
import { NButton } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui'
import type { UserLoginRequest } from '~/utils/api';
import { api } from '~/utils/api';

const isVisible = defineModel<boolean>({required: true});
const loginRequest = reactive<UserLoginRequest>({
  email: '',
  password: ''
})
const formRef = ref<FormInst | null>(null);
const message = useMessage()
const size = ref<'small' | 'medium' | 'large'>('medium')
function handleCloseAction() {
    isVisible.value = false;
    Object.assign(loginRequest, {
      email: '',
      password: ''
    })
}

function handleConfirmAction(event: MouseEvent) {
  event.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
        let response = await api.loginUser(loginRequest)
        message.success('Login successfully');
        handleCloseAction();
    }
    else {
        console.log(errors);
        message.error('Invalid');
    }
  })
}

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
    <n-modal v-model:show="isVisible">
        <n-card
        style="width: 600px"
        title="Modal"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        @close="handleCloseAction">
            <n-form
                ref="formRef"
                :label-width="80"
                :model="loginRequest"
                :rules="rules"
                :size="size">

            <div class="space-y-4">
                <n-form-item label="Email" path="email">
                    <n-input v-model:value="loginRequest.email" placeholder="Input Email" class="w-full" />
                </n-form-item>
                <n-form-item label="Password" path="password">
                    <n-input v-model:value="loginRequest.password" placeholder="Input Password" class="w-full" type="password" />
                </n-form-item>
            </div>
            <div class="mt-8 flex justify-end gap-3">
                <n-button @click="handleCloseAction" secondary>
                  Cancel
                </n-button>
                <n-button @click="handleConfirmAction" type="primary">
                  Login
                </n-button>
              </div>
            </n-form>
        </n-card>
    </n-modal>
</template>