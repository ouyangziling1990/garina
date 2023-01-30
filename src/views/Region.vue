<template>
  <div class="Region">
    <div class="show_data_wrap" v-show="showRegionsFlag">
      <Country @detail="getReginIndexInfo"></Country>
      <!-- <div class="show_data">
        <p
          v-for="r in region"
          :class="[r.parent_id === null ? 'tag_detail_header' : 'tag_detail']"
          :key="r.id"
          @click="getReginIndexInfo(r)"
        >
          {{ r.id + r.region_json[0] }}
        </p>
      </div> -->
    </div>
    <div class="table-show" v-show="showTableFlag">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="(column, index) in tableColumns"
          v-bind="column"
          :key="'column' + index"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getDataDetail } from "@/api/index";
import Country from "@/views/Country.vue";
export default {
  name: "Region",
  components: { Country },
  props: {},
  data() {
    return {
      treeData: [],
      showRegionsFlag:true,
      showTableFlag:false,
      defaultProps: {
        children: "children",
        label: "label",
      },
      tableData: [],
      tableColumns: [
        { label: "id", prop: "id" },
        { label: "指标", prop: "name", width: "280" },
        { label: "国家", prop: "country_emoji_flag" },
        { label: "地区", prop: "regions" },
        { label: "最新值", prop: "data_latest_value", align: "right" },
        { label: "单位", prop: "units" },
        { label: "币种", prop: "currencies" },
        { label: "同比", prop: "data_year_over_year" },
        { label: "频率", prop: "frequency" },
        { label: "数据来源", prop: "sources" },
      ],
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState(["tagInfo"]),
  },
  watch: {
    region: {
      handler(val) {
        if (!val) return;
        // this.orgTreeData(val);
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
    async getReginIndexInfo(item) {
      console.log("item", item);
      this.showRegionsFlag = false
      this.showTableFlag = true
      const regionId = item.id;
      const preTableData = await getDataDetail(this.tagInfo.id, regionId);
      console.log("preTableData", preTableData);
      if (preTableData && preTableData.length) {
        preTableData.forEach((item) => {
          let singleData = {
            id: item.id,
            name: item.name_json[0],
            country_emoji_flag: item.countries.country_emoji_flag,
            regions: item.regions.region_json[0],
            data_latest_value: item.data.data_latest_value,
            units: item.units.unit_json[0],
            currencies: item.currencies.currency_json[0],
            frequency: item.frequency.frequency_json[0],
            sources: item.sources.source_json[0],
          };
          if (
            item.data_year_over_year.data_latest_value &&
            item.data_year_over_year_fixed
          ) {
            let tmpD =
              item.data_year_over_year.data_latest_value -
              item.data_year_over_year_fixed;
            tmpD = tmpD.toFixed(2);
            singleData["data_year_over_year"] = tmpD;
          }

          this.tableData.push(singleData);
        });
      }
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
  padding: 12px 20px;
  .show_data_wrap {
    display: flex;
    flex-direction: row;
  }
  .show_data {
    flex: 1;
  }
  .table-show {
    position: relative;
    width: 100%;
    /deep/ .el-table {
      position: absolute;
    }
  }
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
</style>
