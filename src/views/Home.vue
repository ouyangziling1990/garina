<template>
  <div class="Home">
    <MainHeader></MainHeader>
    <div class="content" v-loading="loading">
      <p
        v-for="item in tagDetails"
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
import MainHeader from "@/components/MainHeader.vue";
import { getTags, getLocateInfo } from "@/api/index";
export default {
  name: "Home",
  components: {
    MainHeader,
  },
  props: {},
  data() {
    return {
      loading: false,
      tagDetails: [],
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
      this.loading = true
      const tagInfo = await getTags(val.id);
      this.tagDetails = tagInfo;
      this.loading = false
      console.log("tagInfo", tagInfo);
    },
  },
  methods: {
    async getLocatInfoArr(item){
      if(item.parent_id === null) return
      const area = await getLocateInfo(item.id)
      console.log('area', area)
    }
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
  .content {
    padding: 5px 20px;
    flex:1;
    .tag_detail_header {
      font-size: 20px;
      font-weight: bold;
      margin: 20px 0;
    }
    .tag_detail {
      color: #636e89;
      margin: 5px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
