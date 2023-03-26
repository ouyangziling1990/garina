<i18n>
    {
      "en": {
        "login": "sign in",
        "signUp":"sign up",
        "email":"email",
        "emailReq":"val is not email",
        "password":"password",
        "passwordReq":"password is required"

      },
      "zh-CN":{
        "login":"登录",
        "signUp": "注册",
        "email":"请输入邮箱",
        "emailReq":"请输入正确邮箱",
        "password":"密码",
        "passwordReq":"请输入密码"
      }
    }
  </i18n>
<template>
  <div class="SignUp">
    <UpTips></UpTips>
    <!-- !gotoEmailFlag -->
    <div class="center" v-show="!gotoEmailFlag">
      <div class="up-text">
        <p class="h1">创建您的账号</p>
        <p>只需一个账号，您即可访问 GarinAsset LLC 旗下的所有产品。</p>
        <p>已有账号？<el-button type="text" @click="goto('findaccent')">点此查找</el-button>。</p>
      </div>
      <div class="form">
        <el-form label-width="0px" ref="signUpform" :rules="signUprules" :model="signUpform">
          <div class="split-wrap">
            <div class="item-wrap">
              <el-form-item prop="fullname">
                <div class="wrap">
                  <el-input v-model="signUpform.fullname" placeholder="请输入姓名"></el-input>
                </div>
                <el-tooltip content="在某些场景，此信息有助于找回您的账号" placement="bottom" effect="light">
                  <i class="blue el-icon-question"></i>
                </el-tooltip>
              </el-form-item>
            </div>
            <div class="item-wrap">
              <el-form-item label="" prop="region_id">
                <div class="wrap">
                  <el-select style="width: 100%" v-model="signUpform.region_id" filterable placeholder="国家或地区" @change="regionChange">
                    <el-option v-for="item in infrastructureArr" :key="item.id" :label="item.region_json[0]" :value="item.id"> </el-option>
                  </el-select>
                </div>
              </el-form-item>
            </div>
            <div class="item-wrap">
              <el-form-item label="" prop="brith_date">
                <div class="wrap">
                  <el-date-picker
                    v-model="signUpform.brith_date"
                    type="date"
                    style="width: 100%"
                    placeholder="出生日期"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </div>
                <el-tooltip content="此信息用于决定您的账号可以使用哪些服务" placement="bottom" effect="light">
                  <i class="blue el-icon-question"></i>
                </el-tooltip>
              </el-form-item>
            </div>

            <div class="item-wrap">
              <el-form-item label="" prop="company">
                <div class="wrap">
                  <el-input v-model="signUpform.company" placeholder="公司 可不填"></el-input>
                </div>
              </el-form-item>
            </div>
          </div>

          <div class="split-wrap">
            <div class="item-wrap">
              <el-form-item label="" prop="username">
                <div class="wrap">
                  <el-input v-model="signUpform.username" placeholder="昵称"></el-input>
                </div>
                <el-tooltip content="某些场景，此信息将用于您的个人信息展示" placement="bottom" effect="light">
                  <i class="blue el-icon-question"></i>
                </el-tooltip>
              </el-form-item>
            </div>

            <div class="item-wrap">
              <div class="tip">这将是您的账号</div>
              <el-form-item label="" prop="email">
                <div class="wrap">
                  <el-input v-model="signUpform.email" placeholder="请输入邮箱"></el-input>
                </div>
              </el-form-item>
            </div>
            <div class="item-wrap">
              <el-form-item label="" prop="password">
                <div class="wrap">
                  <el-input v-model="signUpform.password" placeholder="请输入密码" show-password></el-input>
                </div>
              </el-form-item>
            </div>
            <div class="item-wrap">
              <el-form-item label="" prop="password2">
                <div class="wrap">
                  <el-input v-model="signUpform.password2" placeholder="请再次确认密码" show-password></el-input>
                </div>
              </el-form-item>
            </div>
          </div>

          <div class="split-wrap">
            <div class="item-wrap">
              <el-form-item label="" prop="regionNum">
                <div class="wrap">
                  <el-select style="width: 100%" v-model="signUpform.regionNum" filterable :disabled="regionNumDisabled" placeholder="电话区号">
                    <el-option v-for="item in infrastructureArr" :key="'region_num+' + item.id" :label="item.regionNumLabel" :value="item.call_code">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
            </div>
            <div class="item-wrap">
              <el-form-item label="" prop="phoneInput">
                <div class="wrap">
                  <el-input v-model="signUpform.phoneInput" type="number" placeholder="电话"></el-input>
                </div>
              </el-form-item>
            </div>
          </div>

          <div class="split-wrap no-bottom">
            <div class="item-wrap des">
              你的 个人信息 被用于确保你能够安全登录并访问你的数据。出于安全性、支持和报告的目的，GarinAsset LLC会记录某些数据。如果你同意，GarinAsset LLC
              还会使用你的 账号 信息向你发送 营销电子邮件和交流信息（可能会基于你的 产品使用情况）。
              <el-button type="text">了解数据的管理方式</el-button>。
            </div>
            <div class="item-wrap">
              <el-form-item>
                <div class="wrap">
                  <el-button type="primary" style="width: 100%" @click="signUpFormSubmit('ruleForm')">{{ $t('signUp') }}</el-button>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="center" v-show="gotoEmailFlag">
      <div class="up-text">
        <p class="h1" style="margin-top: 15px">验证您的邮箱</p>
        <p style="margin-top: 10px; font-size: 17px">
          一封含有验证链接的确认邮件，已经发送至您的邮箱
          {{ this.signUpform.email }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { signUp, infrastructure, acceptUserName, acceptEmail } from '@/api/index'
import { mapState } from 'vuex'
import UpTips from '@/components/UpTips.vue'
export default {
  name: 'SignUp',
  components: {
    UpTips,
  },
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
    const userNameUniVal = async (rule, value, callback) => {
      let res = ''
      if (!value) {
        callback()
        return
      }
      try {
        res = await acceptUserName(value)
      } catch (error) {
        res = error
        console.log('accept user error', error)
      }
      console.log('acceptUserName res', res)
      console.log('acceptUserName value', value)
      const status_code = res.status_code
      if (status_code === 202) {
        callback()
      } else {
        callback(new Error(res?.status_description[0]))
      }
    }
    const emailUniVal = async (rule, value, callback) => {
      let res = ''
      if (!value) {
        callback()
        return
      }
      try {
        res = await acceptEmail(value)
        const status_code = res.status_code
        if (status_code === 202) {
          callback()
        }
      } catch (error) {
        console.log(error)
        callback(new Error(error?.status_description[0]))
      }
      console.log('acceptEmail res', res)
      console.log('acceptEmail value', value)
    }
    const _this = this
    return {
      gotoEmailFlag: false,
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
        url_signup: '',
      },
      signUprules: {
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
          { validator: emailUniVal, trigger: 'blur' },
        ],
        fullname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        username: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { validator: userNameUniVal, trigger: 'blur' },
        ],
        region_id: [{ required: true, message: '请输入国家或区域', trigger: 'blur' }],
        brith_date: [{ required: true, message: '请输入生日', trigger: 'blur' }],
        regionNum: [{ required: true, message: '国际区号', trigger: 'blur' }],
        phoneInput: [{ required: true, message: '电话号码', trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        password2: [{ validator: validatePass2, trigger: 'blur' }],
      },
      infrastructureArr: [],
      infrastructure: '',
    }
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.signUpFun()
  },
  computed: {
    ...mapState(['langArrIndex']),
  },
  watch: {},
  methods: {
    goto(type) {
      if (type === 'login') {
        this.$router.push('/login')
      }
      if (type === 'findaccent') {
        this.$router.push('/findaccent')
      }
    },
    async signUpFormSubmit() {
      this.$refs['signUpform'].validate(async (valid) => {
        if (valid) {
          // this.signUpform.phone = `+${this.signUpform.regionNum} ${this.signUpform.phoneInput}`;
          const tmpSign = JSON.parse(JSON.stringify(this.signUpform))
          tmpSign.phone = `+${this.signUpform.regionNum}` + ' ' + this.signUpform.phoneInput
          let url_signup = ''
          if (process.env.NODE_ENV !== 'production') {
            url_signup = 'http://data-dev.gaichiyaole.icu:4080/#/verify?sub='
          } else {
            const loca = window.location
            url_signup = loca.protocol + '//' + loca.host + '/#/verify?sub='
          }
          tmpSign.url_signup = url_signup
          const res = await signUp(tmpSign)
          this.$message.success('注册成功，请前往邮箱验证')
          console.log('res', res)

          this.gotoEmailFlag = true
        } else {
          this.$message.error('验证失败，请查验')
          return false
        }
      })
    },
    regionChange(val) {
      this.regionNumDisabled = true
      const tmpR = this.infrastructureArr.find((item) => item.id == val)
      this.signUpform.regionNum = tmpR.call_code
      // if (val == 247) {
      //   this.signUpform.regionNum = 86;
      //   // {id:'247', regionNumLabel:'+86（中国大陆）'}
      // } else {
      //   this.regionNumDisabled = false;
      // }
    },
    // 注册请求
    async signUpFun() {
      //   this.signUpFlag = true;
      const data = await infrastructure()
      data.forEach((item) => {
        item.regionNumLabel = `+${item.call_code}（${item.region_json[this.langArrIndex]}）`
      })
      this.infrastructureArr = data
    },
  },
}
</script>
<style lang="less" scoped>
.SignUp {
  display: flex;
  flex-direction: column;
  height: 100%;

  .center {
    flex: 1;
    width: 700px;
    margin: 0 auto;
    // border: 1px solid red;
    margin-bottom: 10px;

    .up-text {
      height: 96px;
      margin-top: 5px;
      text-align: center;
      p {
        height: 20px;
        line-height: 20px;
      }
      .h1 {
        font-size: 25px;
        height: 40px;
        line-height: 40px;
      }
    }
    .split {
      height: 1px;
      border-bottom: 1px solid rgba(99, 97, 97, 0.2);
    }
    .form {
      margin-top: 10px;
      .split-wrap {
        border-bottom: 1px solid rgba(99, 97, 97, 0.2);
        margin-bottom: 20px;
        .wrap {
          width: 350px;
          display: inline-block;
        }
        .blue {
          color: #1d498f;
          margin-left: 20px;
          font-size: 18px;
        }
        .item-wrap {
          width: 400px;
          margin-left: 150px;
          .tip {
            font-size: 12px;
            margin: 10px 0;
            color: #898a8d;
          }
        }
        .des {
          width: 500px;
          margin-left: 100px;
          color: #898a8d;
          line-height: 16px;
          font-size: 12px;
          margin-bottom: 12px;
          /deep/ .el-button {
            padding: 2px 0px !important;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
