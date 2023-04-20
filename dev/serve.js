import Vue from "vue";
import Dev from "./serve.vue";
import VueCronEditor from "../src/entry";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(VueCronEditor);
Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Dev),
}).$mount("#app");
