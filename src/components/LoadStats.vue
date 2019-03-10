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
      Load another...
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

window.v = v;
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
const TEXT_MESSAGE_TYPE = 'text-message';

const deserializeText = (text) => {
  if (typeof text === 'string') {
    return [{
      type: TEXT_MESSAGE_TYPE,
      text,
    }];
  }
  return text.map(textElement => (typeof textElement === 'string' ? { type: TEXT_MESSAGE_TYPE, text: textElement } : textElement));
};

const deserializeMessage = message => ({
  _message: message,
  date: message.date,
  from: message.from || null,
  fromId: message.from_id ? message.from_id.toString() : null,
  id: message.id.toString(),
  mediaType: message.media_type || null,
  text: deserializeText(message.text),
});

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
});


const deserializeChat = chat => ({
  ...chat,
  id: chat.id.toString(),
  name: chat.name || null,
  messages: chat.messages ? chat.messages.map(deserializeMessage) : [],
});

const deserialize = (data) => {
  const { chats } = data;
  const { list } = chats;
  const newList = list.map(deserializeChat);
  return { chats: newList };
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
        return 'DONE';
      }
      if (this.isLoading) {
        return 'Loading...';
      }
      return 'Load stats';
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
          console.log(v.explanation);
          throw new TypeError('Json file is invalid');
        }
        v();
        this.$emit('loaded', deserialize(data));
        return true;
      } catch (error) {
        // eslint-disable-next-line
        alert(`${file.name} is invalid json file`);
        console.error(error);
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
  background-color: $blue;
  display: flex;
  transition: all 200ms ease-in-out;

  &.after {
    background-color: $white;
  }
}

.load-another {
  border: none;
  background-color: rgba(0,0,0,0);
  font-size: 20px;
  color: $grey;
  display: none;
  cursor: pointer;
  transition: all 1s ease-in-out;

  &:hover {
    transform: scale(1.1);
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
  transition: all 2000ms ease-in-out, color 0 ease-in;
  outline: none;
}

.load-stats_button.before {
  background-color: $red;
  color: $white;

  &:hover {
    background-color: $white;
    color: $red;
    box-shadow: 0 0 15px $white;
  }

  &:active {
    box-shadow: 0 0 150px $white;
  }
}

.load-stats_button.after {
  color: $red;
  padding: 0;
  background-color: $white;
}
</style>
