import Vue from "vue"
import Router from "vue-router"
import axios from "axios"
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: "/garnia",
      name: "body",
      component: ()=>import("@/views/Body") 
    },
    {
      path:'/',
      name:"home",
      component: ()=>import("@/views/Home"),
      children:[
        {
          path:'/country',
          name:"country",
          component: ()=>import("@/views/Country") 
        },
        {
          path:'/tags/:tagId',
          name:"tags",
          component:()=>import("@/views/Tags")
        },
        {
          path:'/region/:countryId',
          name:"region",
          component:()=>import("@/views/Region")
        },
        {
          path:'/tagDetail/tagId/:tagId/region/:regionId',
          name:'tagDetail',
          component:()=>import("@/views/TagDetail")
        },
        {
          path:`/indicatorDetail/:indicatorId`,
          name:'indicatorDetail',
          component:()=>import("@/views/IndicatorDetail")
        }
      ]
    },
    // {
    //   path:'/region',
    //   name:"region",
    //   component: ()=>import("@/views/Region") 
    // },
    
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
