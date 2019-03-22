<template>
  <div class="choose-one-wrapper">
    <div
      v-for="item in itemsToShow"
      :key="item.value"
      :class="[
        'choose-one-item',
        item.value === value ? 'chosen' : 'not-chosen'
      ]"
      @click="$emit('input', item.value)"
    >
      {{ item.caption }}
    </div>
  </div>
</template>

<script>
import { v } from 'explained-quartet';

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
      validator: v.arrayOf({
        value: ['string', 'number'],
        caption: ['string', 'number'],
      }),
    },
    value: {
      type: [String, Number],
      default: 0,
    },
    size: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    itemsToShow() {
      const index = this.items.findIndex(item => item.value === this.value);
      if (index < 0) {
        return this.items.slice(0, 2 * this.size);
      }
      const start = Math.max(0, index - this.size);
      const end = start + this.size * 2;
      return this.items.slice(start, end);
    },
  },
  methods: {
    select(item) {
      this.$emit('input', item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
@import '@/assets/variables.scss';

.choose-one-wrapper {
  display: flex;
  justify-content: space-around;
  background-color: $complement;
  padding: 10px;
}

.choose-one-item {
  color: $main;
  cursor: pointer;
  margin: 5px;
  padding: 5px 10px;
  font-size: 1rem;

  &.chosen {
    font-weight: bold;
    color: $accent;
    background-color: $main;
  }
}
</style>
