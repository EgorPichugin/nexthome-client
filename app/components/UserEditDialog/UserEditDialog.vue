<script setup lang="ts">
import { NModal, NSelect, NCard, NFormItem, NInput, NButton, NForm, useMessage, type FormInst, type FormRules } from 'naive-ui';
import { useApiError } from '~/composables/useApiError';
import type { UserRegisterRequest } from '~/utils/Requests/UserRegisterRequest';
import type { UserResponse } from '~/utils/Responses/UserResponse';
import { api } from '~/utils/api';
import { cloneDeep } from 'lodash-es'
import type { UserUpdateRequest } from '~/utils/Requests/UserUpdateRequest';
import type { CountryResponse } from '~/utils/Responses/CountryResponse';

type UserFormModel = UserResponse & { password: string };

const { getUserErrorMessages } = useApiError();
const message = useMessage();

const isVisible = defineModel<boolean>({required: true});
const user = defineModel<UserResponse>('user', {required: true});
const countries = defineModel<CountryResponse[]>('countries', {required: true});

const isLoading = ref<boolean>(false);
const draftUser = ref<UserFormModel | null>(null);
const password = ref<string>('');
const formRef = ref<FormInst | null>(null);

const countryOptions = computed(() =>
  countries.value.map((country) => ({
    label: country.name,
    value: country.name,
  }))
);
const isRegisterMode = computed(() => props.mode === 'register');

const props = defineProps<{
  mode: 'register' | 'edit'
}>();

watch(() => isVisible.value, (newValue) => {
  if (newValue) {
    draftUser.value = {
      ...cloneDeep(user.value),
      password: ''
    };
  } else {
    draftUser.value = null;
    password.value = '';
  }
});

async function handleConfirmAction(event: MouseEvent) {
  event.preventDefault()
  if (isLoading.value || !draftUser || !draftUser.value) return

  isLoading.value = true

  try {
    await formRef.value?.validate();
    if (isRegisterMode.value) {
      await handleRegisterRequest();
    } else {
      await handleEditRequest();
    }
  } catch (error: any) {
  if (Array.isArray(error)) return
    const errorMessages = getUserErrorMessages(error);
    for (const errorMessage of errorMessages) {
      message.error(errorMessage);
    }
  } finally {
    isLoading.value = false;
  }
}

async function handleEditRequest() {

  try {
    const { password, ...userData } = draftUser.value!;
    let request: UserUpdateRequest = {
      ...userData
    }
    let response = await api.updateUser(draftUser.value!.userId, request);
    user.value = response;
    isVisible.value = false;
    message.success('Profile updated successfully');
  } catch (error: any) {
    const errorMessages = getUserErrorMessages(error);
    for (const errorMessage of errorMessages) {
      message.error(errorMessage);
    }
  }
}

async function handleRegisterRequest() {
  try {
    let request: UserRegisterRequest = {
      ...draftUser.value!
    }
    await api.registerUser(request)
    isVisible.value = false;
    message.success('Registered successfully');
  } catch (error: any) {
    const errorMessages = getUserErrorMessages(error);
    for (const errorMessage of errorMessages) {
      message.error(errorMessage);
    }
  }
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
    required: isRegisterMode.value,
    message: 'Please input your password',
    trigger: ['input', 'blur']
  },
  email: {
    required: true,
    message: 'Please input your email',
    trigger: ['input', 'blur']
  },
  country: {
    required: true,
    message: 'Please input your country',
    trigger: ['input', 'blur']
  },
  city: {
    required: true,
    message: 'Please input your city',
    trigger: ['input', 'blur']
  }
}
</script>

<template>
    <n-modal 
    v-model:show="isVisible">
        <n-card
        style="width: 600px"
        title="Registration"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true">
            <n-form v-if="draftUser"
                ref="formRef"
                :label-width="80"
                :model="draftUser"
                :rules="rules"
                :size="'medium'"
                autocomplete="off">

              <div class="space-y-4">
                  <n-form-item label="Name" path="firstName"  >
                    <n-input v-model:value="draftUser.firstName" :disabled="isLoading" placeholder="Input Name" class="w-full" autocomplete="off"/>
                  </n-form-item>
                  <n-form-item label="Surname" path="lastName">
                    <n-input v-model:value="draftUser.lastName" :disabled="isLoading" placeholder="Input Surname" class="w-full" autocomplete="off"/>
                  </n-form-item>
                  <n-form-item v-if="isRegisterMode" label="Password" path="password">
                    <n-input v-model:value="draftUser.password" :disabled="isLoading" placeholder="Input Password" class="w-full" type="password" autocomplete="off"/>
                  </n-form-item>
                  <n-form-item label="Email" path="email">
                    <n-input v-model:value="draftUser.email" :disabled="isLoading" placeholder="Input Email" class="w-full" autocomplete="off"/>
                  </n-form-item>
                  <n-form-item label="Country" path="country">
                    <n-select
                      v-model:value="draftUser.country"
                      :options="countryOptions"
                      :disabled="isLoading"
                      filterable
                      placeholder="Select country"
                    />
                  </n-form-item>
                  <n-form-item label="City" path="city">
                    <n-input v-model:value="draftUser.city" :disabled="isLoading" placeholder="Input City" class="w-full" />
                  </n-form-item>
                  <!-- <n-form-item label="Immigration date" path="immigrationDate">
                    <n-input v-model:value="draftUser.immigrationDate" placeholder="Input Immigration Date" class="w-full" />
                  </n-form-item> -->
                </div>
              <div class="mt-8 flex justify-end gap-3">
                <n-button @click="isVisible = false" :disabled="isLoading" secondary>
                  Cancel
                </n-button>
                <n-button @click="handleConfirmAction" :loading="isLoading" type="primary">
                  {{ isLoading ? 'Loading...' : (isRegisterMode ? 'Register' : 'Save') }}
                </n-button>
              </div>
            </n-form>
        </n-card>
    </n-modal>
</template>