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
    <div>
      <ChooseOne
        v-model="messageCountDistributionChoise"
        :items="messageCountDistributionChoiseItems()"
      />
    </div>
    <div class="chat-time-charts_main-hours-distribution">
      <h4>Распределение всех сообщений по часам</h4>
      <LineChart
        :chart-data="hoursDistributionChartData"
      />
    </div>
    <div class="chat-time-charts_main-hours-distribution">
      <h4>Распределение всех сообщений по неделям</h4>
      <LineChart
        :chart-data="weekDistributionChartData"
      />
    </div>
    <div class="chat-time-charts_main-hours-distribution">
      <h4>Распределение всех сообщений по месяцам</h4>
      <LineChart
        :chart-data="getLineChartData(monthDistribution, 'Month distribution')"
      />
    </div>
  </div>
</template>
<script>
import { getMyIdFromChat, getOtherIdFromChat } from '@/utils';
import HorizontalBarChart from '@/components/HorizontalBarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import ChooseOne from '@/components/ChooseOne.vue';
import { startOfWeek, format, startOfMonth } from 'date-fns';

const HOURS = [
  5, 6, 7, 8, 9, 10, 11, 12, 13,
  14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 0, 1, 2, 3, 4,
];

const CHART_TYPE = {
  FULL: 'full',
  MY: 'my',
  OTHER: 'other',
};

export default {
  components: {
    ChooseOne,
    HorizontalBarChart,
    LineChart,
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
      messageCountDistributionChoise: CHART_TYPE.FULL,
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
    hoursDistribution() {
      switch (this.messageCountDistributionChoise) {
        case CHART_TYPE.MY: return this.myDistribution();
        case CHART_TYPE.OTHER: return this.otherDistribution();
        default: return this.mainDistribution();
      }
    },
    hoursDistributionChartData() {
      return this.getLineChartData(this.hoursDistribution);
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
    weekDistributionChartData() {
      return this.getLineChartData(this.weekDistribution, 'Week distribution');
    },
    monthDistribution() {
      const messages = this.filteredMessages;
      let lastKey = '1970-0';
      const res = [];
      for (let i = 0; i < messages.length; i += 1) {
        const message = messages[i];
        const date = new Date(message.date);
        const currentWeek = startOfMonth(date);
        const key = format(currentWeek, 'MMM, YYYY');
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
    getLineChartData(distribution, label = 'Hours distribution') {
      return {
        labels: distribution.map(({ caption }) => caption),
        datasets: [{
          data: distribution.map(({ caption, value }) => ({ x: caption, y: value })),
          pointBackgroundColor: 'rgb(43, 82, 120)',
          label,
          backgroundColor: '#dddfd4',
        }],
      };
    },
    mainDistribution() {
      return this.getHoursDistribution({});
    },
    myDistribution() {
      return this.getHoursDistribution({
        filter: m => m.my,
      });
    },
    otherDistribution() {
      return this.getHoursDistribution({
        filter: m => !m.my,
      });
    },
    messageCountDistributionChoiseItems() {
      return [
        { caption: 'Общее распределение', value: CHART_TYPE.FULL },
        { caption: 'Мои сообщения', value: CHART_TYPE.MY },
        { caption: 'Сообщения собеседника', value: CHART_TYPE.OTHER },
      ];
    },
    filters() {
      const [minDate, maxDate] = this.dateRange;

      return (message) => {
        const date = new Date(message.date);
        return date - minDate > 0 && maxDate - date > 0;
      };
    },
    getHoursDistribution({
      filter = () => true,
      groupBy = message => new Date(message.date).getHours(),
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
      return HOURS.map(hour => ({ caption: hour, value: m.get(hour) || 0 }));
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
