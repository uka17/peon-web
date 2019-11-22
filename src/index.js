import Vue from 'vue';
import App from './App.vue';
import '../node_modules/bulma/bulma.sass';

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
