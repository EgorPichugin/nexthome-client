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
                        <span class="inline-flex items-center gap-1">
                            <svg
                                class="h-4 w-4 shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                                focusable="false"
                            >
                                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>
                                {{ user.country }}{{ user.city ? ', ' + user.city : '' }}
                            </span>
                        </span>
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