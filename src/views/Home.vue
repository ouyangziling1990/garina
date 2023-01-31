<template>
  <div class="Home">
    <MainHeader @showTag="showTag"></MainHeader>
    <div class="link">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>标签</el-breadcrumb-item>
        <el-breadcrumb-item>国家</el-breadcrumb-item>
        <el-breadcrumb-item>区域</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content" v-loading="loading">
      <router-view />

      <!-- <div class="location_wrap" v-if="showLocationFlag">
        <Region></Region>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainHeader from "@/components/MainHeader.vue";
import { getTags, getLocateInfo } from "@/api/index";
import Region from "@/views/Region";
export default {
  name: "Home",
  components: {
    MainHeader,
    Region,
  },
  props: {},
  data() {
    return {
      loading: false,
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState([""]),
  },
  watch: {},
  methods: {
    showTag() {
      console.log("router", this.$router);
      const currentRoute = this.$router.currentRoute;
      if (currentRoute.name != "tags") {
        this.$router.push(`/tags`);
      }
    },

    
  },
};
</script>
<style lang="less" scoped>
.Home {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  .link {
    padding: 20px 20px 10px;
    height: 14px;
  }
  .content {
    padding: 5px 20px;
    flex: 1;
    overflow: auto;
  }
}
</style>
