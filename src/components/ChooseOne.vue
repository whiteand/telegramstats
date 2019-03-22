<template>
  <el-select
    :value="value"
    @input="value => $emit('input', value)"
  >
    <el-option
      v-for="item in items"
      :key="item.value"
      :label="item.caption"
      :value="item.value"
    />
  </el-select>
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
