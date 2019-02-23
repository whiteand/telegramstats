import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const MUTATIONS = {
  SET_STATS: 'SET_STATS',
};

export default new Vuex.Store({
  state: {
    stats: null,
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
