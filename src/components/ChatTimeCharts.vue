<template>
  <div class="chat-time-charts">
    <h3 class="color-complement">
      Chat time charts
    </h3>
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
  computed: {
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
    otherDistribution() {
      return this.getMessageDistribution({
        filter: m => !m.my,
      });
    },
    getMyHoursDistribution() {
      const hoursDict = {};
      for (let i = 0; i < this.messages.length; i += 1) {
        const message = this.messages[i];
        const date = new Date(message.date);
        const hour = date.getHours();
        hoursDict[hour] = hoursDict[hour] ? hoursDict[hour] + 1 : 1;
      }
      return HOURS.map(hour => ({
        caption: `${hour}:00`,
        value: hoursDict[hour],
      }));
    },
    myId() {
      return getMyIdFromChat(this.chat);
    },
    otherId() {
      return getOtherIdFromChat(this.chat);
    },

  },
  methods: {
    getMessageDistribution({
      filter = () => true,
      groupBy = message => new Date(message.date).getHours(),
      order = (a, b) => HOURS.indexOf(a.caption) - HOURS.indexOf(b.caption),
      getValue = (message, oldValue) => (oldValue || 0) + 1,
    }) {
      const m = new Map();
      for (let i = 0; i < this.messages.length; i += 1) {
        const message = this.messages[i];
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
.chat-time-charts_main-hours-distribution {
  width: 500px;
  margin: 0 auto;
}
</style>
