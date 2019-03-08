<template>
  <div :class="['load-stats', isLoaded ? 'after' : 'before']">
    <button
      :class="['load-stats_button', isLoaded ? 'after' : 'before']"
      :disabled="isLoaded"
      @click="loadStats"
    >
      {{ currentStatus }}
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

const checkTelegramData = v({
  chats: {
    list: v.arrayOf({
      id: ['number', 'string'],
      name: ['string', 'undefined', 'null'],
      type: 'string',
      messages: v.arrayOf({}),
    }),
  },
});

const deserializeMessage = message => message;

const deserializeChat = chat => ({
  ...chat,
  id: chat.id.toString(),
  name: chat.name || null,
  messages: chat.messages.map(deserializeMessage),
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
        reader.onload = compose(resolve, path(['target', 'result']));
      });
      try {
        const data = JSON.parse(content);
        v();
        if (!checkTelegramData(data)) {
          console.log(v.explanation);
          throw new TypeError('Json file is invalid');
        }
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
@import '@/assets/colors.scss';

.load-stats {
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: $blue;
  display: flex;
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
  background-color: $white;
  width: 100%;
  height: 100%;
}
</style>
