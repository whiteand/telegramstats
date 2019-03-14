import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';
import vSelect from 'vue-select';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.use(ElementUI);

Vue.component('v-select', vSelect);
Vue.use(VueScrollTo);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
