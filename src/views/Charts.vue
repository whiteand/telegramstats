<template>
  <div
    id="home"
    class="charts"
  >
    <header class="charts_header">
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
      class="charts_content bg-color-main"
    >
      <el-collapse
        v-model="activeCharts"
        accordion
      >
        <el-collapse-item
          class="bg-color-main"
          title="Сравнение чатов по кол-ву сообщений"
          name="messageCount"
        >
          <div class="charts_infoblock">
            <div class="charts_infoblock-content">
              <h3>Message Count</h3>
              <MessageCount
                :stats="stats"
              />
            </div>
          </div>
        </el-collapse-item>
        <h3 class="bg-color-complement color-main">
          Choose chat
        </h3>
        <ChooseOne
          v-model="selectedChatId"
          :items="chatsInfo.map(chat => ({ value: chat.id, caption: chat.name }))"
        />
        <template v-if="selectedChatId">
          <el-collapse-item
            class="bg-color-main"
            title="Статистика чата"
            name="chatBalance"
          >
            <div class="charts_infoblock">
              <div class="charts_infoblock-content">
                <h3>Chat balance charts:</h3>
                <ChatBalanceCharts
                  :chat="() => getChatById(selectedChatId)"
                />
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item
            class="bg-color-main"
            title="Графики времени"
            name="chatTimeCharts"
          >
            <ChatTimeCharts
              :chat="() => getChatById(selectedChatId)"
            />
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
    <div
      id="contact-us"
      class="charts_footer"
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
import MessageCount from '@/components/MessageCount.vue';
import ChatBalanceCharts from '@/components/ChatBalanceCharts.vue';
import ChatTimeCharts from '@/components/ChatTimeCharts.vue';
import { scroller } from 'vue-scrollto/src/scrollTo';
import { mapGetters, mapState } from 'vuex';

const scrollTo = scroller();

export default {
  name: 'Charts',
  components: {
    Header,
    ChooseOne,
    ChatTimeCharts,
    MainFooter,
    MessageCount,
    ChatBalanceCharts,
  },
  data() {
    return {
      isFooterHighlighted: false,
      selectedChatId: null,
      activeCharts: [],
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
<style lang="scss">
@import '@/assets/variables.scss';
@import '@/assets/colors.scss';

.charts_content {
  color: $complement;
  background: $main;
}

.el-collapse-item__header {
  font-size: 1.5rem;
  font-weight: bold;
  padding: 10px;
  background-color: $main;
  color: $complement;
}

.el-collapse-item__content {
  background-color: $main;
  color: $complement;
}

h3 {
  margin: 0;
  background-color: $main;
  color: $complement;
  text-transform: uppercase;
  text-align: center;
}

.charts_infoblock {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  min-height: 100vh;
  padding: 20px 0;
  background-color: $main;
}

.charts {
  width: 100%;
  box-shadow: 0 0 20px black;
}

@media (min-width: $tiny-screen) {
  .charts_infoblock {
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

  .charts_infoblock {
    padding: 30px;
  }
}
</style>
