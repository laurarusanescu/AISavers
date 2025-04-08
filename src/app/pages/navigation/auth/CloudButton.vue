<template>
  <Button :class="classes" textual :color="color" :icon="icon" @click="auth" />
  <AuthDialog :open="showAuthDialog" @close="showAuthDialog = false" />
</template>

<script lang="ts" setup>
import AuthDialog from '@components/auth/AuthDialog.vue';
import Button from '@components/base/button/Button.vue';
import { Color } from '@composables';
import { RiCloudLine, RiCloudOffLine, RiRefreshLine, RiSignalWifiErrorLine } from '@remixicon/vue';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils';
import { computed, ref } from 'vue';
import type { Component } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const { status, logout } = useStorage();
const showAuthDialog = ref(false);

const classes = computed(() => props.class);

const icon = computed((): Component => {
  switch (status.value) {
    case 'syncing':
    case 'retrying':
      return RiRefreshLine;
    case 'idle':
      return RiCloudOffLine;
    case 'error':
      return RiSignalWifiErrorLine;
  }

  return RiCloudLine;
});

const color = computed((): Color => {
  switch (status.value) {
    case 'authenticated':
      return 'success';
    case 'loading':
      return 'warning';
    case 'idle':
    case 'error':
      return 'danger';
    case 'syncing':
      return 'primary';
  }

  return 'danger';
});

const auth = () => {
  if (status.value === 'idle') {
    showAuthDialog.value = true;
  } else {
    logout();
  }
};
</script>
