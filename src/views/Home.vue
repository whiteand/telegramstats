<template>
  <div
    id="home"
    class="home"
  >
    <header class="header">
      <Header
        :links="[
          { emit: 'charts', title: 'Графики' }
        ]"
        :hidden-links="[
          { emit: 'contactUs', title: 'Сообщить нам' }
        ]"
        @charts="$router.push({ path: '/charts/'})"
        @contactUs="scrollToContactUs"
      />
    </header>
    <div class="load-stats-container">
      <LoadStats
        id="load-stats-id"
        :is-loaded="isLoaded"
        @loaded="saveFileToStore"
      />
    </div>
    <div class="about-site-container">
      <AboutSite id="about-site-id" />
    </div>
    <div class="how-to-container">
      <HowToGetStats id="how-to-get-stats-id" />
    </div>
    <div
      class="footer"
    >
      <MainFooter ref="contactUs" />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import LoadStats from '@/components/LoadStats.vue';
import AboutSite from '@/components/AboutSite.vue';
import HowToGetStats from '@/components/HowToGetStats.vue';
import MainFooter from '@/components/MainFooter.vue';
import VueScrollTo from 'vue-scrollto';
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
    scrollToContactUs() {
      VueScrollTo.scrollTo(
        this.$refs.contactUs,
        400,
        {
          easing: 'ease-in',
          offset: -60,
          force: true,
          cancelable: true,
          onStart(element) {
            console.log('start');
            // scrolling started
          },
          onDone(element) {
            console.log('done');
            // scrolling is done
          },
          onCancel() {
            console.log('cancel');
            // scrolling has been interrupted
          },
          x: false,
          y: true,
        },

      );
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
