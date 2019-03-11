<template>
  <div
    id="home"
    class="charts"
  >
    <header class="header">
      <Header
        :hidden-links="[
          { emit: 'contactUs', title: 'Сообщить нам' }
        ]"
        @charts="$router.push({ path: '/charts/'})"
        @contactUs="scrollToContactUs"
      />
    </header>
    <div class="content">
      <ChooseOne :items="['andrew', 'white', 'is', 'the', 'best', 'developer', 'in', 'the', 'world']">
        <div class="chat-item" slot-scope="{item, select}">
          {{item}}
        </div>
      </ChooseOne>
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
import MainFooter from '@/components/MainFooter.vue';
import ChooseOne from '@/components/ChooseOne.vue';
import { scroller } from 'vue-scrollto/src/scrollTo';
import { mapGetters, mapActions } from 'vuex';

const scrollTo = scroller();

export default {
  name: 'Home',
  components: {
    Header,
    ChooseOne,
    MainFooter,
  },
  data() {
    return {
      isFooterHighlighted: false,
    };
  },
  computed: {
    ...mapGetters({
      chats: 'chats',
      isLoaded: 'isLoaded',
    }),
  },
  created() {
    if (!this.isLoaded) {
      this.$router.push({ path: '/' });
    }
  },
  methods: {
    scrollTo,
    ...mapActions({
      setStats: 'setStats',
    }),
    scrollToContactUs() {
      scrollTo('#contact-us', {
        onDone: () => {
          this.isFooterHighlighted = true;
          window.setTimeout(() => {
            this.isFooterHighlighted = false;
          }, 1000);
        },
      });
    },
  },

};
</script>
<style lang="scss" scoped>
@import '@/assets/variables.scss';
@import '@/assets/colors.scss';

.content {
  color: $main;
  background: $complement;
}

.charts {
  width: 100%;
  box-shadow: 0 0 20px black;
}

@media (min-width: $middle-screen) {
  .charts {
    max-width: $middle-screen;
    margin: 0 auto;
  }
}
</style>
