<template>
  <div class="tag_wrap">
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
      this.splitTagsArr(tagInfo);
      this.loading = false;
      console.log("tagInfo", tagInfo);
    },
  },
  methods: {
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
      this.$router.push('/region')
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
