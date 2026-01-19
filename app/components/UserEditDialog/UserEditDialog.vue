<script setup lang="ts">
import { NModal } from 'naive-ui';
import type { UserResponse } from '~/utils/Responses/UserResponse';
import { api } from '~/utils/api';
import { cloneDeep } from 'lodash-es'
import type { CountryResponse } from '~/utils/Responses/CountryResponse';

const isVisible = defineModel<boolean>({required: true});
const user = defineModel<UserResponse>('user', {required: true});
const countries = defineModel<CountryResponse[]>('countries', {required: true});

const draftUser = ref<UserResponse | null>(null);
const isLoading = ref<boolean>(false);

onMounted(async () => {
  isLoading.value = true;
  countries.value = await api.fetchCountries();
  isLoading.value = false;
});

watch(() => isVisible.value, (newValue) => {
  if (newValue) {
    draftUser.value = {
      ...cloneDeep(user.value),
    };
  } else {
    draftUser.value = null;
  }
});

function handleUpdateAction() {
  if (draftUser.value) {
    user.value = draftUser.value;
  }
  isVisible.value = false;
}
</script>

<template>
    <n-modal 
      v-model:show="isVisible">
      <div>
        <UserInfoCard v-if="draftUser" 
          v-model="draftUser"
          :title="'Edit profile'"
          :mode="'edit'"
          @update="handleUpdateAction"/>
      </div>
    </n-modal>
</template>