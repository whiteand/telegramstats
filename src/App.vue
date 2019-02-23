<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      stats: state => state.stats,
    }),
  },
};
</script>

<style lang="scss">
@import '@/assets/main.scss'
</style>
