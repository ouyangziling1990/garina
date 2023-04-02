<i18n>
{
  "en": {

    "successMsg":"Your email has been verified and now you can log in to your account",
    "failMsg":"Your email was not verified because the verification link has expired or is not supported.",
    "successMsgBefore": "The page will automatically jump to the login page after ",
    "successMsgEnd": "S",
    "immediateJump": "Immediate jump"
  },
  "zh-CN":{

    "successMsg":"您的邮箱已经通过验证，现在您可以登录你的账户",
    "failMsg":"您的邮箱没有通过验证，因为 验证链接 已过期或不受支持。",
    "successMsgBefore": "页面将在",
    "successMsgEnd": "S 后自动跳转到登录页，",
    "immediateJump": "立即跳转"
  }
}
</i18n>
<template>
  <div class="Verify" v-loading="loading">
    <UpTips></UpTips>
    <div class="content" v-if="showFlag">
      <h1>{{ $t('successMsg') }}</h1>
      <p>
        {{ $t('successMsgBefore') }} {{ timeRemain }} {{ $t('successMsgEnd')
        }}<span @click="goto('login')">{{ $t('immediateJump') }}</span>
      </p>
    </div>
    <div class="content" v-else>
      <h2>{{ $t('failMsg') }}</h2>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { verify } from '@/api/index'
import UpTips from '@/components/UpTips.vue'
export default {
  name: 'verify',
  components: {
    UpTips
  },
  props: {},
  data() {
    return {
      showFlag: false,
      loading: false,
      returnBakEmail: '',
      timeRemain: 10
    }
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.parseSub()
  },
  computed: {
    ...mapState([])
  },
  watch: {},
  methods: {
    async parseSub() {
      const sub = this.$route.query.sub
      console.log('sub', sub)
      if (!sub) {
        return
      }
      this.loading = true
      try {
        const res = await verify(sub)
        // if(data.status_code === 200){
        this.returnBakEmail = res.data.email
        this.showFlag = true
        this.countRemain()
        // }
      } catch (error) {
        // this.$message.error('验证失败')
      }
      this.loading = false
    },
    countRemain() {
      if (this.timeRemain > 1) {
        setTimeout(() => {
          this.countRemain()
          this.timeRemain -= 1
        }, 1000)
      } else {
        this.goto('login')
      }
    },
    goto(type) {
      if (type === 'login') {
        const query = {
          email: this.returnBakEmail
        }
        this.$router.replace({ path: '/login', query })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.Verify {
  padding: 0px 12px;
  h1 {
    font-size: 22px;
    // font-weight: bold;
    text-align: center;
  }
  .content {
    margin-top: 30px;
    text-align: center;
    p {
      margin-top: 15px;
      span {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    span {
      &:hover {
        color: rgb(36, 153, 200);
      }
    }
  }
}
</style>
