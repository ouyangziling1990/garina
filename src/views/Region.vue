<template>
  <div class="Region media-align" v-loading="loading">
    <div class="show_data_wrap">
      <div  v-for="(group, index) in region">
        <p class="title"> {{group["region_json"][langArrIndex]}}</p>
        <div class="group">
          <div v-for="(item, i) in group.child"
          :class="{tag_detail:true,allowed:item.clickable}"
          @click="RegionDetail(item)">
            {{item["region_json"][langArrIndex]}}
          </div>
        </div>
      </div>
      <!-- <div class="show_data">
        <p
          v-for="r in region"
          :class="{
            allowed: r.clickable,
            title: r.parent_id === null,
            tag_detail: r.parent_id != null,
          }"
          :key="r.id"
          @click="RegionDetail(r)"
        >
          {{ r.region_json[langArrIndex] }}
        </p>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getRegions, getRegionsByAdmin} from "@/api/index";
export default {
  name: "Region",
  props: {},
  data() {
    return {
      loading: false,
      treeData: [],
      showTableFlag: false,
      defaultProps: {
        children: "children",
        label: "label",
      },
      tableData: [],
      region: [],
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState(["tagInfo", "regionInfo", "langArrIndex", "linkInfo"]),
    countryId() {
      return this.$route.params.countryId;
    },
  },
  watch: {
    countryId: {
      handler(val) {
        if (!val) return;
        // this.orgTreeData(val);
        this.getRegion();
      },
      immediate: true,
    },
  },
  methods: {
    orgTreeData(val) {
      const map = {};
      const arr = [];
      val.forEach((item) => {
        item.label = item.region_json[0];
        map[item.id] = item;
        if (item.parent_id === null) {
          arr.push(item);
        }
      });
      val.forEach((item) => {
        if (item.parent_id) {
          const parent_id = item.parent_id;
          const parent = map[parent_id];
          if (parent) {
            const children = parent.children;
            if (!children) {
              parent.children = [item];
            } else {
              children.push(item);
            }
          }
        }
      });
      this.treeData = arr;
    },
    async getRegion() {
      this.loading = true;
      const tmpRegion = await getRegions(this.countryId,this.linkInfo.linkInfo.url);
      console.log(tmpRegion);
      const group = tmpRegion.filter(item=>{
        return !item.parent_id
      }).map(item=>{
        item.child = []
        return item
      })
      const regions_id = this.regionInfo.regions_id || [];
      console.log(regions_id);
      tmpRegion.forEach((item) => {
        group.forEach(g=>{

        console.log(item,g);
          if (item.parent_id&&item.parent_id=== g.id) {
            item.clickable = false;
            if(regions_id.includes(item.id)){
              item.clickable = true;
            }
            g.child.push(item)
          }
        })
      });
      console.log(group);
      this.region = group
      this.loading = false
    },
    RegionDetail(item) {
      console.log("regionDetail", item);
      if (item.clickable === false) return;
      this.$store.commit("Set_Current_Region", item);
      const countryIdNext = this.$route.params.countryId;
      this.$router.push(
        `/tagDetail/tagId/${this.tagInfo.id}/region/${item.id}`
      );

      this.$store.commit("SET_LINK_ARR", {
        index: 3,
        pathInfo: { path: `/region/${countryIdNext}`, name: item.region_json },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.Region {
  display: flex;
  flex-direction: column;
  height: 100%;
  // margin: 0 auto;
  min-height: 400px;
  .show_data_wrap {
    .title {
      font-size: 20px;
      font-weight: bold;
      margin: 40px 0px 20px;
      cursor: not-allowed;
    }
    .group {
      margin-top: 2px;
      display: flex;
      flex-wrap: wrap;
    }
    .tag_detail {
      color: #aaaaaa;
      margin: 5px 15px 10px 0;;
      cursor: not-allowed;
    }
    .allowed {
      cursor: pointer !important;
      font-size: 16px;
      color: #636e89;
      text-decoration: underline;
       &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}
</style>
