<template>
  <div>
    <slot
      v-for="item in itemsToShow"
      :item="item"
      :select="select"
    />
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: null,
    },
    size: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    itemsToShow() {
      const index = this.items.indexOf(this.value);
      if (index < 0) {
        return this.items.slice(0, this.size);
      }
      const left = Math.max(0, this.index - Math.floor(this.size / 2));
      const right = this.index + this.size;
      return this.slice(left, right);
    },
  },
  methods: {
    select(item) {
      this.$emit('input', item);
    },
  },

};
</script>
