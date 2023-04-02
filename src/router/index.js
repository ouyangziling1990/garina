import Vue from "vue"
import Router from "vue-router"
import axios from "axios"
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
Vue.use(Router)

const router = new Router({
  mode:'history',
  routes: [
    {
      path:'',
      redirect:'/welcome'
    },
    {
      path: "/garnia",
      name: "body",
      component: ()=>import("@/views/Body")
    },
    {
      path:'/home',
      name:"home",
      component: ()=>import("@/views/Home"),
      children:[
        {//在地址为空时，直接跳转cell路由
          path:'',
          redirect:'/welcome'
        },
        {
          path:`/welcome`,
          name:'welcome',
          component:()=>import("@/views/Welcome")
        },
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
          path:`/indicator/:indicatorId`,
          name:'indicatorDetail',
          component:()=>import("@/views/IndicatorDetail")
        },
        {
          path:`/welcome`,
          name:'welcome',
          component:()=>import("@/views/Welcome")
        },
        {
          path:"/login",
          name:"login",
          component:()=> import("@/views/Login")
        },
        {
          path:"/signup",
          name:"signup",
          component:()=> import("@/views/SignUp")
        },
        {
          path:"/findaccent",
          name:"findaccent",
          component:()=> import("@/views/FindAccent")
        },
        {
          path:'/verify',
          name:"verify",
          component: ()=>import("@/views/Verify")
        },
      ]
    },

    {
      path:"/lang",
      name:"lang",
      component: ()=>import("@/views/Lang")
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log('router to', router)
  if (to.query.cloudToken) {
    console.log("参数cloudToken：" + to.query.cloudToken)
    axios.defaults.headers.common["Authorization"] = `Bearer ${to.query.cloudToken}`
    window.isIframe = true
  }
  if(to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
