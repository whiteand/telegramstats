<template>
  <div
    v-if="renderedItems && renderedItems.length"
    class="percentage-chart"
  >
    <transition-group name="fade">
      <div
        v-for="item in renderedItems"
        :key="item.caption+' '+item.value"
        class="chart-item"
        :style="`height: ${height}; background-color: ${bgcolor}`"
      >
        <div class="percentage">
          {{ (item.value / fullValue * 100).toFixed(0) }}%
        </div>
        <div
          class="bar"
          :style="`
            height: ${height};
            width: ${item.value / fullValue * 100}%;
            background-color: ${barcolor}
          `.trim()"
        />
        <div
          class="content"
          :style="`color: ${color}`"
        >
          <div class="text">
            {{ item.caption }}
          </div>
          <div class="value">
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
        caption: item[this.captionProp] || 'unknown',
        value: item[this.valueProp] || 0,
      })).filter(item => Number.isFinite(item.value));
    },
    maxValue() {
      const items = this.renderedItems;
      if (this.items.length === 0) return 100;
      return Math.max(...items.map(item => item.value));
    },
    fullValue() {
      const items = this.renderedItems;
      if (this.items.length === 0) return 100;
      return items.reduce((sum, { value }) => sum + value, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-item {
  position: relative;
}

.percentage {
  position: absolute;
  right: 10px;
  height: 100%;
  display: flex;
  align-items: center;

  &::after {
    content: ')';
  }

  &::before {
    content: '(';
  }
}

.content,
.bar {
  position: absolute;
  top: 0;
  height: 100%;
}

.content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.value {
  position: absolute;
  right: 60px;
}
</style>
