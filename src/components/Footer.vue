<template>
  <div class="Footer">关于</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {}
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState([]),
  },
  watch: {},
  methods: {},
}
</script>
<style lang="less" scoped>
.Footer {
  box-sizing: border-box;
  height: 120px;
  background-color: rgba(215, 217, 215, 0.2);
  padding: 10px;
  margin-top: 20px;
//   position: absolute;
  width: 100%;
//   bottom: -40px;
}
</style>
