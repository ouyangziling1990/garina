<template>
    <div class="up">
      <p>{{findFlag?'查找账号':'创建账号'}}</p>
      <div class="next">
        <el-button @click="goto('login')" type="text">登录</el-button>
        <el-button v-if="!findFlag" type="text">没有收到邮件？</el-button>
        <el-button type="text">隐私保护</el-button>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default{
  name: "UpTips",
  components: {},
  props: {
    findFlag:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
    }
  },
  beforeCreate(){},
  created(){},
  mounted(){},
  computed:{
     ...mapState([]),
  },
  watch:{},
  methods:{
    goto(type) {
      if (type === "login") {
        this.$router.push("/login");
      }
    },
  },
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
</style>