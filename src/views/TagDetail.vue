<template>
  <div class="TagDetail" v-loading="loading">
    <!-- <el-button @click="indectorDetail">获取指标详情</el-button> -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :header-cell-class-name="headerClass"
    >
      <el-table-column
        v-for="(column, index) in tableColumns"
        v-bind="column"
        :key="'column' + index"
      >
        <template  slot-scope="scope">
          <p v-if="column.prop === 'name'" class="name" @click="indectorDetail(scope.row)">
            {{ scope.row.name }}
          </p>
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getDataDetail, getIndicatorDetail } from "@/api/index";
export default {
  name: "TagDetail",
  components: {},
  props: {},
  data() {
    return {
      loading:false,
      tableData: [],
      tableColumns: [
        { label: "id", prop: "id" },
        { label: "指标", prop: "name", width: "280" },
        // { label: "国家", prop: "country_emoji_flag" },
        { label: "国家", prop: "country" },
        { label: "地区", prop: "regions" },
        { label: "最新值", prop: "data_latest_value", align: "right" },
        { label: "单位", prop: "units"},
        { label: "币种", prop: "currencies" },
        { label: "同比(%)", prop: "data_year_over_year", align:"right" },
        { label: "频率", prop: "frequency" },
        { label: "数据来源", prop: "sources" },
      ],
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {
    console.log('tagDetail router mounted')
    const {tagId, regionId} = this.$route.params
    this.getReginIndexInfo(tagId, regionId)
  },
  computed: {
    ...mapState(["tagInfo", "currentRegion"]),
  },
  watch: {
    currentRegion: {
      handler(val) {
        // this.getReginIndexInfo(this.tagInfo.id, val.id);
      },
      immediate: true,
    },
  },
  methods: {
    async indectorDetail(singleData) {
      const id = singleData.id;
      // const indectorData = await getIndicatorDetail(id);
      // console.log("indectorData", indectorData);
      this.$router.push(`/indicatorDetail/${id}`);

      const {tagId, regionId} = this.$route.params
      this.$store.commit("SET_LINK_ARR", {
        index: 4,
        pathInfo: { path:`/tagDetail/tagId/${tagId}/region/${regionId}`, name: singleData.name },
      });
    },
    headerClass() {
      return "header-class";
    },
    async getReginIndexInfo(tagId, regionId) {
      this.loading = true
      const preTableData = await getDataDetail(tagId, regionId);
      this.loading = false
      console.log("preTableData", preTableData);
      if (preTableData && preTableData.length) {
        preTableData.forEach((item) => {
          let singleData = {
            id: item.id,
            name: item?.name_json[0],
            country_emoji_flag: item?.countries?.country_emoji_flag,
            country: item?.countries?.country_json[0],
            regions: item?.regions?.region_json[0],
            data_latest_value: item.data?.data_latest_value,
            units: item?.units?.unit_json[0],
            currencies: item?.currencies?.currency_json[0] || '--',
            frequency: item?.frequency?.frequency_json[0],
            sources: item?.sources?.source_json[0],
          };
          if (
            item?.data_year_over_year?.data_latest_value &&
            item.data_year_over_year_fixed
          ) {
            let tmpD =
              item.data_year_over_year.data_latest_value -
              item.data_year_over_year_fixed;
            tmpD = tmpD.toFixed(2);
            singleData["data_year_over_year"] = tmpD;
          }else{
            singleData["data_year_over_year"] = '--';
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
    .header-class {
      background-color: #f5f5f5 !important;
      color: black;
    }
  }
  .name {
    font-size: 15px;
    color: #268dff;
    cursor: pointer;
  }
}
</style>
