<template>
  <Button
      :tooltip="t('navigation.chatbot.label')"
      :class="classes"
      textual
      color="dimmed"
      :icon="RiChatAiLine"
      @click="showInfoDialog = true"
  />
  <ChatbotDialog :open="showInfoDialog" @close="showInfoDialog = false" />
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { RiChatAiLine } from '@remixicon/vue';
import { ClassNames } from '@utils';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ChatbotDialog from "@app/pages/navigation/chatbot/ChatbotDialog.vue";

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const showInfoDialog = ref(false);

const classes = computed(() => props.class);
</script>
