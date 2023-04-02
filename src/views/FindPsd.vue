<i18n>
    {
      "en": {
       "resetPsd": "Reset Password",
       "sendemailSuccess":"A reset password email with a verification link has been sent to your Email address",
       "wrongEmail": "This account is invalid or not supported.",
        "verifyEmail":"Verify your email"
      },
      "zh-CN":{
        "resetPsd": "重置密码",
        "sendemailSuccess":"一封含有验证链接的重置密码邮件，已经发送至你的邮箱",
        "wrongEmail":"此账号无效或不受支持。",
        "verifyEmail":"验证你的邮箱"
      }
    }
</i18n>
<template>
  <div class="Verify" v-loading="loading">
    <div class="up">
      <p>{{ $t('resetPsd') }}</p>
      <div class="next">
        <el-button @click="goto('login')" type="text">登录</el-button>
        <el-button type="text">没有收到邮件？</el-button>
        <el-button type="text">隐私保护</el-button>
      </div>
    </div>
    <div id="content">
      <div class="left">
        <p class="title">忘记密码？</p>
        <p class="desc">输入你的账号信息，即可开始</p>
        <div class="wrap">
          <el-form ref="form" :rules="rules" :model="form">
            <el-form-item label="" class="form-item" prop="email">
              <el-input
                v-model="form.email"
                placeholder="邮箱"
                @change="changeHandler"
                :disabled="sendemailOk"
              ></el-input>
            </el-form-item>
            <div class="wrong-email" v-if="errorEmail">
              {{ $t('wrongEmail') }}
            </div>
            <div>
              <p class="findaccent-p">
                如果您忘记了账号，可以<span
                  class="findaccent"
                  type="text"
                  @click="goto('findaccent')"
                  >查找账号 </span
                >。
              </p>
            </div>
            <el-form-item>
              <el-button
                type="primary"
                class="btn wider"
                :disabled="sendemailOk"
                @click="submitForm('ruleForm')"
                >继续</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>

      <el-divider class="divider" direction="vertical"></el-divider>
      <div class="right">
        <img
          v-if="sendemailOk"
          src="../assets/image/shield-success.png"
          alt=""
        />
        <img v-else src="../assets/image/shield-default.png" alt="" />
        <div v-if="sendemailOk">
          <h2 class="info-title">{{ $t('verifyEmail') }}</h2>
          <p>{{ $t('sendemailSuccess') }} {{ form.email }}</p>
        </div>
        <div v-else>
          你可以在此处重设忘记的密码。出于安全考虑，我们将向你的邮箱发送验证邮件，以验证该帐户属于你。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { resetSendemail } from '@/api/index'

export default {
  name: 'verify',
  components: {},
  props: {},
  data() {
    return {
      form: {
        email: ''
      },
      rules: {
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      },
      sendemailOk: false,
      errorEmail: false,
      loading: false
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
          try {
            const obj = this.form
            console.log(this.form)
            let url_password_reset = ''
            if (process.env.NODE_ENV !== 'production') {
              url_password_reset =
                'http://data-dev.gaichiyaole.icu:4080/resetPsd?sub='
            } else {
              const loca = window.location
              url_password_reset =
                loca.protocol + '//' + loca.host + '/resetPsd?sub='
            }
            obj.url_password_reset = encodeURI(url_password_reset)
            console.log(obj, process.env.NODE_ENV)
            const res = await resetSendemail(obj)
            console.log(res)
            this.sendemailOk = true
            // this.normalFlag = false
            // if (res?.status_code === 200) {
            //   this.findFlag = true
            //   this.findBackEmail = res.data.email
            // }
          } catch (error) {
            this.errorEmail = true
          }

          this.loading = false
          console.log('res', res)
        }
      })
    },
    goto(type) {
      this.$router.push('/findaccent')
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
  // flex-direction: column;
  justify-content: center;
  align-items: center;

  .left {
    text-align: left;
    width: 350px;
    .title {
      margin: 10px 0 20px;
      font-size: 24px;
      height: 50px;
      line-height: 50px;
      // font-weight: bold;
    }
    .desc {
      margin: 0 0 20px;
    }
    .findaccent-p {
      font-size: 14px;
      .findaccent {
        color: #3067bb;
      }
    }

    .btn {
      margin-top: 20px;
    }
  }
  .divider {
    margin: 40px;
    height: 250px;
  }
  .right {
    width: 350px;
    text-align: left;
    display: flex;
    color: #6e6e6e;
    line-height: 1.4;
    font-size: 14px;
    img {
      height: 50px;
      margin: 0 20px 0 40px;
    }
  }
}
.wrong-email {
  color: #e7322d;
  margin-bottom: 10px;
}
.wrap {
  width: 300px;
}
.info {
  margin-top: 80px;
  .info-title {
    font-size: 22px;
    // font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
  }
}
</style>
