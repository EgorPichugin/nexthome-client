<script setup lang="ts">
import { NCard, NTabs, NTabPane, NButton } from 'naive-ui';
import { type UserResponse } from '~/utils/Responses/UserResponse';
import { ETab } from './ETab';
import { type CountryResponse } from '~/utils/Responses/CountryResponse';
import type { E } from 'vue-router/dist/router-CWoNjPRp.mjs';
import type { ExperienceCardResponse } from '~/utils/Responses/ExperienceCardResponse';
import type { ExperienceCardCreateRequest } from '~/utils/Requests/ExperienceCardCreateRequest';

const user = defineModel<UserResponse>({required: true});

const selectedTab = ref<ETab>(ETab.Profile);
const isUserEditDialogVisible = ref<boolean>(false);
const isAddExperienceDialogVisible = ref<boolean>(false);
const isAddChallengeDialogVisible = ref<boolean>(false);
const countries = ref<CountryResponse[]>([]);
const experienceCards = ref<ExperienceCardResponse[] | null>(null);
const newExperienceCard = ref<ExperienceCardCreateRequest>({
    title: '',
    description: ''
});


onMounted(async () => {
    countries.value = await api.fetchCountries();
    experienceCards.value = await api.getExperienceCardsByUserId(user.value.userId);
});

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

async function handleActionClick() {
  switch (selectedTab.value) {
    case ETab.Profile:
      return await handleEditProfile()
    case ETab.Experiences:
      return handleAddExperience()
    case ETab.Challenges:
      return handleAddChallenge()
  }
}

async function handleEditProfile() {
    isUserEditDialogVisible.value = true;
}

function handleAddExperience() {
    isAddExperienceDialogVisible.value = true;
}

function handleAddChallenge() {
    isAddChallengeDialogVisible.value = true;
}

async function refreshExperienceCards() {
    experienceCards.value = await api.getExperienceCardsByUserId(user.value.userId);
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
            <ExperienceProfile v-if="experienceCards" v-model="user" v-model:cards="experienceCards" @refresh="refreshExperienceCards"/>
            <div v-else class="flex w-full justify-center py-8">
              <span class="text-gray-500">Loading experience cards...</span>
            </div>
        </n-tab-pane>
        <n-tab-pane :name="ETab.Challenges">
            <!-- <ChallengeProfile /> -->
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

  <UserEditDialog 
    v-model="isUserEditDialogVisible"
    v-model:user="user"
    v-model:countries="countries"
    :mode="'edit'"/>

  <ExperienceCardDialog
    v-model="isAddExperienceDialogVisible"
    :card="newExperienceCard"
    :user-id="user.userId"
    :mode="'create'"
    @refresh="refreshExperienceCards"/>
</template>