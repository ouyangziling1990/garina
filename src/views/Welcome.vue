<template>
  <div class="Welcome">
    <p class="title">值得信赖的，</p>
    <p class="title">精准的，</p>
    <p class="title">宏观微观经济数据</p>
    <p class="p">体验最全面的经济数据库，覆盖超过213+个国家</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "welcome",
  components: {},
  props: {},
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState([]),
  },
  watch: {},
  methods: {},
};
</script>
<style lang="less" scoped>
.Welcome {
  .title {
    font-size: 30px;
    font-weight: bold;
    line-height: 60px;
  }
  .p {
    margin-top: 20px;
    font-size: 19px;
  }
}
</style>
