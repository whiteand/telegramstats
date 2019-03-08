<template>
  <div class="home">
    <header class="header">
      <Header />
    </header>
    <div class="load-stats-container">
      <LoadStats
        :is-loaded="isLoaded"
        @loaded="saveFileToStore"
      />
    </div>
    <div class="about-site-container">
      <AboutSite />
    </div>
    <div class="how-to-container">
      <HowToGetStats />
    </div>
    <div class="footer">
      <MainFooter />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import LoadStats from '@/components/LoadStats.vue';
import AboutSite from '@/components/AboutSite.vue';
import HowToGetStats from '@/components/HowToGetStats.vue';
import MainFooter from '@/components/MainFooter.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Home',
  components: {
    Header,
    LoadStats,
    AboutSite,
    HowToGetStats,
    MainFooter,
  },
  computed: {
    ...mapState({
      isLoaded: state => Boolean(state.stats),
    }),
  },
  methods: {
    ...mapActions({
      setStats: 'setStats',
    }),
    saveFileToStore(content) {
      this.setStats(content);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/variables.scss';

.home {
  width: 100%;
}

@media (min-width: $middle-screen) {
  .home {
    max-width: $middle-screen;
    margin: 0 auto;
  }
}
</style>
