<template>
  <div class="message-count-wrapper">
    <v-select
      v-model="selected"
      multiple
      class="multiselect"
      placeholder="Select chats for charts"
      :options="chatsOptions"
    />
    <div class="buttons">
      <button
        class="select-all"
        @click="selectAll"
      >
        Select all
      </button>
      <button
        class="select-all"
        @click="selected=[]"
      >
        Clear
      </button>
    </div>
    <HorizontalBarChart
      class="chart"
      :items="selectedChats"
      caption-prop="name"
      value-prop="count"
      height="30px"
    />
  </div>
</template>

<script>
import HorizontalBarChart from '@/components/HorizontalBarChart.vue';
import { v } from 'explained-quartet';
import { logv } from '@/utils';

export default {
  components: {
    HorizontalBarChart,
  },
  props: {
    stats: {
      required: true,
      validator: logv([
        'null',
        {
          chats: v.arrayOf({
            id: 'string',
            name: 'string',
            messages: 'array',
          }),
        },
      ]),
    },
  },
  data() {
    return {
      selected: [],
    };
  },
  computed: {
    chats() {
      return this.stats ? this.stats.chats : [];
    },
    chatsOptions() {
      const chats = this.chats.map(chat => ({
        label: chat.name,
        value: {
          id: chat.id,
          name: chat.name,
          count: chat.messages.length,
        },
      }));
      chats.sort((chat1, chat2) => chat2.value.count - chat1.value.count);
      return chats;
    },
    selectedChats() {
      if (!this.selected || this.selected.length === 0) return [];
      const chats = this.selected.map(e => e.value);
      chats.sort((chat1, chat2) => chat2.count - chat1.count);
      const maxCount = chats[0].count;
      return chats.map(el => ({ ...el, percentage: el.count / maxCount }));
    },
  },
  methods: {
    selectAll() {
      this.selected = [...this.chatsOptions];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.message-count-wrapper {
  width: 100%;
}

.multiselect {
  cursor: pointer;
  min-width: 250px;
  padding: 10px;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;

  button {
    border: none;
    outline: none;
    color: $complement;
    padding: 5px 15px;
    border: 1px solid $complement;
    background-color: $main;
  }
}

.chart {
  width: 100%;
}
</style>
