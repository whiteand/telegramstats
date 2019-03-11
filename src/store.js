import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/**
 * @typedef {{
 *  date: string,
 *  from: string | null,
 *  fromId: string | null,
 *  id: string
 *  mediaType: string | null,
 *  text: Array<{ type: string, text: string }>
 * }} Message
 */

const MUTATIONS = {
  SET_STATS: 'SET_STATS',
};

export default new Vuex.Store({
  state: {
    stats: null,
  },
  getters: {
    isLoaded: state => Boolean(state.stats),
    chatsInfo: state => (state.stats
      ? state.stats.chats.map(chat => ({ name: chat.name, id: chat.id }))
      : []),
  },
  /* eslint-disable no-param-reassign */
  mutations: {
    [MUTATIONS.SET_STATS](state, stats) {
      state.stats = stats;
    },
  },
  /* eslint-enable */
  actions: {
    setStats({ commit }, stats) {
      commit(MUTATIONS.SET_STATS, stats);
    },
  },
});
