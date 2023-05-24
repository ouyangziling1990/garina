<i18n>
  {
    "en": {
      "login": "sign in",
      "signUp":"sign up",
      "email":"email",
      "emailReq":"val is not email",
      "password":"password",
      "passwordReq":"password is required",
      "search":"Search"

    },
    "zh-CN":{
      "login":"登录",
      "signUp": "注册",
      "email":"请输入邮箱",
      "emailReq":"请输入正确邮箱",
      "password":"密码",
      "passwordReq":"请输入密码",
      "search":"搜索"
    }
  }
</i18n>
<template>
  <div class="header_wrap">
    <header class="Main_Header">
      <div class="header">
        <span class="bimicon icon-sandaogang web-show linker-icon" @click="showLinker('ltr')"></span>
        <span class="bimicon icon-touping web-show linker-icon" @click="showLinker('btt')">&nbsp{{ currentLink?currentLink.name_link_json[this.langArrIndex]:'' }}</span>
        <img src="/DATA.GARINASSET.COM.logo.white.png" class="logo" alt="加林数据" />
        <div class="header-content">
          <div class="header-item-wrap mobile-none">
            <span v-for="item in filterHeaderTags" class="name_link" :class="[item.active ? 'active' : '']" @click="getIndex(item)" :key="'header_' + item.id">
              {{ item.name_link_json[langArrIndex] }}</span
            >
          </div>
          <TopSearch class="search" />

          <!-- <div class="mobile-none" v-if="showAccountDelete">
            <el-button type="danger" @click="deleteA">删除</el-button>
          </div> -->
        </div>
        <div class="logo_opt mobile-none">
          <div class="lang-wrap">
            <i class="white bimicon icon-diqiuquanqiu"></i>
            <el-dropdown @command="langCommand">
              <span class="label">{{ langLabel || '简体中文' }}<i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="login-btns-wrap" @click="goToLogin" v-if="loginStatus === 0">
            <div class="wrap">
              <i class="bimicon icon-renyuan"></i>
              <div id="login-btns">登录/注册</div>
            </div>
            <!-- <el-button plain @click="LoginDialogFlag = true">{{
              $t("login")
            }}</el-button>
            <el-button type="primary" @click="signUpFun" plain>{{
              $t("signUp")
            }}</el-button> -->
          </div>
          <div v-if="loginStatus">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-user" v-if="userInfo?.username"></i>
                {{ userInfo?.username || '' }}<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="loginOut">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>
    <el-drawer :with-header="false" size="270px" :visible.sync="drawer.drawerFlag" :direction="drawer.direction">
      <div id="draw-content">
        <div class="logo-wrap" v-if="drawer.direction == 'ltr'">
          <img src="/DATA.GARINASSET.COM.logo.blue.png" class="logo" alt="加林数据" />
        </div>
        <div class="mobile-header-item-wrap web-show">
          <span v-for="item in filterHeaderTags" class="name_link" :class="[item.active ? 'active' : '']" @click="getIndex(item)" :key="'header_' + item.id">
            {{ item.name_link_json[langArrIndex] }}</span
          >
        </div>
        <div class="login-btns-wrap" @click="goToLogin" v-if="loginStatus === 0 && drawer.direction === 'ltr'">
          <div class="wrap" style="color: #000">
            <div id="login-btns">登录/注册</div>
          </div>
          <!-- <el-button plain @click="LoginDialogFlag = true">{{
              $t("login")
            }}</el-button>
            <el-button type="primary" @click="signUpFun" plain>{{
              $t("signUp")
            }}</el-button> -->
        </div>
        <div class="lang-wrap">
          <i class="white bimicon icon-diqiuquanqiu"></i>
          <el-dropdown @command="langCommand">
            <span class="label">{{ langLabel || '简体中文' }}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { links, fecthUserInfo, deleteAccount, infrastructure } from '@/api/index'
import langMap from '@/utils/langMap.js'
import TopSearch from '@/components/TopSearch'

export default {
  name: 'MainHeader',
  components: { TopSearch },
  props: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.signUpform.password2 !== '') {
          this.$refs.signUpform.validateField('password2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.signUpform.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const _this = this
    return {
      currentLinkName:"",
      drawer: {
        drawerFlag: false,
        direction: 'ltr', // btt
      },
      // 搜索
      searchInput: '',
      // 地区名称 及区号
      infrastructureArr: [],
      linksArr: [],

      LoginDialogFlag: false,
      form: {
        email: '',
        username: '',
        password: '',
        grant_type: '',
        scope: '',
        client_id: 'ZW1haWwu',
        client_secret: '',
      },
      rules: {
        // 虽然叫username但是输入的还是邮箱
        username: [
          {
            type: 'email',
            message: _this.$t('emailReq'),
            trigger: ['blur', 'change'],
          },
        ],
        password: [{ required: true, message: _this.$t('passwordReq'), trigger: 'blur' }],
      },
      // 注册
      signUpFlag: false,
      regionNumDisabled: false,
      signUpform: {
        fullname: '',
        // 区域id
        region_id: '',
        brith_date: '',
        company: '',
        // 昵称
        username: '',
        regionNum: '',
        regionNumObj: '',
        regionObj: '',

        phone: '',
        phoneInput: '',
        email: '',
        password: '',
        password2: '',
      },
      signUprules: {
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
        fullname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        region_id: [{ required: true, message: '请输入国家或区域', trigger: 'blur' }],
        brith_date: [{ required: true, message: '请输入生日', trigger: 'blur' }],
        regionNum: [{ required: true, message: '国际区号', trigger: 'blur' }],
        phoneInput: [{ required: true, message: '电话号码', trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        password2: [{ validator: validatePass2, trigger: 'blur' }],
      },
      accessToken: '',
      // userInfo: "",
      currentLink: null,
    }
  },
  beforeCreate() {},
  created() {
    window.addEventListener('resize', this.resizeFun)
  },
  mounted() {
    this.initFetch()
    // 初始化时获取缓存的语言内容
    if (this.lang) {
      this.$root.$i18n.locale = this.lang
    }
  },
  computed: {
    ...mapState(['langArrIndex', 'langLabel', 'lang', 'userInfo']),
    ...mapGetters(['filterHeaderTags']),
    loginStatus() {
      return this.userInfo || localStorage.getItem('access_token') ? 1 : 0
    },
    localI18n() {
      return this.$root.$i18n
    },
    showAccountDelete() {
      return process.env.NODE_ENV !== 'production'
    },
  },
  watch: {
    langArrIndex() {},
  },
  methods: {
    resizeFun() {
      const windowWidth = document.body.offsetWidth
      if (windowWidth > 1200) {
        this.drawer.drawerFlag = false
      }
    },
    showLinker(type = 'ltr') {
      console.log('type', type)
      this.drawer.drawerFlag = !this.drawer.drawerFlag
      this.drawer.direction = type
    },
    async deleteA() {
      const res = await deleteAccount()
      setTimeout(() => {
        this.goToLogin()
      }, 3000)
    },
    goToLogin() {
      this.closeDrawer()
      this.$router.push('/login')
    },
    langCommand(cmd) {
      const op = langMap[cmd]
      this.$root.$i18n.locale = cmd
      console.log('this.$root.$i18n', this.$root.$i18n.t('header.login'))

      const index = op['index']
      this.$store.commit('SET_LANG_ARR_INDEX', index)
      this.$store.commit('SET_LANG_LABEL', op['label'])
      this.$store.commit('SET_LANG', cmd)

      console.log('this.$route', this.$route)
      if (this.$route.name == 'tagDetail') {
        // 有表格的页面需要reload
        this.$nextTick(() => {
          window.location.reload()
        })
      }
      //
    },
    regionChange(val) {
      if (val == 247) {
        this.regionNumDisabled = true
        this.signUpform.regionNum = 86
        // {id:'247', regionNumLabel:'+86（中国大陆）'}
      } else {
        this.regionNumDisabled = false
      }
    },
    async initFetch() {
      await this.getUserInfo()
      await this.getLinks()
    },

    // 注册请求
    async signUpFun() {
      this.signUpFlag = true
      const data = await infrastructure()
      data.forEach((item) => {
        item.regionNumLabel = `+${item.call_code}（${item.region_json[this.langArrIndex]}）`
      })
      this.infrastructureArr = data
    },
    handleCommand(command) {
      if (command === 'loginOut') {
        localStorage.removeItem('access_token')
        console.log('logOut')
        window.location.reload()
        // this.$router.push("/");
      }
    },
    // 获取指标内容
    getIndex(item) {
      this.filterHeaderTags.forEach((item) => (item.active = false))
      this.$set(item, 'active', true)
      // item.active = true
      this.$emit('showTag', item)
      this.$store.commit('CHANG_LINK_INFO', item)
      const pathInfo = {
        name: item.name_link_json,
        path: `/tags/${item.id}`,
      }
      if (item.id === 1) {
        pathInfo.path = '/'
      }
      this.$store.commit('SET_LINK_ARR', { index: 0, pathInfo })
      this.$forceUpdate()
      this.currentLink = item
      document.title = `${this.currentLink.name_link_json[this.langArrIndex]} - DATA.GARINASSET.COM`

      this.closeDrawer()
    },
    closeDrawer() {
      // 移动端兼容， 导航条时关闭抽屉
      if (this.drawer.drawerFlag) {
        this.drawer.drawerFlag = false
      }
    },
    //
    async getLinks() {
      this.loading = true
      const res = await links()
      this.linksArr = res
      this.loading = false
      res.forEach((item) => (item.active = false))
      console.log(res)
      if (res.length > 0) {
        res[0]['active'] = true
      }
      this.$store.commit('SET_TAG_ARR', res)
    },
    async getUserInfo() {
      if (this.loginStatus) {
        const userInfo = await fecthUserInfo()
        // console.log("userInfo", userInfo);
        // this.userInfo = userInfo;
        this.$store.commit('SET_USER_INFO', userInfo)
      }
    },
  },
}
</script>
<style lang="less" scoped>
.header_wrap {
  height: 72px;
  position: relative;
  .mobile-none {
    @media screen and (max-width: 1200px) {
      display: none !important;
    }
  }
  .web-show {
    @media screen and (min-width: 1200px) {
      display: none !important;
    }
  }
  .linker-icon {
    color: #fff;
    margin-left: 10px;
  }
  #draw-content {
    padding-top: 2rem;
    padding-left: 1rem;
    .login-btns-wrap{
      margin-left: 0px;
      .wrap{
        padding-left:0px;
      }
    }
    .logo-wrap {
      text-align: center;
      margin-bottom: 1rem;
      img {
        height: 30px;
      }
    }
  }
  .mobile-header-item-wrap {
    display: flex;
    flex-direction: column;
    // padding-left: 1rem;
    padding-bottom: 1rem;
    .name_link {
      color: #000;
      height: 2rem;
      line-height: 2rem;
    }
  }
}
header {
  width: 100%;
  // height: 70px;
  // background: #1d498f;
  background: #1269c1;
  // rgb(30, 101, 213);
  // border: 1px solid #f6f5f7;
  padding: 0;
  @media screen and (min-width: 1200px) {
    // position: absolute;
  }
  top: 0;
  left: 0;
  z-index: 21;
  box-shadow: 0 3px 2px -2px rgb(200 200 200 / 15%);
}
.header {
  height: 70px;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1200px) {
    justify-content: space-between;
  }
  .header-content {
    // width: 100%;
    height: 100%;
    // flex: 1;
    display: flex;
    align-items: center;
    @media screen and (max-width: 1199.96px) {
      justify-content: flex-end;
      padding-right: 0.6rem;
    }
    @media screen and (min-width: 1200px) {
      flex: 1;
    }

    .header-item-wrap {
      height: 100%;
      display: flex;
      align-items: center;
      // font-size: 16px;
    }
  }
  .name_link {
    margin: 0 4px;
    color: #fff;
    cursor: pointer;
    height: 100%;
    line-height: 85px;
    padding: 0 8px;
    margin-bottom: 15px;
    overflow: hidden;
  }
  .active {
    // background: linear-gradient(180deg, rgba(0, 108, 255, 0) 0%, #006cff 100%);
    line-height: 88px;
    border-bottom: 3.5px solid #fff;
  }
  .logo {
    height: 30px;
    padding-right: 10px;
    @media screen and (max-width: 1200px) {
      display: none;
    }
  }
  .logo_opt {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .lang-wrap {
      margin-right: 15px;
      .white {
        color: #fff;
        margin-right: 5px;
      }
      .label {
        color: white;
        display: inline-block;
        height: 20px;
        line-height: 20px;
      }
      /deep/ .el-icon-arrow-down {
        display: none;
      }
    }
  }
}
.login-btns-wrap {
  margin: 0 9px;
  color: #fff;
  i {
    margin-right: 5px;
  }
  #login-btns {
    display: inline-block;
  }
  .wrap {
    height: 38px;
    line-height: 38px;
    border: 1px solid #fff;
    border-radius: 11px;
    padding: 0 7px;
    cursor: pointer;
  }
}
/deeep/.dialog .el-dialog {
  border-radius: 20px;
  background-color: red;
}
.search {
  margin-left: 20px;
  // width: 300px;
  flex: 1;
  margin-right: 10px;
  max-width: 350px;
  display: flex;
  align-items: center;
}
.login_con {
  padding: 0 10px;
}
.el-dropdown-link {
  color: #fff;
}
</style>
