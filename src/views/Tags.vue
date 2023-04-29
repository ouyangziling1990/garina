<template>
  <div class="tag_wrap" v-loading="loading">
    <div  v-for="(group, index) in splitDetails">
      <p class="title"> {{group["name_tag_json"][langArrIndex]}}</p>
      <div class="group">
        <div v-for="(item, i) in group.child" class="tag_detail" @click="getLocatInfoArr(item)">
          {{item["name_tag_json"][langArrIndex]}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getTags, getLocateInfo } from "@/api/index";
import Footer from '@/components/Footer'
export default {
  name: "Tags",
  components: {
    Footer
  },
  props: {},
  data() {
    return {
      splitDetails: [],
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
    ...mapState(["linkInfo", "langArrIndex"]),
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
      this.splitDetails = [];
      this.loading = true;
      const tagInfo = await getTags(this.tagId);
      this.tagDetails = tagInfo;
      this.loading = false;
      this.splitTagsArr(tagInfo);
    },
    splitTagsArr(tagInfo) {
      console.log(tagInfo);
      const group = tagInfo.filter(item=>{
        return !item.parent_id
      }).map(item=>{
        item.child = []
        return item
      })
      tagInfo.forEach((item) => {
        group.forEach(g=>{
          if (item.parent_id&&item.parent_id=== g.id) {
            g.child.push(item)
          }
        })
      });
      console.log(group);
      this.splitDetails = group
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
        pathInfo: {
          path: `/tags/${item.link_id}`,
          name: item["name_tag_json"],
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.tag_wrap {
  max-width: 1000px;
  width: 100%;
  height: 100%;
  min-height: 400px;
  margin: 0 auto;
  margin-left: 188px;
  .title {
    font-size: 20px;
    font-weight: bold;
    margin: 40px 0 20px;
  }
  .group {
    margin-top: 2px;
    display: flex;
    flex-wrap: wrap;
  }
  .tag_detail {
    color: #636e89;
    margin: 5px 15px 10px 0;
    text-decoration: underline;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .first_header{
    margin-top: 5px !important;
  }
  .wrap {
    &:first-child {
      // margin-top: 5px !important;
    }
  }
}
</style>
