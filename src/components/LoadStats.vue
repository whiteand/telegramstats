<template>
  <div :class="['load-stats', isLoaded ? 'after' : 'before']">
    <button
      :class="['load-stats_button', isLoaded ? 'after' : 'before']"
      :disabled="isLoaded"
      @click="loadStats"
    >
      {{ currentStatus }}
    </button>
    <button
      :class="['load-another', isLoaded ? 'after' : 'before']"
      @click="loadStats"
    >
      Загрузить другую статистику...
    </button>
    <div style="opacity: 0; width: 0;height: 0">
      <input
        ref="fileInput"
        type="file"
        @input="onFileInput"
      >
    </div>
  </div>
</template>
<script>
import { obj as v } from 'explained-quartet';
import { compose, path } from 'ramda';
import { TEXT_MESSAGE_TYPE } from '@/utils';

const checkMessage = v({
  date: v.and(
    'string',
    value => !Number.isNaN(new Date(value).valueOf()),
  ),
  from: ['string', 'nil'],
  from_id: ['number', 'string', 'nil'],
  id: 'number',
  media_type: ['nil', 'string'],
  text: [
    'string',
    v.arrayOf(['string', { type: 'string', text: 'string' }]),
  ],
});

/**
 * @typedef {{
 *  date: string,
 *  from: string | null,
 *  fromId: string | null,
 *  id: string
 *  mediaType: string | null,
 *  text: Array<{ type: string, text: string }>
 * }} Message
 */

const deserializeText = (text) => {
  if (typeof text === 'string') {
    return [{
      type: TEXT_MESSAGE_TYPE,
      text,
    }];
  }
  return text.map(textElement => (typeof textElement === 'string' ? { type: TEXT_MESSAGE_TYPE, text: textElement } : textElement));
};

const deserializeMessage = personalInformation => (message) => {
  const textArray = deserializeText(message.text);
  return {
    _message: message,
    date: message.date,
    from: message.from || null,
    fromId: (message.from_id || message.actor_id)
      ? (message.from_id || message.actor_id).toString()
      : null,
    id: message.id.toString(),
    my: [message.from_id, message.actor_id].includes(personalInformation.user_id),
    mediaType: message.media_type || null,
    text: textArray,
    textValue: textArray.filter(e => e.type === TEXT_MESSAGE_TYPE).map(e => e.text).join('\n'),
  };
};

const checkTelegramData = v({
  chats: {
    list: v.arrayOf({
      id: ['number', 'string'],
      name: ['string', 'nil'],
      type: 'string',
      messages: [
        'nil',
        v.arrayOf(checkMessage),
      ],
    }),
  },
  personal_information: {
    user_id: ['string', 'number'],
    first_name: 'string',
    last_name: 'string',
    phone_number: 'string',
    username: ['string', 'nil'],
  },
});

const deserializePersonalInformation = info => ({
  userId: info.user_id.toString(),
  firstName: info.first_name,
  lastName: info.last_name,
  phoneNumber: info.phone_number,
  username: info.username || null,
});

const deserializeChat = personalInformation => (chat) => {
  const messages = chat.messages ? chat.messages.map(deserializeMessage(personalInformation)) : [];
  let otherId = null;
  const firstOtherMessage = messages.find(m => m.fromId !== personalInformation.user_id.toString());
  if (firstOtherMessage) {
    otherId = firstOtherMessage.fromId.toString();
  }
  return {
    ...chat,
    id: chat.id.toString(),
    myId: personalInformation.user_id.toString(),
    otherId,
    name: chat.name || 'UnknownChat',
    messages,
  };
};

const deserialize = (data) => {
  const { chats, personal_information: personalInformation } = data;
  const { list } = chats;
  const newList = list.map(deserializeChat(personalInformation));
  const newPersonalInformation = deserializePersonalInformation(personalInformation);
  return { chats: newList, personalInformation: newPersonalInformation };
};

export default {
  props: {
    isLoaded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    currentStatus() {
      if (this.isLoaded) {
        return 'Готово';
      }
      if (this.isLoading) {
        return 'Загрузка...';
      }
      return 'Загрузить';
    },
  },
  methods: {
    loadStats() {
      const { fileInput } = this.$refs;
      fileInput.click();
    },
    async onFileInput() {
      const { fileInput } = this.$refs;
      const files = Array.from(fileInput.files);
      const jsonFiles = files.filter(file => file.type === 'application/json');
      for (let i = 0; i < jsonFiles.length; i += 1) {
        this.isLoading = true;
        // eslint-disable-next-line
        const loaded = await this.loadFile(jsonFiles[i]);
        this.isLoading = false;
        if (loaded) {
          return;
        }
      }
    },
    async loadFile(file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      const content = await new Promise((resolve) => {
        reader.onload = compose(
          resolve,
          path(['target', 'result']),
        );
      });
      try {
        const data = JSON.parse(content);
        v();
        if (!checkTelegramData(data)) {
          throw new TypeError('Json file is invalid');
        }
        v();
        const deserialized = deserialize(data);
        this.$emit('loaded', deserialized);
        return true;
      } catch (error) {
        // eslint-disable-next-line
        alert(`${file.name} is invalid json file`);
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.load-stats {
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: $accent;
  display: flex;
  transition: all 200ms ease-in-out;

  &.after {
    background-color: $complement;
  }
}

.load-another {
  border: none;
  background-color: rgba(0,0,0,0);
  font-size: 1rem;
  color: $accent;
  display: none;
  cursor: pointer;
  transition: all 1s ease-in-out;

  &:hover {
    transform: scale(1.2);
    color: black;
  }

  &.after {
    margin-top: 10px;
    outline: none;
    display: block;
  }
}

.load-stats_button {
  padding: 15px;
  font-size: 2rem;
  border: none;
  cursor: pointer;
  transition: all 2000ms ease-in-out, color 0 ease-in;
  outline: none;
}

.load-stats_button.before {
  background-color: $main;
  color: $complement;

  &:hover {
    background-color: $complement;
    color: $main;
    box-shadow: 0 0 15px $complement;
  }

  &:active {
    box-shadow: 0 0 150px $complement;
  }
}

.load-stats_button.after {
  color: $main;
  padding: 0;
  background-color: $complement;
}
</style>
