<i18n>
    {
      "en": {
       "resetPsd": "Reset Password",
       "sendemailSuccess":"A reset password email with a verification link has been sent to your Email address",
       "wrongEmail": "This account is invalid or not supported.",
       "successMsg":"Your password has been reset successfully, and now you can log in to your account with the new password.",
        "immediateJump": "Go to login"
      },
      "zh-CN":{
        "resetPsd": "重置密码",
        "sendemailSuccess":"一封含有验证链接的重置密码邮件，已经发送至你的邮箱",
        "wrongEmail":"此账号无效或不受支持。",
        "successMsg":"您的密码已经重置成功，现在您使用新的密码可以登录你的账户。",
        "immediateJump": "前往登录"
      }
    }
</i18n>
<template>
  <div class="Verify" v-loading="loading">
    <div class="up">
      <p>{{ $t('resetPsd') }}</p>
      <div class="next">
        <el-button @click="goto('login')" type="text">登录</el-button>
        <!-- <el-button type="text">没有收到邮件？</el-button> -->
        <el-button type="text">隐私保护</el-button>
      </div>
    </div>
    <div id="content">
      <p id="findTitle" v-if="!resetSuccess">输入新的密码</p>
      <div class="wrap" v-if="!resetSuccess">
        <el-form ref="form" :rules="rules" :model="form">
          <el-form-item label="" class="form-item" prop="psd">
            <el-input
              v-model="form.psd"
              placeholder="请输入密码"
              show-password
              @change="changeHandler"
            ></el-input>
          </el-form-item>
          <el-form-item label="" class="form-item" prop="psd2">
            <el-input
              v-model="form.psd2"
              placeholder="请再次确认密码"
              show-password
              @change="changeHandler"
            ></el-input>
          </el-form-item>
          <div class="wrong-email" v-if="errorEmail">
            {{ $t('wrongEmail') }}
          </div>
          <el-form-item>
            <el-button
              type="primary"
              class="btn wider"
              @click="submitForm('ruleForm')"
              >继续</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="success-msg" v-if="resetSuccess">
        {{ $t('successMsg') }}
        <span @click="goto('login')">{{ $t('immediateJump') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { resetPsd } from '@/api/index'

export default {
  name: 'verify',
  components: {},
  props: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.psd2 !== '') {
          this.$refs.form.validateField('psd2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.psd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      form: {
        psd: '',
        psd2: ''
      },
      rules: {
        psd: [{ validator: validatePass, trigger: 'blur' }],
        psd2: [{ validator: validatePass2, trigger: 'blur' }]
      },
      sendemailOk: false,
      errorEmail: false,
      loading: false,
      resetSuccess: false,
      returnBakEmail: ''
    }
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    goto(type) {
      if (type === 'login') {
        this.$router.push('/login')
      }
    },
    changeHandler() {
      this.errorEmail = false
    },
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.loading = true
          let res = ''
          const sub = this.$route.query.sub
          try {
            const obj = { password: this.form.psd, email_access_token: sub }


            const res = await resetPsd(obj)
            console.log(res);
            this.returnBakEmail = res.email
            this.resetSuccess = true
            console.log(res)
          } catch (error) {}
          this.loading = false
          console.log('res', res)
        }
      })
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
.up {
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(99, 97, 97, 0.2);
  p {
    margin-left: 20px;
    font-size: 20px;
    flex: 1;
  }
  .next {
    width: 300px;
    display: flex;
    justify-content: space-around;
    margin-right: 40px;
  }
}
#content {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .success-msg {
    margin-top: 80px;
    span {
      text-decoration: underline;
      cursor: pointer;
      &:hover {
        color: rgb(36, 153, 200);
      }
    }
  }
}
.wrong-email {
  color: #e7322d;
  margin-bottom: 10px;
}
#findTitle {
  margin: 10px 0 20px;
  // font-size: 24px;
  font-size: 1.3rem;
  height: 50px;
  line-height: 50px;
  // font-weight: bold;
}
.wrap {
  width: 300px;
}
</style>
