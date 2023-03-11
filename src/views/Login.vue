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
          <span>忘记密码？</span>
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
          <span>还没有账号，立即注册</span>
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
        ],
        password: [
          { required: true, message: _this.$t("passwordReq"), trigger: "blur" },
        ],
      },
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState([]),
    loginStatus() {
      return this.accessToken || localStorage.getItem("access_token") ? 1 : 0;
    },
  },
  watch: {},
  methods: {
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
            this.$message.info("登录成功");

            await this.getUserInfo();
            this.$router.push("/welcome");
          }
          this.loading = false;
        } else {
          console.log("error submit!!");
          this.$message.error("登录信息校验未通过，请验证");
          return false;
        }
      });
    },
    async getUserInfo() {
      if (this.loginStatus) {
        const userInfo = await fecthUserInfo();
        console.log("userInfo", userInfo);
        this.userInfo = userInfo;
        this.$store.commit("SET_USER_INFO", userInfo);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.Login {
  background-color: rgb(240, 242, 245);
  padding-top: 10vh;
  height: 100%;
  #login {
    background-color: #fff;
    width: 430px;
    height: 260px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0px 1px 8px 4px rgba(0, 0, 0, 0.12);
    padding: 30px 20px;
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
