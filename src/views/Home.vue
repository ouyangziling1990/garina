<template>
  <div class="Home">
    <MainHeader></MainHeader>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainHeader from '@/components/MainHeader.vue'
export default {
  name: "Home",
  components: {
    MainHeader
  },
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
.Home {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  
}
</style>
