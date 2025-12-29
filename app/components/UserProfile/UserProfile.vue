<script setup lang="ts">
import { NAvatar, NCard, NDescriptions, NDescriptionsItem, NSpace, NText } from 'naive-ui';
import { EStatus, type UserResponse } from '~/utils/Responses/UserResponse';

const user = defineModel<UserResponse>({required: true});
const statusLabel = computed(() => {
  if (user.value?.status === null || user.value?.status === undefined) {
    return '—'
  }

  return EStatus[user.value.status]
});

const formatYearMonth = (value: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }).format(new Date(value))
}


const fullName = computed(() => {
    const first = user.value?.firstName?.trim() ?? ''
    const last = user.value?.lastName?.trim() ?? ''
    const name = `${first} ${last}`.trim()
    return name || 'User'
})
</script>

<template>
    <n-card>
        <div class="profile-layout">
            <div class="profile-left">
                <n-space vertical :align="'center'" size="small">
                    <n-avatar
                        round
                        :size="110"
                        src="/images/profile_picture.jpg"
                    />

                    <n-text strong>
                        {{ fullName }}
                    </n-text>
                    <n-text depth="3">
                        {{ user.email }}
                    </n-text>
                </n-space>
            </div>

            <div class="profile-right">
                <n-descriptions bordered label-placement="left" :size="'small'" :column="1">
                    <n-descriptions-item label="First name">
                        {{ user.firstName || '—' }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Last name">
                        {{ user.lastName || '—' }}
                    </n-descriptions-item>
                    <n-descriptions-item label="Country">
                        {{ user.country || '—' }}
                    </n-descriptions-item>
                    <n-descriptions-item label="City">
                        {{ user.city || '—' }}
                    </n-descriptions-item>
                    <n-descriptions-item v-if="user.status" label="Status">
                        {{ statusLabel }}
                    </n-descriptions-item>
                    <!-- <n-descriptions-item v-if="user.immigrationDate" label="Immigration Date">
                        {{ formatYearMonth(user.immigrationDate) }}
                    </n-descriptions-item> -->
                </n-descriptions>
            </div>
        </div>
    </n-card>
</template>

<style scoped>
.profile-layout {
    display: flex;
    gap: 16px;
    align-items: flex-start;
}

.profile-left {
    flex: 0 0 280px;
    display: flex;
    justify-content: center;
    align-self: center;
}

.profile-right {
    flex: 1 1 auto;
    min-width: 0;
}

@media (max-width: 640px) {
    .profile-layout {
        flex-direction: column;
    }

    .profile-left {
        flex-basis: auto;
        width: 100%;
    }
}
</style>