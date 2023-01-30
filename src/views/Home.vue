<template>
  <div class="Home">
    <MainHeader></MainHeader>
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
      <div class="tag_wrap" v-if="showTagFlag">
        <div
          v-for="(splitItem, index) in splitDetails"
          :key="'split_id' + index"
        >
          <p
            v-for="item in splitItem"
            :class="[
              item.parent_id === null ? 'tag_detail_header' : 'tag_detail',
            ]"
            :key="item.id"
            @click="getLocatInfoArr(item)"
          >
            {{ item["name_tag_json"][0] }}
          </p>
        </div>
      </div>
      <div class="location_wrap" v-if="showLocationFlag">
        <Region></Region>
      </div>
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
      tagDetails: [],
      splitDetails: [[], [], []],
      showTagFlag: false,
      showLocationFlag: false,
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState(["linkInfo"]),
  },
  watch: {
    async linkInfo(val) {
      console.log("linkInfo change", val);
      this.loading = true;
      this.showTagFlag = true;
      this.showLocationFlag = false;
      const tagInfo = await getTags(val.id);
      this.tagDetails = tagInfo;
      this.splitTagsArr(tagInfo)
      this.loading = false;
      console.log("tagInfo", tagInfo);
    },
  },
  methods: {
    splitTagsArr(tagInfo) {
      let index = -1;
      this.splitDetails=[[],[],[]]
      tagInfo.forEach((item) => {
        if (item.parent_id === null) {
          index = index + 1;
          index = index % 3;
        }
        this.splitDetails[index].push(item);
      });
    },
    async getLocatInfoArr(item) {
      console.log('tag info', item)
      this.showTagFlag = false;
      this.showLocationFlag = true;
      if (item.parent_id === null) return;
      const area = await getLocateInfo(item.id);
      console.log("area", area);
      this.$store.commit('Set_Region_Info', area)
      this.$store.commit('Set_Tag_Info', item)
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
    .tag_wrap{
      display: flex;
      flex-direction: row;
      &>div{
        flex:1;
      }
    }
    .tag_detail_header {
      font-size: 20px;
      font-weight: bold;
      margin: 20px 0;
      margin-top: 40px;
    }
    .tag_detail {
      color: #636e89;
      margin: 10px 5px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
