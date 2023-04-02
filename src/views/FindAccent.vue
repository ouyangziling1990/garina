<template>
  <div class="FindAccent" v-loading="loading">
    <UpTips :findFlag="findFlagUpTips"></UpTips>
    <div id="content" v-if="normalFlag">
      <p id="findTitle">输入下面信息查找您的账号</p>
      <div class="wrap">
        <el-form ref="form" :rules="rules" :model="form">
          <el-form-item label="" class="form-item1" prop="fullname">
            <el-input v-model="form.fullname" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="" class="form-item1" prop="username">
            <el-input v-model="form.username" placeholder="昵称"></el-input>
          </el-form-item>
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
    </div>
    <div id="find-res" v-if="!normalFlag && findFlag">
      <div class="tips">
        <span class="el-icon-circle-check"></span>
      </div>
      <p class="title1">已找到账号</p>
      <p class="title2">您的账号为：{{ findBackEmail }}</p>
      <p class="button">
        <el-button type="primary" class="wider" @click="goto('login')">访问您的账号</el-button>
      </p>
    </div>
    <div id="not-find" v-if="!normalFlag && !findFlag">
      <div class="tips danger">
        <span class="el-icon-warning-outline"></span>
      </div>
      <p class="title1">没有找到账号</p>
      <p class="title2">我们找不到与提供的信息所匹配的账号。</p>
      <p class="button">
        <el-button type="primary" class="wider"  @click="tryAgain()">再试一次</el-button>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { findAccount } from "@/api/index";
import UpTips from "@/components/UpTips.vue";
export default {
  name: "FindAccent",
  components: {
    UpTips,
  },
  props: {},
  data() {
    return {
      findFlagUpTips:true,
      findBackEmail: "",
      loading: false,
      normalFlag: true,
      findFlag:true,
      form: {
        fullname: "",
        username: "",
      },
      rules: {
        fullname: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: ["blur"],
          },
        ],
        username: [
          {
            required: true,
            message: "昵称不能为空",
            trigger: ["blur"],
          },
        ],
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
    tryAgain(){
      this.normalFlag = true
    },
    submitForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          let res = ''
          try {
            res = await findAccount(this.form);
            this.normalFlag = false
            if(res?.status_code === 200){
              this.findFlag = true
              this.findBackEmail = res.data.email
            }
          } catch (error) {
            this.normalFlag = false
            console.log('error', error)

            this.findFlag = false
          }

          this.loading = false;
          console.log("res", res);
        }
      });
    },
    goto(type){
      if(type === 'login'){
        const query = {
          'email': this.findBackEmail
        }
        this.$router.push({
          path:'/login',
          query
        })
      }
    }
  },
};
</script>
<style lang="less" scoped>
.FindAccent {
  height: 100%;
  #content {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #findTitle {
    margin: 10px 0 20px;
    font-size: 24px;
    height: 50px;
    line-height: 50px;
    // font-weight: bold;
  }
  .wrap {
    width: 300px;
  }

  #find-res, #not-find {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .tips {
      height: 60px;
      line-height: 60px;
      font-size: 70px;
      color: #46c9b5;
      margin: 35px 15px;
    }
    .danger{
      color:rgb(196, 36, 36);
    }
    .title1 {
      font-size: 26px;
      margin: 20px;
    }
    .title2 {
      font-size: 16px;
      margin: 0px 0 30px;
    }
  }
  .wider{
    // width:100px
  }
}
</style>
