<script lang="ts" setup>
import { NSelect, NFormItem, NInput, NButton, NForm, useMessage, type FormInst, type FormRules } from 'naive-ui';
import type { UserUpdateRequest } from '~/utils/Requests/UserUpdateRequest';
import type { CountryResponse } from '~/utils/Responses/CountryResponse';
import type { UserResponse } from '~/utils/Responses/UserResponse';

const message = useMessage();
const { getUserErrorMessages } = useApiError();

const user = defineModel<UserResponse>({required: true});
const countries = defineModel<CountryResponse[]>('countries', {required: true});

const formRef = ref<FormInst | null>(null);
const isLoading = ref<boolean>(false);

defineProps<{
  mode: 'register' | 'edit';
}>();

const emit = defineEmits<{
  (event: 'update'): void;
}>();

const countryOptions = computed(() =>
  countries.value.map((country) => ({
    label: country.name,
    value: country.name,
  }))
);

async function handleUpdateAction(event?: Event) {
  event?.preventDefault?.()
  if (isLoading.value || !user || !user.value) return
  
  try {
    await formRef.value?.validate();
    isLoading.value = true
    let updateUserRequest: UserUpdateRequest = {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      country: user.value.country,
      city: user.value.city,
    };
    user.value = await api.updateUser(user.value.userId, updateUserRequest);
    emit('update');
  } catch (error: any) {
    if (!Array.isArray(error)) {
      const errorMessages = getUserErrorMessages(error);
      for (const errorMessage of errorMessages) {
        message.error(errorMessage);
      }
    }
  } finally {
    isLoading.value = false;
  }
}

function handleEnterKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter') return

  const target = event.target as HTMLElement | null
  const isTextArea = target?.tagName === 'TEXTAREA'
  if (isTextArea) return

  const inSelect = Boolean(target?.closest?.('.n-base-selection'))
  if (inSelect) return

  void handleUpdateAction(event)
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
    <SpinLoader v-if="isLoading" 
      class="flex min-h-[40vh] items-center justify-center"/>
    <n-form v-else
        ref="formRef"
        :label-width="200"
        :model="user"
        :rules="rules"
        :size="'medium'"
        autocomplete="off"
        @keydown="handleEnterKeydown">

        <div class="space-y-4">
            <n-form-item label="Name" path="firstName"  >
            <n-input v-model:value="user.firstName" placeholder="Input Name" class="w-full" autocomplete="off"/>
            </n-form-item>
            <n-form-item label="Surname" path="lastName">
            <n-input v-model:value="user.lastName" placeholder="Input Surname" class="w-full" autocomplete="off"/>
            </n-form-item>
            <n-form-item label="Country" path="country">
            <n-select
                v-model:value="user.country"
                :options="countryOptions"
                filterable
                placeholder="Select country"
            />
            </n-form-item>
            <n-form-item label="City" path="city">
            <n-input v-model:value="user.city" placeholder="Input City" class="w-full" />
            </n-form-item>
        </div>
        <div class="mt-8 flex justify-end gap-3">
        <n-button @click="handleUpdateAction" :loading="isLoading" type="primary">
            {{ mode === 'register' ? 'Next' : 'Save' }}
        </n-button>
        </div>
    </n-form>
</template>