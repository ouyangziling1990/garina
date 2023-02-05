<template>
  <div class="header_wrap">
    <header class="Main_Header">
      <div class="header">
        <img src="/gra_logo.png" class="logo" alt="盖林数据" />
        <div>
          <span v-for="item in linksArr" class="name_link" @click="getIndex(item)" :key="item.id">
            {{ item.name_link_json[0] }}</span
          >
        </div>
        <div class="logo_opt" >
          <div v-if="loginStatus === 0">
            <el-button plain @click="LoginDialogFlag = true">登录</el-button>
            <el-button type="primary" @click="signUpFlag = true" plain
              >免费注册</el-button
            >
          </div>
          <div>
            已登录
          </div>
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
import { Login, links } from "@/api/index";
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
      linksArr: [],

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
  mounted() {
    this.getLinks();
  },
  computed: {
    ...mapState([]),
    loginStatus: () => {
      return localStorage.getItem("access_token") ? 1 : 0;
    },
  },
  watch: {},
  methods: {
    // 获取指标内容
    getIndex(item){
      this.$emit('showTag', item)
      this.$store.commit('CHANG_LINK_INFO', item)
    },
    // 
    async getLinks() {
      this.loading = true;
      const res = await links();
      this.linksArr = res;
      this.loading = false;
      console.log(res);
    },
    async submitForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const loginRes = await Login(this.form);
          const accessToken = loginRes.access_token;
          if (accessToken) {
            localStorage.setItem("access_token", accessToken);
            this.$message.info("登录成功");
            this.LoginDialogFlag = false;
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
          this.$message.error("验证失败，请查验");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.header_wrap{
  height: 72px;
}
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
  .name_link {
    margin-left: 10px;
    cursor: pointer;
  }
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
