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
    <div
      v-if="stats"
      class="content"
    >
      <div class="infoblock">
        <div class="infoblock-content">
          <h3>Message Count</h3>
          <MessageCount
            :stats="stats"
          />
        </div>
      </div>
      <h3>Choose chat</h3>
      <ChooseOne
        v-model="selectedChatId"
        :items="chatsInfo.map(chat => ({ value: chat.id, caption: chat.name }))"
      />
      <template v-if="selectedChatId">
        <div class="infoblock">
          <div class="infoblock-content">
            <h3>Chat balance charts:</h3>
            <ChatBalanceCharts
              :chat="() => getChatById(selectedChatId)"
            />
          </div>
        </div>
        <div class="infoblock">
          <div class="infoblock-content">
            <h3>Last messages</h3>
            <LastMessages
              :stats="stats"
              :chat-id="selectedChatId"
            />
          </div>
        </div>
      </template>
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
import LastMessages from '@/components/LastMessages.vue';
import MessageCount from '@/components/MessageCount.vue';
import ChatBalanceCharts from '@/components/ChatBalanceCharts.vue';
import { scroller } from 'vue-scrollto/src/scrollTo';
import { mapGetters, mapState } from 'vuex';

const scrollTo = scroller();

export default {
  name: 'Charts',
  components: {
    Header,
    ChooseOne,
    MainFooter,
    MessageCount,
    LastMessages,
    ChatBalanceCharts,
  },
  data() {
    return {
      isFooterHighlighted: false,
      selectedChatId: null,
    };
  },
  computed: {
    ...mapGetters({
      chats: 'chats',
      chatsDict: 'chatsDict',
      isLoaded: 'isLoaded',
    }),
    ...mapState({
      stats: state => state.stats,
    }),
    chatsInfo() {
      return this.chats.map(chat => ({ name: chat.name || 'Unknown', id: chat.id }));
    },

  },
  created() {
    if (!this.isLoaded) {
      this.$router.push({ path: '/' });
      return;
    }
    this.selectedChatId = this.chatsInfo[0].id;
  },
  methods: {
    scrollTo,
    getChatById(id) {
      return this.chatsDict[id];
    },
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
  color: $complement;
  background: $main;

}

h3 {
  text-transform: uppercase;
  text-align: center;
}

.infoblock {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  min-height: 100vh;
  padding: 20px 0;
}

.charts {
  width: 100%;
  box-shadow: 0 0 20px black;
}

@media (min-width: $tiny-screen) {
  .infoblock {
    &-content {
      max-width: 80%;
    }
  }
}

@media (min-width: $middle-screen) {
  .charts {
    max-width: $middle-screen;
    margin: 0 auto;
  }

  .infoblock {
    padding: 30px;
  }
}
</style>
