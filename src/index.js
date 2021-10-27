import Vue from "vue";
import App from "./App.vue";
import "./components/main.sass";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  template: "<App/>",
  components: { App },
});
