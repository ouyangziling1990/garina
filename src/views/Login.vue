<i18n>
    {
      "en": {
        "login": "Sign In",
        "signUp":"Sign Up",
        "email":"Email",
        "emailReq":"Please provide a valid email address.",
        "password":"Password",
        "passwordReq":"Please enter your password to continue."

      },
      "zh-CN":{
        "login":"登录",
        "signUp": "注册",
        "email":"邮箱",
        "emailReq":"请提供有效的电子邮件地址。",
        "password":"密码",
        "passwordReq":"请输入您的密码以继续。"
      }
    }
  </i18n>
<template>
  <div class="Login" v-loading="loading">
    <div id="login">
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item label="" class="form-item1" prop="username">
          <el-input
            v-model="form.username"
            :placeholder="$t('email')"
          ></el-input>
        </el-form-item>
        <p class="forget-p">
          <span @click="forgetPsdHandler">忘记密码？</span>
        </p>
        <el-form-item label="" prop="password">
          <el-input
            v-model="form.password"
            :placeholder="$t('password')"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="btn"
            @click="submitForm('ruleForm')"
            >{{ $t("login") }}</el-button
          >
        </el-form-item>
        <p class="forget-p">
          <span @click="gotoSignup">还没有账号，立即注册</span>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Login, fecthUserInfo } from "@/api/index";
export default {
  name: "Login",
  components: {},
  props: {},
  data() {
    const _this = this;
    return {
      loading: false,
      accessToken: "",
      form: {
        email: "",
        username: "",
        password: "",
        grant_type: "",
        scope: "",
        client_id: "ZW1haWwu",
        client_secret: "",
      },
      rules: {
        // 虽然叫username但是输入的还是邮箱
        username: [
          {
            type: "email",
            message: _this.$t("emailReq"),
            trigger: ["blur", "change"],
          },
          { required: true, message: _this.$t("emailReq"), trigger: "blur" }

        ],
        password: [
          { required: true, message: _this.$t("passwordReq"), trigger: "blur" },
        ],
      },
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {
    const query = this.$route.query
    if(query.email){
      this.form.email = query.email
      this.form.username = query.email
    }
  },
  computed: {
    ...mapState(['userInfo']),
    loginStatus() {
      return this.userInfo || this.accessToken || localStorage.getItem("access_token") ? 1 : 0;
    },
  },
  watch: {},
  methods: {
    gotoSignup(){
      this.$router.push("/signup");
    },
    async submitForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          let  loginRes = ''
          try {
            loginRes = await Login(this.form);
          } catch (error) {
            console.log('loginError', error)
            const msg1 = error.status_description[0]
            // this.$message.error(msg1)
            this.loading = false
          }

          const accessToken = loginRes?.access_token;
          if (accessToken) {
            this.accessToken = accessToken;
            localStorage.setItem("access_token", accessToken);
            // this.$message.info("登录成功");

            await this.getUserInfo();
            this.goBack()
          }
          this.loading = false;
        } else {
          console.log("error submit!!");
          this.$message.error("登录信息校验未通过，请验证");
          return false;
        }
      });
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
    async getUserInfo() {
      if (this.loginStatus) {
        const userInfo = await fecthUserInfo();
        console.log("userInfo", userInfo);
        this.userInfo = userInfo;
        this.$store.commit("SET_USER_INFO", userInfo);
      }
    },
    forgetPsdHandler(){
      this.$router.push("/findPsd");
    },
  },
};
</script>
<style lang="less" scoped>
.Login {
  background-color: rgb(240, 242, 245);
  padding-top: 10vh;
  height: 100vh;
  @media screen and (max-width: 768px) {
    background-color: #fff;
  }
  #login {
    background-color: #fff;
    max-width: 470px;
    height: 320px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0px 1px 8px 4px rgba(0, 0, 0, 0.12);
    padding: 30px 20px;
    @media screen and (max-width: 768px) {
      box-shadow: none;
    }
    .form-item1 {
      margin-bottom: 12px;
    }
    .forget-p {
      text-align: right;
      margin-bottom: 12px;
      color: #268dff;
      span {
        cursor: pointer;
        font-size: 13px;
      }
    }
  }
  .btn {
    width: 100%;
  }
}
</style>
