<script setup lang="ts">
import { NForm, useMessage } from 'naive-ui';
import { NModal } from 'naive-ui';
import { NCard } from 'naive-ui';
import { NFormItem } from 'naive-ui';
import { NInput } from 'naive-ui';
import { NButton } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui'
import type { UserRegisterRequest } from '~/utils/api';

const isVisible = defineModel<boolean>({required: true});
const registerRequest = reactive<UserRegisterRequest>({
  email: '',
  password: '',
  firstName: '',
  lastName: ''
})
const formRef = ref<FormInst | null>(null);
const message = useMessage()
const size = ref<'small' | 'medium' | 'large'>('medium')
function handleCloseAction() {
    isVisible.value = false;
    Object.assign(registerRequest, {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    })
}

const emit = defineEmits<{
  (event: 'confirm', request: UserRegisterRequest): void
}>()

function handleConfirmAction(event: MouseEvent) {
  event.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
        emit('confirm', registerRequest);
        message.success('Valid');
        handleCloseAction();
    }
    else {
        console.log(errors);
        message.error('Invalid');
    }
  })
}

const rules: FormRules = {
  firstName: {
    required: true,
    message: 'Please input your name',
    trigger: ['input', 'blur']
  },
  lastName: {
    required: true,
    message: 'Please input your surname',
    trigger: ['input', 'blur']
  },
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
                :model="registerRequest"
                :rules="rules"
                :size="size">

              <div class="space-y-4">
                    <n-form-item label="Name" path="firstName">
                  <n-input v-model:value="registerRequest.firstName" placeholder="Input Name" class="w-full" />
                    </n-form-item>
                    <n-form-item label="Surname" path="lastName">
                  <n-input v-model:value="registerRequest.lastName" placeholder="Input Surname" class="w-full" />
                    </n-form-item>
                    <n-form-item label="Password" path="password">
                  <n-input v-model:value="registerRequest.password" placeholder="Input Password" class="w-full" type="password" />
                    </n-form-item>
                    <n-form-item label="Email" path="email">
                  <n-input v-model:value="registerRequest.email" placeholder="Input Email" class="w-full" />
                    </n-form-item>
                </div>
              <div class="mt-6 flex justify-end gap-3">
                <n-button @click="handleCloseAction">
                  Cancel
                </n-button>
                <n-button @click="handleConfirmAction" type="primary">
                  Confirm
                </n-button>
              </div>
            </n-form>
        </n-card>
    </n-modal>
</template>