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
      <div class="chat-time-charts_time-control-buttons">
        <button @click="moveRange(-365)">
          &lt;&lt;&lt;
        </button>
        <button @click="moveRange(-31)">
          &lt;&lt;
        </button>
        <button @click="moveRange(-7)">
          &lt;
        </button>
        <button @click="moveRange(7)">
          &gt;
        </button>
        <button @click="moveRange(31)">
          &gt;&gt;
        </button>
        <button @click="moveRange(365)">
          &gt;&gt;&gt;
        </button>
      </div>
      <h4>Сообщений в указанный период: {{ filteredMessages.length }}</h4>
    </div>
    <div>
      <el-select
        v-model="currentChart"
        placeholder="Select chart"
      >
        <el-option
          v-for="item in chartItems"
          :key="item.value"
          :value="item.value"
          :label="item.caption"
        />
      </el-select>
    </div>
    <div>
      <ChooseOne
        v-model="currentChartType"
        :items="currentChartTypeItems"
      />
    </div>
    <template v-if="[CHART.HOURS_DISTRIBUTION].includes(currentChart)">
      <div class="chat-time-charts_main-hours-distribution">
        <h4>Распределение всех сообщений по часам</h4>
        <LineChart
          :chart-data="hoursDistributionChartData"
        />
      </div>
    </template>
    <template v-if="currentChart === CHART.DAY_OF_WEEK_DISTRIBUTION">
      <div class="chat-time-charts_main-day-of-week-distribution">
        <h4>Распределение всех сообщений по дням недели</h4>
        <LineChart
          :chart-data="dayOfWeekDistributionChartData"
        />
      </div>
    </template>
    <template v-if="currentChart === CHART.WEEK_DISTRIBUTION">
      <div class="chat-time-charts_week-distribution">
        <h4>Распределение всех сообщений по неделям</h4>
        <LineChart
          :chart-data="weekDistributionChartData"
        />
      </div>
    </template>
    <template v-if="currentChart === CHART.MONTH_DISTRIBUTION">
      <div class="chat-time-charts_main-month-distribution">
        <h4>Распределение всех сообщений по месяцам</h4>
        <LineChart
          :chart-data="getLineChartData('Month distribution', monthDistribution)"
        />
      </div>
    </template>
    <template
      v-if="[
        CHART.RESPONSE_TIME,
        CHART.HAPPY_SMILE_COUNT,
        CHART.BAD_SMILE_COUNT
      ].includes(currentChart)"
    >
      <div>
        <h4>Range: </h4>
        <ChooseOne
          v-model="clusterRange"
          :items="rangeItems"
        />
      </div>
      <div>
        <h4>Step: </h4>
        <ChooseOne
          v-model="clusterStep"
          :size="10"
          :items="stepsItems"
        />
      </div>
    </template>
    <template v-if="currentChart === CHART.RESPONSE_TIME && currentChartType === CHART_TYPE.MY">
      <div class="chat-time-charts_response-time">
        <h4>Распределение моей скорости ответа ответа</h4>
        <LineChart
          :chart-data="responseTimeMedianChartData(myId)"
        />
      </div>
    </template>
    <template v-if="currentChart === CHART.RESPONSE_TIME && currentChartType === CHART_TYPE.OTHER">
      <div class="chat-time-charts_response-time">
        <LineChart
          :chart-data="responseTimeMedianChartData(otherId)"
        />
      </div>
    </template>
    <template v-if="currentChart === CHART.RESPONSE_TIME && currentChartType === CHART_TYPE.RELATIVE">
      <div class="chat-time-charts_response-time">
        <LineChart
          :chart-data="relativeMedianResponseTimeChartData"
        />
      </div>
    </template>
    <template v-if="currentChart === CHART.HAPPY_SMILE_COUNT">
      <div class="chat-time-charts_response-time">
        <LineChart
          :chart-data="happySmileCountDistributionChartData"
        />
      </div>
    </template>
    <template v-if="currentChart === CHART.BAD_SMILE_COUNT">
      <div class="chat-time-charts_response-time">
        <LineChart
          :chart-data="badSmileCountDistributionChartData"
        />
      </div>
    </template>
  </div>
</template>
<script>
import { getMyIdFromChat, getOtherIdFromChat, getMedianOfDelay } from '@/utils';
import LineChart from '@/components/charts/LineChart.vue';
import ChooseOne from '@/components/ChooseOne.vue';
import {
  startOfWeek, format, startOfMonth, addDays, getDay, isBefore,
} from 'date-fns';
import median from 'median';

const HOURS = [
  5, 6, 7, 8, 9, 10, 11, 12, 13,
  14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 0, 1, 2, 3, 4,
];

const CHART = {
  HOURS_DISTRIBUTION: 'HOURS_DISTRIBUTION',
  DAY_OF_WEEK_DISTRIBUTION: 'DAY_OF_WEEK_DISTRIBUTION',
  WEEK_DISTRIBUTION: 'WEEK_DISTRIBUTION',
  MONTH_DISTRIBUTION: 'MONTH_DISTRIBUTION',
  RESPONSE_TIME: 'RESPONSE_TIME',
  HAPPY_SMILE_COUNT: 'HAPPY_SMILE_COUNT',
  BAD_SMILE_COUNT: 'BAD_SMILE_COUNT',
};

const CHART_CAPTIONS = {
  [CHART.HOURS_DISTRIBUTION]: 'По часам',
  [CHART.DAY_OF_WEEK_DISTRIBUTION]: 'По дням недели',
  [CHART.WEEK_DISTRIBUTION]: 'По неделям',
  [CHART.MONTH_DISTRIBUTION]: 'По месяцам',
  [CHART.RESPONSE_TIME]: 'Медиана времени отклика',
  [CHART.HAPPY_SMILE_COUNT]: 'Кол-во смайлов )',
  [CHART.BAD_SMILE_COUNT]: 'Кол-во смайлов (',
};

const CHART_TYPE = {
  FULL: 'full',
  MY: 'my',
  OTHER: 'other',
  RELATIVE: 'relative',
};

const HAS_CHART_TYPES = {
  [CHART.HOURS_DISTRIBUTION]: [CHART_TYPE.FULL, CHART_TYPE.MY, CHART_TYPE.OTHER],
  [CHART.DAY_OF_WEEK_DISTRIBUTION]: [CHART_TYPE.FULL],
  [CHART.WEEK_DISTRIBUTION]: [CHART_TYPE.FULL],
  [CHART.MONTH_DISTRIBUTION]: [CHART_TYPE.FULL],
  [CHART.RESPONSE_TIME]: [CHART_TYPE.MY, CHART_TYPE.OTHER, CHART_TYPE.RELATIVE],
  [CHART.HAPPY_SMILE_COUNT]: [CHART_TYPE.FULL, CHART_TYPE.MY, CHART_TYPE.OTHER],
  [CHART.BAD_SMILE_COUNT]: [CHART_TYPE.FULL, CHART_TYPE.MY, CHART_TYPE.OTHER],
};

export default {
  components: {
    ChooseOne,
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
      clusterRange: 31,
      clusterStep: 7,
      currentChart: CHART.HOURS_DISTRIBUTION,
      dateRange: [Date.now(), Date.now() + 1],
      currentChartType: CHART_TYPE.FULL,
    };
  },
  computed: {
    CHART() { return CHART; },
    CHART_TYPE() { return CHART_TYPE; },
    HAS_CHART_TYPES() { return HAS_CHART_TYPES; },
    chartItems() {
      return Object.values(CHART).map(chart => ({
        value: chart,
        caption: CHART_CAPTIONS[chart],
      }));
    },
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
      switch (this.currentChartType) {
        case CHART_TYPE.MY: return this.myDistribution();
        case CHART_TYPE.OTHER: return this.otherDistribution();
        default: return this.mainDistribution();
      }
    },
    hoursDistributionChartData() {
      return this.getLineChartData('Распределение по часам', this.hoursDistribution);
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
      return this.getLineChartData('Распределение по неделям', this.weekDistribution);
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
    rangeItems() {
      return Array.from({ length: 100 }, (_, i) => ({
        caption: (i + 1).toString(),
        value: i + 1,
      }));
    },
    stepsItems() {
      return Array.from({ length: 100 }, (_, i) => ({
        caption: (i + 1).toString(),
        value: i + 1,
      }));
    },
    dayOfWeekDistributionChartData() {
      const dict = {};
      const messages = this.filteredMessages;
      for (let i = 0; i < messages.length; i += 1) {
        const message = messages[i];
        const date = new Date(message.date);
        const dayOfWeek = getDay(date);
        dict[dayOfWeek] = (dict[dayOfWeek] || 0) + 1;
      }
      const DAYS = {
        0: 'Воскресение',
        1: 'Понедельник',
        2: 'Вторник',
        3: 'Среда',
        4: 'Четверг',
        5: 'Пятница',
        6: 'Суббота',
      };
      const distribution = [1, 2, 3, 4, 5, 6, 0].map(dayOfWeek => ({
        caption: DAYS[dayOfWeek],
        value: dict[dayOfWeek],
      }));
      return this.getLineChartData('Распределение по дням недели', distribution);
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
    responseTimeMedianChartData(id) {
      const getValue = (messages) => {
        if (messages.length === 0) return 0;
        const res = getMedianOfDelay(messages, id);
        return res;
      };
      const filterRes = (distribution) => {
        const LIMIT = 10 * median(distribution.map(e => e.value));
        return distribution.filter(e => e.value < LIMIT);
      };
      return this.getValueDistributionAroundDate({
        getValue, range: this.clusterRange, step: this.clusterStep, filterRes, title: 'Медиана времени моего отклика',
      });
    },
    happySmileCountDistributionChartData() {
      return this.getWordCountDistribution(')');
    },
    badSmileCountDistributionChartData() {
      return this.getWordCountDistribution('(');
    },
    relativeMedianResponseTimeChartData() {
      const { otherId, myId } = this;
      const getRelation = (a, b) => {
        if (b < 1e-8) {
          return a < 1e-8 ? 0.5 : 1;
        }
        return a / b;
      };
      const getValue = (messages) => {
        if (messages.length === 0) return 0;
        const other = getMedianOfDelay(messages, otherId);
        const my = getMedianOfDelay(messages, myId);
        return getRelation(my, other);
      };
      const filterRes = (distribution) => {
        const LIMIT = 10 * median(distribution.map(e => e.value));
        return distribution.filter(e => e.value < LIMIT);
      };
      return this.getValueDistributionAroundDate({
        getValue, range: this.clusterRange, step: this.clusterStep, filterRes,
      });
    },
    currentChartTypeItems() {
      const res = [
        { caption: 'Общее распределение', value: CHART_TYPE.FULL },
        { caption: 'Мои сообщения', value: CHART_TYPE.MY },
        { caption: 'Сообщения собеседника', value: CHART_TYPE.OTHER },
        { caption: 'Относительно', value: CHART_TYPE.RELATIVE },
      ];
      return res.filter(({ value: chartType }) => HAS_CHART_TYPES[this.currentChart].includes(chartType));
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
    currentChart(chart) {
      this.currentChartType = HAS_CHART_TYPES[chart] ? HAS_CHART_TYPES[chart][0] : CHART_TYPE.FULL;
    },
  },
  methods: {
    getWordCountDistribution(word) {
      const reduceToWordCount = (count, m) => m.textValue.split(word).length - 1 + count;
      const getValue = messages => messages.reduce(reduceToWordCount, 0);
      const filterRes = (distribution) => {
        const LIMIT = 10 * median(distribution.map(e => e.value));
        return distribution.filter(e => e.value < LIMIT);
      };

      const SELECTED_USER_ID = {
        [CHART_TYPE.FULL]: [this.myId, this.otherId],
        [CHART_TYPE.MY]: [this.myId],
        [CHART_TYPE.OTHER]: [this.otherId],
      };

      const isChosenMessage = m => SELECTED_USER_ID[this.currentChartType].includes(m.fromId);

      return this.getValueDistributionAroundDate({
        messages: this.filteredMessages.filter(isChosenMessage),
        getValue,
        range: this.clusterRange,
        step: this.clusterStep,
        filterRes,
        title: 'Кол-во смайликов',
      });
    },
    getValueDistributionAroundDate({
      messages = this.filteredMessages,
      range = 7, getValue, step = 2, title = 'Distribution', filterRes = d => d,
    }) {
      const [from, to] = this.dateRange;
      const dict = {};
      const toKeyOfDate = date => format(date, 'DD.MM.YYYY');
      const getKeys = (date) => {
        // eslint-disable-next-line
        const middle = range >> 1;
        return Array.from({ length: range }, (_, i) => toKeyOfDate(addDays(date, i - middle)));
      };
      for (let i = 0; i < messages.length; i += 1) {
        const m = messages[i];
        const date = new Date(m.date);
        const keys = getKeys(date);
        for (let j = 0; j < keys.length; j += 1) {
          const key = keys[j];
          if (dict[key]) {
            dict[key].push(m);
          } else {
            dict[key] = [m];
          }
        }
      }
      const distribution = [];
      for (let currentDate = from;
        isBefore(currentDate, to);
        currentDate = addDays(currentDate, step)
      ) {
        const key = toKeyOfDate(currentDate);
        const currentDatePart = dict[key] || [];
        const value = getValue(currentDatePart);
        distribution.push({
          value,
          caption: key,
        });
      }
      return this.getLineChartData(title, filterRes(distribution));
    },
    moveRange(days) {
      const [from, to] = this.dateRange;
      const nextFrom = addDays(from, days);
      const nextTo = addDays(to, days);
      this.dateRange = [nextFrom, nextTo];
    },
    getLineChartData(lbl, ...distributions) {
      const distributionToDataSetItem = (distrItem) => {
        if (Array.isArray(distrItem)) {
          return ({
            data: distrItem.map(({ caption, value }) => ({ x: caption, y: value })),
            pointBackgroundColor: 'rgb(43, 82, 120)',
            label: lbl,
            backgroundColor: 'rgba(221,223,212, 0.75)',
          });
        }
        const {
          distribution, label = lbl, backgroundColor = 'rgba(221,223,212, 0.75)', pointBackgroundColor = 'rgb(43, 82, 120)',
        } = distrItem;
        return {
          data: distribution.map(({ caption, value }) => ({ x: caption, y: value })),
          label,
          backgroundColor,
          pointBackgroundColor,
        };
      };
      const getLabels = (distrItems) => {
        const [distrItem] = distrItems;
        const distribution = Array.isArray(distrItem) ? distrItem : distrItem.distribution;
        return distribution.map(({ caption }) => caption);
      };
      return {
        labels: getLabels(distributions),
        datasets: distributions.map(distributionToDataSetItem),
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
