<script setup lang="ts">
import { NCard, NTabs, NTabPane, NButton } from 'naive-ui';
import { type UserResponse } from '~/utils/Responses/UserResponse';
import { ETab } from './ETab';
import { type CountryResponse } from '~/utils/Responses/CountryResponse';
import type { CardResponse } from '~/utils/Responses/CardResponse';
import type { CreateCardRequest } from '~/utils/Requests/CreateCardRequest';

const user = defineModel<UserResponse>({required: true});

const selectedTab = ref<ETab>(ETab.Profile);
const isUserEditDialogVisible = ref<boolean>(false);
const isAddCardDialogVisible = ref<boolean>(false);
const countries = ref<CountryResponse[]>([]);
const experienceCards = ref<CardResponse[] | null>(null);
const challengeCards = ref<CardResponse[] | null>(null);
const newCard = ref<CreateCardRequest>({
    title: '',
    description: ''
});


onMounted(async () => {
    countries.value = await api.fetchCountries();
    experienceCards.value = await api.getExperienceCardsByUserId(user.value.userId);
    challengeCards.value = await api.getChallengeCardsByUserId(user.value.userId);
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

async function handleActionClick(): Promise<void> {
  switch (selectedTab.value) {
    case ETab.Profile:
      isUserEditDialogVisible.value = true;
      break;
    case ETab.Experiences:
      isAddCardDialogVisible.value = true;
      break;
    case ETab.Challenges:
      isAddCardDialogVisible.value = true;
      break;
  }
}

async function refreshCards() {
    if (selectedTab.value === ETab.Experiences) {
        experienceCards.value = await api.getExperienceCardsByUserId(user.value.userId);
    } else if (selectedTab.value === ETab.Challenges) {
        challengeCards.value = await api.getChallengeCardsByUserId(user.value.userId);
    }
}


async function refreshChallengeCards() {
    challengeCards.value = await api.getChallengeCardsByUserId(user.value.userId);
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
            <CardsSpace v-if="experienceCards" 
              v-model="user"  
              v-model:cards="experienceCards" 
              card-type="experience"
              @refresh="refreshCards"/>
            <div v-else class="flex w-full justify-center py-8">
              <span class="text-gray-500">Loading experience cards...</span>
            </div>
        </n-tab-pane>
        <n-tab-pane :name="ETab.Challenges">
            <CardsSpace v-if="challengeCards" 
              v-model="user" 
              v-model:cards="challengeCards" 
              card-type="challenge"
              @refresh="refreshChallengeCards"/>
            <div v-else class="flex w-full justify-center py-8">
              <span class="text-gray-500">Loading challenge cards...</span>
            </div>
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

  <CardDialog
    v-model="isAddCardDialogVisible"
    :card="newCard"
    :user-id="user.userId"
    :mode="'create'"
    :card-type="selectedTab === ETab.Experiences ? 'experience' : 'challenge'"
    @refresh="refreshCards"/>
</template>