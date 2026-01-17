<script setup lang="ts">
import { NSpin, NSpace } from 'naive-ui';
defineProps<{
  class?: string;
}>();
</script>

<template>
  <div :class="class">
    <n-space vertical>
      <n-spin size="large" show-description>
        <template #description>
          <span style="font-size: 18px; margin-top: 16px; display: block">Data is loading...</span>
        </template>
      </n-spin>
    </n-space>
  </div>
</template> 