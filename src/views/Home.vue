<template>
  <div class="Home">
    <MainHeader @showTag="showTag"></MainHeader>
    <div class="link" v-if="showLink">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(link, index) in linkArr" :key="'link_' + index" :to="link.path">{{ link.name[langArrIndex] }}</el-breadcrumb-item>
        <!-- <el-breadcrumb-item>标签</el-breadcrumb-item>
        <el-breadcrumb-item>国家</el-breadcrumb-item>
        <el-breadcrumb-item>区域</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
        <el-breadcrumb-item>指标详情</el-breadcrumb-item> -->
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="wrap-content">
        <router-view v-if="showRV" />
        <welcome v-if="!showRV"></welcome>
      </div>
      <Footer v-if="!loading"></Footer>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MainHeader from '@/components/MainHeader.vue'
import Footer from '@/components/Footer'
import welcome from '@/views/Welcome'
export default {
  name: 'Home',
  components: {
    MainHeader,
    Footer,
    welcome,
  },
  props: {},
  data() {
    return {
      loading: false,
      showLink: true,
    }
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.hasShowLink()
    console.log('home router', this.$router)
    console.log('home router', this.$route)
  },
  computed: {
    ...mapState(['linkArr', 'langArrIndex']),
    showRV() {
      const path = this.$route.path
      return !(path === '/' || path === '')
    },
  },
  watch: {
    $route: {
      handler: function (to) {
        console.log('to', to)
        const path = to.path
        const linkIndex = this.linkArr.findIndex((item) => item.path === path)
        if (linkIndex != -1) {
          this.$store.commit('SET_LINK_ARR', {
            index: linkIndex,
            pathInfo: this.linkArr[linkIndex],
          })
        }
        this.hasShowLink()
      },
      deep: true,
    },
  },
  methods: {
    showTag(item) {
      console.log('router', this.$router)
      const currentRoute = this.$router.currentRoute
      // if (currentRoute.name != "tags") {
      if (item.id === 1) {
        this.$router.push(`/`)
      } else {
        this.$router.push(`/tags/${item.id}`)
      }
      // }
    },

    hasShowLink() {
      const noLinks = ['', '/', 'welcome', 'indicator', 'login', 'signup', 'findaccent', 'verify', 'resetPsd', 'findPsd', 'testPage']
      const arr = this.$route.path.split('/')
      console.log(arr, '🔥')
      if (noLinks.indexOf(arr[1]) !== -1) {
        this.showLink = false
      } else {
        this.showLink = true
      }
    },
  },
}
</script>
<style lang="less" scoped>
.Home {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  .link {
    // max-width: 1280px;
    @media screen and (min-width: 1540px) {
      padding-left: 185px;
    }
    padding: 20px;
    // height: 14px;
    border-bottom: 1px solid #e8e8e8;

    // margin-left: 168px;
    // width: 1200px;
    /deep/.el-breadcrumb__inner {
      text-decoration: underline;
      color: #646f88;
    }
  }
  .content {
    // max-width: 1280px;
    height: 100%;
    margin: 0 auto;
    width: 100%;
    flex: 1;
    
    @media screen and (min-width: 1200px){
      overflow: auto;
    }
    .wrap-content {
      min-height: 100%;
      height: fit-content;
      // & > div:nth-child(1) {

      // }
    }
  }
}
</style>
