import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import api from "@/api/index";

import "@/assets/reset.less";
import axios from "@/utils/axiosInterceptors";
import GET_TOKEN from "@/utils/getGeipToken";
// import "element-ui/lib/theme-chalk/index.css";
// 图标
import "@/assets/font/iconfont.css"
import "/node_modules/flag-icons/css/flag-icons.min.css";


// Vue.prototype.$loading = Loading.service;
// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
// Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$prompt = MessageBox.prompt;
// Vue.prototype.$notify = Notification;
// Vue.prototype.$message = Message;

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.prototype.$get = axios.get;
Vue.prototype.$post = axios.post;
import _ from "lodash";
Vue.prototype._ = _;
Vue.config.productionTip = false;

// 多语言兼容
import VueI18n from "vue-i18n";

Vue.use(VueI18n);
import messages from "./assets/lang";
const i18n = new VueI18n({
  locale: "zh-CN", // 设置地区
  messages: messages
});
GET_TOKEN({
  geipToken: "1234",
}).then((res) => {
  console.log(res);
  new Vue({
    i18n,
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
});
