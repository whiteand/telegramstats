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
    <div>
      <el-slider
        :value="yearRange"
        range
        :min="minYearRangeValue"
        :max="maxYearRangeValue"
        @input="onYearRangeInput"
      />
    </div>
    <h4>
      {{ yearRange[0] }} - {{ yearRange[1] }}
    </h4>
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

export default {
  components: {
    HorizontalBarChart,
  },
  props: {
    stats: {
      required: true,
      type: Function,
    },
  },
  data() {
    return {
      selected: [],
      yearRange: [2000, 2100],
    };
  },
  computed: {
    chats() {
      return this.stats ? this.stats().chats : [];
    },
    minYearRangeValue() {
      if (this.chats.length === 0) return 2000;
      const getMin = (minYear, { messages: [m] }) => (
        m
          ? Math.min(minYear, new Date(m.date).getFullYear())
          : minYear
      );
      return this.chats.reduce(getMin, 3000);
    },
    maxYearRangeValue() {
      if (this.chats.length === 0) return 2000;
      const getMax = (maxYear, { messages }) => (
        messages.length > 0
          ? Math.max(maxYear, new Date(messages[messages.length - 1].date).getFullYear())
          : maxYear
      );
      return this.chats.reduce(getMax, 1900);
    },
    chatsOptions() {
      const [minYear, maxYear] = this.yearRange;
      const isAppropriateYear = (message) => {
        const date = new Date(message.date);
        const year = date.getFullYear();
        return year >= minYear && year <= maxYear;
      };
      const transformChat = chat => ({
        label: `${chat.name} (${chat.id})`,
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
    onYearRangeInput([min, max]) {
      this.yearRange = [min, max];
      this.selected = [...this.chatsOptions];
    },
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
