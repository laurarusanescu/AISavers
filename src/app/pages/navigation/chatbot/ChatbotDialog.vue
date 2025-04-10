<template>
  <Dialog :open="open" :title="t('navigation.chatbot.title')" @close="emit('close')">
    <div :class="$style.chatContainer">
      <!-- Messages area -->
      <div ref="messagesContainer" :class="$style.messages">
        <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[message.role === 'user' ? $style.userMessage : $style.botMessage]"
        >
          {{ message.content }}
        </div>
      </div>

      <!-- Input area -->
      <div :class="$style.inputArea">
        <input
            v-model="newMessage"
            :placeholder="t('navigation.chatbot.placeholder')"
            @keydown.enter="sendMessage"
            :class="$style.input"
        />
        <button @click="sendMessage" :class="$style.sendButton">
          {{ t('navigation.chatbot.send') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import Dialog from '@components/base/dialog/Dialog.vue';
import Link from '@components/base/link/Link.vue';
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { callChatGPT } from '@utils/chatgpt';

const { OCULAR_BUILD_SHA, OCULAR_BUILD_TIMESTAMP, OCULAR_BUILD_VERSION } = import.meta.env;

const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineProps<{
  open: boolean;
}>();

const { t } = useI18n();
const messages = ref<{ role: 'user' | 'assistant', content: string }[]>([]);
const newMessage = ref('');
const messagesContainer = ref<HTMLDivElement>();

async function sendMessage() {
  if (!newMessage.value.trim()) return;

  // Add user's message
  messages.value.push({ role: 'user', content: newMessage.value });

  const userInput = newMessage.value;
  newMessage.value = '';

  await nextTick();
  scrollToBottom();

  // Call ChatGPT API
  const botReply = await callChatGPT(userInput);

  // Add bot's reply
  messages.value.push({ role: 'assistant', content: botReply });

  await nextTick();
  scrollToBottom();
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}
</script>

<style lang="scss" module>
.chatContainer {
  display: flex;
  flex-direction: column;
  height: 400px;
  max-width: 350px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--background-secondary);
  border-radius: 8px;
}

.userMessage {
  align-self: flex-end;
  background: #d1e8ff;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
}

.botMessage {
  align-self: flex-start;
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
}

.inputArea {
  display: flex;
  padding: 10px 0 0;
  gap: 8px;
}

.input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.sendButton {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.infoBox {
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-s);
  text-align: center;
  gap: 2px;
  max-width: 300px;
}

.link {
  margin-top: 8px;
}

.love {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-l);
  margin-top: 8px;
}

.meta {
  font-size: var(--font-size-xs);
  text-align: center;
}
</style>
