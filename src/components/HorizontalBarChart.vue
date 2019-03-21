<template>
  <div
    v-if="renderedItems && renderedItems.length"
    class="percentage-chart"
  >
    <transition-group name="fade">
      <div
        v-for="item in renderedItems"
        :key="item.caption+' '+item.value"
        class="percentage-chart_chart-item"
        :style="`height: ${height}; background-color: ${bgcolor}`"
      >
        <div class="percentage-chart_percentage color-complement">
          {{ getPercentage(item) }}%
        </div>
        <div
          class="percentage-chart_bar"
          :style="`
            height: ${height};
            width: ${getBarWidth(item)}%;
            background-color: ${barcolor}
          `.trim()"
        />
        <div
          class="percentage-chart_content"
          :style="`color: ${color}`"
        >
          <div class="percentage-chart_text">
            {{ item.caption }}
          </div>
          <div class="percentage-chart_value">
            {{ item.value }}
          </div>
        </div>
      </div>
    </transition-group>
  </div>
  <div v-else>
    <h4>Empty data</h4>
  </div>
</template>
<script>

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    captionProp: {
      type: String,
      default: 'caption',
    },
    valueProp: {
      type: String,
      default: 'value',
    },
    height: {
      type: String,
      default: '50px',
    },
    isMaxValueFullWidth: {
      type: Boolean,
      default: false,
    },
    bgcolor: {
      type: String,
      default: 'rgb(23, 33, 43)',
    },
    color: {
      type: String,
      default: '#dddfd4',
    },
    barcolor: {
      type: String,
      default: 'rgb(43, 82, 120)',
    },
  },
  computed: {
    renderedItems() {
      return this.items.map(item => ({
        caption: item[this.captionProp] === undefined ? 'unknown' : item[this.captionProp],
        value: item[this.valueProp] || 0,
      })).filter(item => Number.isFinite(item.value));
    },
    maxValue() {
      if (this.renderedItems.length === 0) return 100;
      const items = this.renderedItems;
      return Math.max(...items.map(item => item.value));
    },
    fullValue() {
      if (this.renderedItems.length === 0) return 100;
      const items = this.renderedItems;
      return items.reduce((sum, { value }) => sum + value, 0);
    },
  },
  methods: {
    getPercentage({ value }) {
      if (!value) return '0';
      return (value / this.fullValue * 100).toFixed(0);
    },
    getBarWidth({ value }) {
      return this.isMaxValueFullWidth
        ? value / this.maxValue * 100
        : value / this.fullValue * 100;
    },
  },
};
</script>

<style lang="scss">
.percentage-chart_chart-item {
  position: relative;
}

.percentage-chart_percentage {
  position: absolute;
  right: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 1;

  &::after {
    content: ')';
  }

  &::before {
    content: '(';
  }
}

.percentage-chart_content,
.percentage-chart_bar {
  position: absolute;
  top: 0;
  height: 100%;
}

.percentage-chart_content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.percentage-chart_value {
  position: absolute;
  right: 60px;
}
</style>
