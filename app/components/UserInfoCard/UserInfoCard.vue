<script lang="ts" setup>
import { NCard, useMessage } from 'naive-ui';
import SpinLoader from '~/components/SpinLoader/SpinLoader.vue';
import UserInfoForm from '~/components/UserInfoForm/UserInfoForm.vue';
import type { CountryResponse } from '~/utils/Responses/CountryResponse';
import { type UserResponse } from '~/utils/Responses/UserResponse';

const message = useMessage();

const user = defineModel<UserResponse>({required: true});

const isLoading = ref<boolean>(false);
const countries = ref<CountryResponse[]>([]);

const emit = defineEmits<{
  (event: 'update'): void;
}>();

defineProps<{
  mode: 'register' | 'edit';
}>();

onMounted(async () => {
    try {
      isLoading.value = true;
      countries.value = await api.fetchCountries();
    } catch (error) {
      message.error('Failed to load countries data.');
    } finally {
      isLoading.value = false;
    }
});
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center">
    <n-card
      style="width: 600px"
      :title="mode === 'register' ? 'Provide your information' : 'Edit profile'"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true">
        <SpinLoader v-if="isLoading" 
          class="flex min-h-[60vh] items-center justify-center"/>
        <UserInfoForm v-else
          v-model="user"
          v-model:countries="countries"
          @update="emit('update')"
          :mode="mode"
          />
    </n-card>
  </div>
</template>