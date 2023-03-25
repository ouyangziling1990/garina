<template>
  <div class="Verify" v-loading="loading">
    <UpTips></UpTips>
    <div class="content" v-if="showFlag">
      <h1>您的邮箱已经通过验证，现在您可以登录你的账户</h1>
      <p>页面将在 {{timeRemain}}S 后自动跳转到登录页，<span click="goto">立即跳转</span></p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {verify} from "@/api/index";
import UpTips from "@/components/UpTips.vue";
export default {
  name: "verify",
  components: {
    UpTips
  },
  props: {},
  data() {
    return {
      showFlag: false,
      loading:false,
      returnBakEmail:'',
      timeRemain:10
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.parseSub()
  },
  computed: {
    ...mapState([]),
  },
  watch: {},
  methods: {
    async parseSub(){
        const sub = this.$route.query.sub
        console.log('sub', sub)
        if(!sub){
          return
        }
        this.loading = true
        try {
          const data = await verify(sub)
          // if(data.status_code === 200){
            this.returnBakEmail = data.email
            this.showFlag = true
            this.countRemain()
          // }
        } catch (error) {
        }
        this.loading = false
    },
    countRemain(){
      if(this.timeRemain>1){
        setTimeout(()=>{
          this.countRemain()
          this.timeRemain -= 1
        }, 1000)
      }else{
        this.goto()
      }
    },
    goto(){
      this.$router.replace({path:'/login', email:this.returnBakEmail})
    }
  },
};
</script>
<style lang="less" scoped>
.Verify {
    padding: 18px 12px;
    h1{
        font-size: 22px;
        // font-weight: bold;
        text-align: center;
    }
    .content{
      margin-top: 30px;
      text-align: center;
      p{
        margin-top: 15px;
        span{
          text-decoration: underline;
          cursor: pointer;
        }
      }
      span{
        &:hover{
          color: rgb(36, 153, 200);
        }
      }
    }
}
</style>
