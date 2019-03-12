<template>
  <div>
    <h3>Last messages</h3>
    <div
      v-for="m in lastMessages"
      :key="m.id"
      :class="['message', m.isMy ? 'my' : 'not-my']"
    >
      {{ m.text }}
    </div>
    <div />
  </div>
</template>
<script>
import { v } from 'explained-quartet';

export default {
  name: 'LastMessages',
  props: {
    stats: {
      validator: v(['null', {}]), // TODO: write this validator,
      required: true,
    },
    chatId: {
      required: true,
      validator: v(['null', 'string']),
    },
  },
  computed: {
    myId() {
      return this.stats ? this.stats.personalInformation.userId : null;
    },
    lastMessages() {
      if (!this.stats) return [];
      const { chats } = this.stats;
      const selectedChat = chats.find(chat => chat.id === this.chatId);
      if (!selectedChat) return [];

      const transformMessages = (message) => {
        const { text } = message;
        const textPart = text.find(({ type }) => type === 'text-message');
        return {
          text: textPart ? textPart.text : '',
          id: message.id,
          fromId: message.fromId,
          isMy: message.fromId === this.myId,
        };
      };

      return selectedChat.messages
        .slice(-20)
        .map(transformMessages)
        .filter(m => m.text !== '');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/variables.scss';
@import '@/assets/colors.scss';

.message {
  color: $main;
  background-color: $complement;
  border-radius: 10px;
  padding: 5px 10px;
  &:not(:last-child) {
    margin-bottom: 15px;
  }

  &.my {
    color: $complement;
    border: 1px solid $complement;
    box-shadow: 0 0 5px $complement;
    background-color: $main;
    text-align: right;
  }
}
</style>
