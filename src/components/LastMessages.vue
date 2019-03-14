<template>
  <div>
    <h4>Message count: {{ numberOfMessages }}</h4>
    <div
      v-for="m in lastMessages"
      :key="m.id"
      :class="['message', m.isMy ? 'my' : 'not-my']"
    >
      {{ m.text }}
    </div>
  </div>
</template>
<script>
import { v } from 'explained-quartet';

export default {
  name: 'LastMessages',
  props: {
    stats: {
      type: Function,
      required: true,
    },
    chatId: {
      required: true,
      validator: v(['null', 'string']),
    },
  },
  computed: {
    myId() {
      return this.stats ? this.stats().personalInformation.userId : null;
    },
    chat() {
      if (!this.stats) return null;
      const { chats } = this.stats();
      return chats.find(chat => chat.id === this.chatId) || null;
    },
    numberOfMessages() {
      return this.chat ? this.chat.messages.length : 0;
    },
    lastMessages() {
      if (!this.chat) return [];

      const transformMessages = (message) => {
        const { text } = message;
        const textPart = text.find(({ type }) => type === 'text-message');
        return {
          text: textPart ? textPart.text : '',
          id: message.id,
          isMy: message.fromId === this.myId,
        };
      };

      return this.chat.messages
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

h4 {
  text-transform: uppercase;
  text-align: center;
}

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
