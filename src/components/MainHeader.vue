<template>
  <div>
    <header class="Main_Header">
      <div class="header">
        <img src="/gra_logo.png" class="logo" alt="盖林数据" />

        <div class="logo_opt">
          <el-button plain @click="LoginDialogFlag = true">登录</el-button>
          <el-button type="primary" @click="signUpFlag = true" plain
            >免费注册</el-button
          >
        </div>
      </div>
    </header>
    <el-dialog
      title="欢迎使用盖林数据"
      :visible.sync="LoginDialogFlag"
      width="448px"
    >
      <div class="login_con">
        <el-form ref="form" :rules="rules" :model="form">
          <el-form-item label="" prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="免费注册" :visible.sync="signUpFlag" width="448px">
      <el-form ref="signUpform" :rules="signUprules" :model="signUpform">
        <el-form-item label="" prop="email">
          <el-input
            v-model="signUpform.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="signUpform.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="password2">
          <el-input
            v-model="signUpform.password2"
            placeholder="请再次确认密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="signUpFormSubmit('ruleForm')"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Login } from "@/api/index";
export default {
  name: "MainHeader",
  components: {},
  props: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.signUpform.password2 !== "") {
          this.$refs.signUpform.validateField("password2");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.signUpform.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      LoginDialogFlag: false,
      form: {
        username: "",
        password: "",
        grant_type: "",
        scope: "",
        client_id: "",
        client_secret: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      // 注册
      signUpFlag: false,
      signUpform: {
        email: "",
        password: "",
        password2: "",
      },
      signUprules: {
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState([]),
  },
  watch: {},
  methods: {
    async submitForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const loginRes = await Login(this.form);
          const accessToken = loginRes.access_token;
          if (accessToken) {
            localStorage.setItem("access_token", accessToken);
          }
        } else {
          console.log("error submit!!");
          this.$message.error("登录信息校验未通过，请验证");
          return false;
        }
      });
    },

    async signUpFormSubmit() {
      this.$refs["signUpform"].validate(async (valid) => {
        if (valid) {
          // const loginRes = await Login(this.form);
          // const accessToken = loginRes.access_token;
          // if (accessToken) {
          //   localStorage.setItem("access_token", accessToken);
          // }
        } else {
          this.$message.error('验证失败，请查验')
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
header {
  width: 100%;
  height: 70px;
  background: #fff;
  border: 1px solid #f6f5f7;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 21;
  box-shadow: 0 3px 2px -2px rgb(200 200 200 / 15%);
}
.header {
  height: 70px;
  display: flex;
  align-items: center;
  width: 1200px;
  margin: auto;
  .logo {
    width: 130px;
    height: 40px;
  }
  .logo_opt {
    margin-left: auto;
    width: 150px;
    display: flex;
    justify-content: space-between;
  }
}
.login_con {
  padding: 0 10px;
}
</style>
