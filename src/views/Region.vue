<template>
  <div class="Region" v-loading="loading">
    <div class="show_data_wrap">
      <div class="show_data">
        <p
          v-for="r in region"
          :class="{
            allowed: r.clickable,
            tag_detail_header: r.parent_id === null,
            tag_detail: r.parent_id != null,
          }"
          :key="r.id"
          @click="RegionDetail(r)"
        >
          {{ r.region_json[0] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getRegions } from "@/api/index";
export default {
  name: "Region",
  props: {},
  data() {
    return {
      loading:false,
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
    ...mapState(["tagInfo", "regionInfo"]),
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
      this.loading = true
      const tmpRegion = await getRegions(this.countryId);
      const regions_id = this.regionInfo.regions_id || [];
      tmpRegion.forEach((item) => {
        item.clickable = false;

        if (regions_id.includes(item.id)) {
          item.clickable = true;
        }
      });
      this.region = tmpRegion;
      this.loading = false
    },
    RegionDetail(item) {
      console.log("regionDetail", item);
      if (item.clickable === false) return;
      this.$store.commit("Set_Current_Region", item);
      this.$router.push(
        `/tagDetail/tagId/${this.tagInfo.id}/region/${item.id}`
      );
      this.$store.commit("SET_LINK_ARR", {
        index: 3,
        pathInfo: { path:'/region', name: item.region_json[0] },
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
  width: 100%;
  // padding: 12px 20px;
  .show_data_wrap {
    display: flex;
    flex-direction: row;
  }
  .show_data {
    flex: 1;
  }

  .tag_detail_header {
    font-size: 20px;
    font-weight: bold;
    margin: 20px 0;
    cursor: not-allowed;
  }
  .tag_detail {
    color: #636e89;
    margin: 5px;
    cursor: not-allowed;
  }
  .allowed {
    cursor: pointer !important;
  }
}
</style>
