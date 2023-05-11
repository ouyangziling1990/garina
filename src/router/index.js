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
      name:'home2',
      component: ()=>import("@/views/Home"),
      // redirect:'/welcome'
    },
    {
      path:'/',
      name:'home1',
      component: ()=>import('@/views/Home')
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
        // {//在地址为空时，直接跳转cell路由
        //   // path:'',
        //   // name:'',
        //   // alias: ['/', ''],
        //   // component:()=>import("@/views/Welcome")
        //   // redirect:'/welcome'
        // },
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
        {
          path:'/findPsd',
          name:"findPsd",
          component: ()=>import("@/views/FindPsd")
        },
        {
          path:'/resetPsd',
          name:"resetPsd",
          component: ()=>import("@/views/ResetPsd")
        },
      ]
    },

    {
      path:"/lang",
      name:"lang",
      component: ()=>import("@/views/Lang")
    },
    {
      path:'/data',
      redirect: {
        name:'home1'
      }
    },
    {
      path:'*',
      redirect: {
        name:'home1'
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log('router router', router)
  console.log('router to', to)
  console.log('router from', from)
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
