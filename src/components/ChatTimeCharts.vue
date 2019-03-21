<template>
  <div class="chat-time-charts">
    <h3 class="color-complement">
      Chat time charts
    </h3>
    <div class="chat-balance_date-range-picker">
      <el-date-picker
        v-model="dateRange"
        format="dd.MM.yyyy"
        type="daterange"
        align="center"
        range-separator="To"
        :default-time="['00:00:00', '23:59:59']"
        start-placeholder="Start date"
        end-placeholder="End date"
      />
      <h4>Сообщений в указанный период: {{ filteredMessages.length }}</h4>
    </div>
    <div class="chat-time-charts_main-hours-distribution">
      <h4>Распределение всех сообщений по часам</h4>
      <HorizontalBarChart
        is-max-value-full-width
        class="chat-balance_chart"
        :items="mainDistribution"
        height="1.5rem"
      />
    </div>
    <div class="chat-time-charts_main-hours-distribution">
      <h4>Распределение всех сообщений по неделям</h4>
      <HorizontalBarChart
        is-max-value-full-width
        class="chat-balance_chart"
        :items="weekDistribution"
        height="1.5rem"
      />
    </div>
    <div class="chat-time-charts_main-hours-distribution">
      <h4>Распределение всех сообщений по месяцам</h4>
      <HorizontalBarChart
        is-max-value-full-width
        class="chat-balance_chart"
        :items="monthDistribution"
        height="1.5rem"
      />
    </div>
    <div class="chat-time-charts_main-hours-distribution">
      <h4>Распределение моих сообщений по часам</h4>
      <HorizontalBarChart
        is-max-value-full-width
        class="chat-balance_chart"
        :items="myDistribution"
        height="1.5rem"
      />
    </div>
    <div class="chat-time-charts_main-hours-distribution">
      <h4>Распределение {{ chatName }}</h4>
      <HorizontalBarChart
        is-max-value-full-width
        class="chat-balance_chart"
        :items="otherDistribution"
        height="1.5rem"
      />
    </div>
  </div>
</template>
<script>
import { getMyIdFromChat, getOtherIdFromChat } from '@/utils';
import HorizontalBarChart from '@/components/HorizontalBarChart.vue';
import { startOfWeek, format, startOfMonth } from 'date-fns';

const HOURS = [
  5, 6, 7, 8, 9, 10, 11, 12, 13,
  14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 0, 1, 2, 3, 4,
];

export default {
  components: {
    HorizontalBarChart,
  },
  props: {
    chat: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      dateRange: [Date.now(), Date.now() + 1],
    };
  },
  computed: {
    dateBounds() {
      return this.messages.length
        ? [
          new Date(this.messages[0].date),
          new Date(
            this.messages[this.messages.length - 1].date,
          ),
        ]
        : [new Date(1971), new Date(2100)];
    },
    chatName() {
      return this.chat ? this.chat().name : 'chat';
    },
    messages() {
      return this.chat ? this.chat().messages : [];
    },
    mainDistribution() {
      return this.getMessageDistribution({});
    },
    myDistribution() {
      return this.getMessageDistribution({
        filter: m => m.my,
      });
    },
    weekDistribution() {
      const messages = this.filteredMessages;
      let lastKey = '1970-0';
      const res = [];
      for (let i = 0; i < messages.length; i += 1) {
        const message = messages[i];
        const date = new Date(message.date);
        const currentWeek = startOfWeek(date);
        const key = format(currentWeek, 'DD/MM/YYYY');
        if (key === lastKey) {
          res[res.length - 1].value += 1;
        } else {
          const item = { caption: key, value: 1 };
          lastKey = key;
          res.push(item);
        }
      }
      return res;
    },
    monthDistribution() {
      const messages = this.filteredMessages;
      let lastKey = '1970-0';
      const res = [];
      for (let i = 0; i < messages.length; i += 1) {
        const message = messages[i];
        const date = new Date(message.date);
        const currentWeek = startOfMonth(date);
        const key = format(currentWeek, 'MM/YYYY');
        if (key === lastKey) {
          res[res.length - 1].value += 1;
        } else {
          const item = { caption: key, value: 1 };
          lastKey = key;
          res.push(item);
        }
      }
      return res;
    },
    otherDistribution() {
      return this.getMessageDistribution({
        filter: m => !m.my,
      });
    },
    myId() {
      return getMyIdFromChat(this.chat);
    },
    otherId() {
      return getOtherIdFromChat(this.chat);
    },
    filteredMessages() {
      return this.messages.filter(this.filters());
    },
  },
  watch: {
    dateBounds: {
      deep: true,
      immediate: true,
      handler(dateBounds) {
        this.dateRange = [...dateBounds];
      },
    },
  },
  methods: {
    filters() {
      const [minDate, maxDate] = this.dateRange;

      return (message) => {
        const date = new Date(message.date);
        return date - minDate > 0 && maxDate - date > 0;
      };
    },
    getMessageDistribution({
      filter = () => true,
      groupBy = message => new Date(message.date).getHours(),
      order = (a, b) => HOURS.indexOf(a.caption) - HOURS.indexOf(b.caption),
      getValue = (message, oldValue) => (oldValue || 0) + 1,
    }) {
      const m = new Map();
      for (let i = 0; i < this.filteredMessages.length; i += 1) {
        const message = this.filteredMessages[i];
        // eslint-disable-next-line
        if (!filter(message, i, this.messages)) continue;
        const caption = groupBy(message);

        m.set(caption, getValue(message, m.get(caption)));
      }
      const list = [...m].map(([caption, value]) => ({ caption, value }));
      list.sort(order);
      return list;
    },
  },
};
</script>
<style lang="scss">
.chat-time-charts {
  width: 500px;
  margin: 0 auto;
}
</style>
