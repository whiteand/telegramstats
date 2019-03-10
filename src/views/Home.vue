<template>
  <div
    id="home"
    class="home"
  >
    <header class="header">
      <Header
        :links="links"
        :hidden-links="[
          { emit: 'contactUs', title: 'Сообщить нам' }
        ]"
        @aboutSite="scrollTo('#about-site')"
        @howTo="scrollTo('#how-to')"
        @charts="$router.push({ path: '/charts/'})"
        @contactUs="scrollToContactUs"
      />
    </header>
    <div
      id="load-stats"
      class="load-stats-container"
    >
      <LoadStats
        id="load-stats-id"
        :is-loaded="isLoaded"
        @loaded="saveFileToStore"
      />
    </div>
    <div
      id="about-site"
      class="about-site-container"
    >
      <AboutSite />
    </div>
    <div
      id="how-to"
      class="how-to-container"
    >
      <HowToGetStats @toLoadStats="scrollTo('#load-stats')" />
    </div>
    <div
      id="contact-us"
      class="footer"
    >
      <MainFooter
        :is-highlighted="isFooterHighlighted"
      />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import LoadStats from '@/components/LoadStats.vue';
import AboutSite from '@/components/AboutSite.vue';
import HowToGetStats from '@/components/HowToGetStats.vue';
import MainFooter from '@/components/MainFooter.vue';
import { scroller } from 'vue-scrollto/src/scrollTo';
import { mapState, mapActions } from 'vuex';

const scrollTo = scroller();

export default {
  name: 'Home',
  components: {
    Header,
    LoadStats,
    AboutSite,
    HowToGetStats,
    MainFooter,
  },
  data() {
    return {
      isFooterHighlighted: false,
    };
  },
  computed: {
    ...mapState({
      isLoaded: state => Boolean(state.stats),
    }),
    links() {
      const res = [
        { emit: 'aboutSite', title: 'Про сайт' },
        { emit: 'howTo', title: 'HOW TO?' },
      ];
      if (this.isLoaded) {
        res.unshift({ emit: 'charts', title: 'Графики' });
      }
      return res;
    },
  },
  methods: {
    scrollTo,
    ...mapActions({
      setStats: 'setStats',
    }),
    saveFileToStore(content) {
      this.setStats(content);
    },
    scrollToContactUs() {
      scrollTo('#contact-us');
      this.isFooterHighlighted = true;
      window.setTimeout(() => {
        this.isFooterHighlighted = false;
      }, 1000);
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
