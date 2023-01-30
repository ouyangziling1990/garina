<template>
  <div class="Regions"></div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Regions",
  components: {},
  props: {},
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState(['region']),
  },
  watch: {},
  methods: {},
};
</script>
<style lang="less" scoped>
.Regions {
}
</style>
