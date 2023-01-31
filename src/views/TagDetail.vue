<template>
  <div class="TagDetail">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(column, index) in tableColumns"
        v-bind="column"
        :key="'column' + index"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getDataDetail } from "@/api/index";
export default {
  name: "TagDetail",
  components: {},
  props: {},
  data() {
    return {
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
    ...mapState(["tagInfo", "currentRegion"]),
  },
  watch: {
    currentRegion:{
        handler(val){
            this.getReginIndexInfo(val)
        },
        immediate: true
    }
  },
  methods: {
    async getReginIndexInfo(item) {
      console.log("item", item);
      this.showRegionsFlag = false;
      this.showTableFlag = true;
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
.TagDetail {
  position: relative;
  width: 100%;
  /deep/ .el-table {
    position: absolute;
  }
}
</style>
