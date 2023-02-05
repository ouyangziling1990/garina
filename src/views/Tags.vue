<template>
  <div class="tag_wrap" v-loading="loading">
    <div v-for="(splitItem, index) in splitDetails" :key="'split_id' + index">
      <p
        v-for="item in splitItem"
        :class="[item.parent_id === null ? 'tag_detail_header' : 'tag_detail']"
        :key="item.id"
        @click="getLocatInfoArr(item)"
      >
        {{ item["name_tag_json"][0] }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getTags, getLocateInfo } from "@/api/index";
export default {
  name: "Tags",
  components: {},
  props: {},
  data() {
    return {
      splitDetails: [[], [], []],
      loading: false,
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {
    console.log("mounted");
    this.getlinkInfo();
  },
  computed: {
    ...mapState(["linkInfo"]),
    tagId() {
      return this.$route.params.tagId;
    },
  },
  watch: {
    async linkInfo(val) {
      console.log("linkInfo change", val);
      // const tagInfo = await getTags(val.linkInfo.id);
      // this.tagDetails = tagInfo;
      // this.splitTagsArr(tagInfo);
    },
    tagId() {
      this.getlinkInfo();
    },
  },
  methods: {
    async getlinkInfo() {
      this.splitDetails = [[], [], []];
      this.loading = true;
      const tagInfo = await getTags(this.tagId);
      this.tagDetails = tagInfo;
      this.loading = false;
      this.splitTagsArr(tagInfo);
    },
    splitTagsArr(tagInfo) {
      let index = -1;
      this.splitDetails = [[], [], []];
      tagInfo.forEach((item) => {
        if (item.parent_id === null) {
          index = index + 1;
          index = index % 3;
        }
        this.splitDetails[index].push(item);
      });
    },
    async getLocatInfoArr(item) {
      console.log("tag info", item);
      if (item.parent_id === null) return;
      // 获取区域信息
      const area = await getLocateInfo(item.id);
      console.log("area", area);
      this.$store.commit("Set_Region_Info", area);
      this.$store.commit("Set_Tag_Info", item);
      // this.$router.push('/region')
      this.$router.push("/country");
      this.$store.commit("SET_LINK_ARR", {
        index: 1,
        pathInfo: { path: "/country", name: "国家" },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.tag_wrap {
  display: flex;
  flex-direction: row;
  & > div {
    flex: 1;
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
</style>
