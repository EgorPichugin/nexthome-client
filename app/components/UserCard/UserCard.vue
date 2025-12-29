<script setup lang="ts">
import { NCard, NTabs, NTabPane, NButton } from 'naive-ui';
import { type UserResponse } from '~/utils/Responses/UserResponse';
import { ETab } from './ETab';

const user = defineModel<UserResponse>({required: true});
const selectedTab = ref<ETab>(ETab.Profile);
const isUserEditDialogVisible = ref<boolean>(false);

const actionLabel = computed(() => {
  switch (selectedTab.value) {
    case ETab.Profile:
      return 'Edit profile'
    case ETab.Experiences:
      return 'Add experience'
    case ETab.Challenges:
      return 'Add challenge'
    default:
      return ''
  }
})

function handleActionClick() {
  switch (selectedTab.value) {
    case ETab.Profile:
      return handleEditProfile()
    case ETab.Experiences:
      return handleAddExperience()
    case ETab.Challenges:
      return handleAddChallenge()
  }
}

function handleEditProfile() {
    console.log('Save profile clicked');
}

function handleAddExperience() {
    console.log('Add experience clicked');
}

function handleAddChallenge() {
    console.log('Add challenge clicked');
}
</script>

<template>
  <n-card content-style="padding: 0;">
    <n-tabs
    v-model:value="selectedTab"
    type="segment"
    size="large"
    :tabs-padding="20"
    pane-style="padding: 20px;"
    :animated="true"
    justify-content="center">
        <n-tab-pane :name="ETab.Profile">
            <UserProfile v-model="user" />
        </n-tab-pane>
        <n-tab-pane :name="ETab.Experiences">
            My experiences
        </n-tab-pane>
        <n-tab-pane :name="ETab.Challenges">
            My pains
        </n-tab-pane>
    </n-tabs>

    <template #footer>
      <div class="grid gap-2">
        <n-button @click="handleActionClick">
          {{ actionLabel }}
        </n-button>
      </div>
    </template>
  </n-card>

  <!-- <UserEditDialog/> -->
</template>