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
      <input
        v-model.number="minYear"
        type="number"
        placeholder="Min year"
        min="0"
        max="2100"
      >
      <input
        v-model.number="maxYear"
        type="number"
        placeholder="Min year"
        min="0"
        max="2100"
      >
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
      minYear: 0,
      maxYear: 2100,
    };
  },
  computed: {
    chats() {
      return this.stats ? this.stats.chats : [];
    },
    chatsOptions() {
      const isAppropriateYear = (message) => {
        const date = new Date(message.date);
        const year = date.getFullYear();
        return year >= this.minYear && year <= this.maxYear;
      };
      const transformChat = chat => ({
        label: chat.name,
        value: {
          id: chat.id,
          name: chat.name,
          count: chat.messages
            .filter(isAppropriateYear)
            .length,
        },
      });
      const chats = this.chats.map(transformChat);
      chats.sort((chat1, chat2) => chat2.value.count - chat1.value.count);
      return chats;
    },
    selectedChats() {
      if (!this.selected || this.selected.length === 0) return [];
      const chats = this.selected.map(e => e.value);
      chats.sort((chat1, chat2) => chat2.count - chat1.count);
      const fullCount = chats.map(chat => chat.count).reduce((sum, count) => sum + count, 0);
      const DELTA_PERCENTAGE = 0.01;
      const allChats = chats.map(el => ({ ...el, percentage: el.count / fullCount }));
      const selectedChats = allChats.filter(el => el.percentage > DELTA_PERCENTAGE);
      const otherId = -1;
      const otherName = 'Others';
      const otherCount = allChats.filter(chat => chat.percentage <= DELTA_PERCENTAGE)
        .reduce((sum, chat) => sum + chat.count, 0);
      const otherPercentage = otherCount / fullCount;
      if (otherCount > 0) {
        selectedChats.push({
          id: otherId,
          name: otherName,
          count: otherCount,
          percentage: otherPercentage,
        });
      }
      return selectedChats;
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
