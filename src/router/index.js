import Vue from "vue"
import Router from "vue-router"
import Body from "@/views/Body.vue"
import axios from "axios"
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: "/garnia",
      name: "body",
      component: Body
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.query.cloudToken) {
    console.log("参数cloudToken：" + to.query.cloudToken)
    axios.defaults.headers.common["Authorization"] = `Bearer ${to.query.cloudToken}`
    window.isIframe = true
  }
  next()
})
export default router
