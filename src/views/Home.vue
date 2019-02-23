<template>
  <div class="home">
    <header class="header">
      <Header />
    </header>
    <div class="load-stats-container">
      <LoadStats />
    </div>
    <div class="about-site-container">
      <AboutSite />
    </div>
    <div class="how-to-container">
      <HowToGetStats />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import LoadStats from '@/components/LoadStats.vue';
import AboutSite from '@/components/AboutSite.vue';
import HowToGetStats from '@/components/HowToGetStats.vue';

export default {
  name: 'Home',
  components: {
    Header,
    LoadStats,
    AboutSite,
    HowToGetStats,
  },
};
</script>
