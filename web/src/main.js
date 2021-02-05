import Vue from 'vue'
import App from './App.vue'
import router from './modules/router'
import axios from 'axios'
import store from './store'

import moment from 'moment'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);


Vue.prototype.$moment = moment;
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
