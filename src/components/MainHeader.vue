
<i18n>
  {
    "en": {
      "login": "sign in",
      "signUp":"sign up"
    },
    "zh-CN":{
      "login":"登录",
      "signUp": "注册"
    }
  }
</i18n>
<template>
  <div class="header_wrap">
    <header class="Main_Header">
      <div class="header">
        <img src="/gra_logo.png" class="logo" alt="盖林数据" />
        <div>
          <span
            v-for="item in filterHeaderTags"
            class="name_link"
            @click="getIndex(item)"
            :key="item.id"
          >
            {{ item.name_link_json[langArrIndex] }}</span
          >
        </div>

        <div class="logo_opt">
          <div class="lang-wrap">
            <el-dropdown  @command="langCommand">
              <el-button type="text">
                {{ langLabel||'中文' }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-if="loginStatus === 0">
            <el-button plain @click="LoginDialogFlag = true">{{ $t("login") }}</el-button>
            <el-button type="primary" @click="signUpFun" plain
              >{{ $t("signUp") }}</el-button
            >
          </div>
          <div v-else>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ userInfo.username || ""
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="loginOut">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
      <el-form
        label-width="99px"
        ref="signUpform"
        :rules="signUprules"
        :model="signUpform"
      >
        <el-form-item label="姓名" prop="fullname">
          <el-input
            v-model="signUpform.fullname"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model="signUpform.username" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item label="国家或区域" prop="region_id">
          <el-select
            v-model="signUpform.region_id"
            filterable
            placeholder="国家或区域"
            @change="regionChange"
          >
            <el-option
              v-for="item in infrastructureArr"
              :key="item.id"
              :label="item.region_json[0]"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="brith_date">
          <el-date-picker
            v-model="signUpform.brith_date"
            type="date"
            placeholder="出生日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="signUpform.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="signUpform.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input
            v-model="signUpform.password2"
            placeholder="请再次确认密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="国际区号" prop="regionNum">
          <el-select
            v-model="signUpform.regionNum"
            filterable
            :disabled="regionNumDisabled"
            placeholder="国家或区域"
          >
            <el-option
              v-for="item in infrastructureArr"
              :key="'region_num+' + item.id"
              :label="item.regionNumLabel"
              :value="item.call_code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneInput">
          <el-input
            v-model="signUpform.phoneInput"
            type="number"
            placeholder="电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="signUpform.company" placeholder="公司"></el-input>
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
import { mapState, mapGetters } from "vuex";
import {
  Login,
  links,
  fecthUserInfo,
  signUp,
  infrastructure,
} from "@/api/index";
import langMap from '@/utils/langMap.js'
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
      lang: "中文",
      // 地区名称 及区号
      infrastructureArr: [],
      linksArr: [],

      LoginDialogFlag: false,
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
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      // 注册
      signUpFlag: false,
      regionNumDisabled: false,
      signUpform: {
        fullname: "",
        // 区域id
        region_id: "",
        brith_date: "",
        company: "",
        // 昵称
        username: "",
        regionNum: "",
        regionNumObj: "",
        regionObj: "",

        phone: "",
        phoneInput: "",
        email: "",
        password: "",
        password2: "",
      },
      signUprules: {
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        fullname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        username: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        region_id: [
          { required: true, message: "请输入国家或区域", trigger: "blur" },
        ],
        brith_date: [
          { required: true, message: "请输入生日", trigger: "blur" },
        ],
        regionNum: [{ required: true, message: "国际区号", trigger: "blur" }],
        phoneInput: [{ required: true, message: "电话号码", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }],
      },
      accessToken: "",
      userInfo: "",
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.initFetch();

  },
  computed: {
    ...mapState(["langArrIndex", "langLabel"]),
    ...mapGetters(["filterHeaderTags"]),
    loginStatus() {
      return this.accessToken || localStorage.getItem("access_token") ? 1 : 0;
    },
  },
  watch: {},
  methods: {
    langCommand(cmd){
      const op = langMap[cmd]
      this.$root.$i18n.locale = cmd
      this.lang = op['label']
      // this.langArrIndex = op['index']
      const index = op['index']
      this.$store.commit('SET_LANG_ARR_INDEX', index)
      this.$store.commit('SET_LANG_LABEL', op['label'])
      // window.location.reload()
    },
    regionChange(val) {
      if (val == 247) {
        this.regionNumDisabled = true;
        this.signUpform.regionNum = 86;
        // {id:'247', regionNumLabel:'+86（中国大陆）'}
      } else {
        this.regionNumDisabled = false;
      }
    },
    async initFetch() {
      await this.getUserInfo();
      await this.getLinks();
    },

    // 注册请求
    async signUpFun() {
      this.signUpFlag = true;
      const data = await infrastructure();
      data.forEach((item) => {
        item.regionNumLabel = `+${item.call_code}（${item.region_json[0]}）`;
      });
      this.infrastructureArr = data;
    },
    handleCommand(command) {
      if (command === "loginOut") {
        localStorage.removeItem("access_token");
        this.$router.push("/");
      }
    },
    // 获取指标内容
    getIndex(item) {
      this.$emit("showTag", item);
      this.$store.commit("CHANG_LINK_INFO", item);
      const pathInfo = {
        name: item.name_link_json[0],
        path: `/tags/${item.id}`,
      };
      this.$store.commit("SET_LINK_ARR", { index: 0, pathInfo });
    },
    //
    async getLinks() {
      this.loading = true;
      const res = await links();
      this.linksArr = res;
      this.loading = false;
      this.$store.commit("SET_TAG_ARR", res);
    },
    async submitForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const loginRes = await Login(this.form);
          const accessToken = loginRes.access_token;
          if (accessToken) {
            this.accessToken = accessToken;
            localStorage.setItem("access_token", accessToken);
            this.$message.info("登录成功");
            this.LoginDialogFlag = false;
            this.getUserInfo();
          }
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
    async signUpFormSubmit() {
      this.$refs["signUpform"].validate(async (valid) => {
        if (valid) {
          this.signUpFlag.phone = `+${this.signUpFlag.regionNum} ${this.signUpFlag.phone}`;
          const res = await signUp(this.signUpform);
          this.$message.success("注册成功，请前往邮箱验证");
          console.log("res", res);
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
.header_wrap {
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
    // width: 200px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .lang-wrap{
      margin-right: 10px;
    }
  }
}
.login_con {
  padding: 0 10px;
}
</style>
