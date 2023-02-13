<template>
  <div class="Verify">
    <h1>验证页面</h1>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {verify} from "@/api/index";
export default {
  name: "verify",
  components: {},
  props: {},
  data() {
    return {};
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
        const data = await verify(sub)
    }
  },
};
</script>
<style lang="less" scoped>
.Verify {
    padding: 18px 12px;
    h1{
        font-size: 18px;
        font-weight: bold;
        text-align: center;
    }
}
</style>
