<i18n>
{
  "en": {
    "name":"name",
    "country":"country",
    "region":"region",
    "latestValue":"latest value",
    "unit":"unit",
    "currencies":"currencies",
    "year_over_year":"year_over_year(%)",
    "frequency":"frequency",
    "sources":"sources",
    "dataRange":"dataRange",
    "isUpdating":"is updating"
  },
  "zh-CN":{
    "name":"指标",
    "country":"国家",
    "region":"地区",
    "latestValue":"最新值",
    "unit":"单位",
    "currencies":"币种",
    "year_over_year":"同比(%)",
    "frequency":"频率",
    "sources":"数据来源",
    "dataRange":"数据范围",
    "isUpdating":"持续更新"
  }
}
</i18n>
<template>
  <div class="Welcome">
    <div v-if="!loginStatus">
      <p class="title">值得信赖的，</p>
      <p class="title">精准的，</p>
      <p class="title">宏观微观经济数据</p>
      <p class="p">体验最全面的经济数据库，覆盖超过213+个国家</p>
    </div>
    <div class="TagDetail" v-if="loginStatus">
      <div class="title">自选指标</div>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getFavoritesList } from '@/api/index'

export default {
  name: "welcome",
  components: {},
  props: {},
  data() {
    return {
      tableColumns: [],
      tableData: [],
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {
    if(this.loginStatus){
      this.setTableHeader()
      this.getFavoritesDataList()
    }
  },
  computed: {
    ...mapState(["langArrIndex", "userInfo"]),
    loginStatus() {
      return localStorage.getItem("access_token") ? 1 : 0;
    },
  },
  watch: {
    userInfo() {}
  },
  methods: {
    setTableHeader(){
      this.tableColumns = [
        { label: this.$t('name'), prop: "name", width: "280" },
        // { label: "国家", prop: "country_emoji_flag" },
        { label: this.$t('country'), prop: "country" },
        { label: this.$t('region'), prop: "regions" },
        { label: this.$t('latestValue'), prop: "data_latest_value", align: "right" },
        { label: this.$t('unit'), prop: "units"},
        { label: this.$t('currencies'), prop: "currencies" },
        { label: this.$t('year_over_year'), prop: "data_year_over_year", align:"right", width:"150" },
        { label: this.$t('frequency'), prop: "frequency" },
        { label: this.$t('dataRange'), prop: "dataRange" },
        { label: this.$t('isUpdating'), prop: "isUpdating" },
        { label: this.$t('sources'), prop: "sources" },
      ]
    },
    indectorDetail(singleData) {
      console.log(singleData);
      const id = singleData.id;
      // const indectorData = await getIndicatorDetail(id);
      // console.log("indectorData", indectorData);
      // this.$router.push(`/indicatorDetail/${id}`);
      let pathInfo = this.$router.resolve(`/indicatorDetail/${id}`);
      window.open(pathInfo.href, '_blank');
    },
    async getFavoritesDataList() {
      let preTableData = await getFavoritesList()
      console.log(preTableData,'🔥');
      if (preTableData && preTableData.length) {
        preTableData.forEach((item) => {
          let singleData = {
            id: item.id,
            name: item?.name_json[this.langArrIndex],
            nameJson:item?.name_json,
            country_emoji_flag: item?.countries?.country_emoji_flag,
            country: item?.countries?.country_json[this.langArrIndex],
            regions: item?.regions?.region_json[this.langArrIndex],
            data_latest_value: item.data?.data_latest_value,
            units: item?.units?.unit_json[this.langArrIndex],
            currencies: item?.currencies?.currency_json[this.langArrIndex] || '--',
            frequency: item?.frequency?.frequency_json[this.langArrIndex],
            dataRange: `${item.data.data_earliest_time.slice(0,4)} ~ ${item.data.data_latest_time.slice(0,4)}`,
            isUpdating: item.is_updating?'Y':'N',
            sources: item?.sources?.source_json[this.langArrIndex],
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
    }
  },
};
</script>
<style lang="less" scoped>
.Welcome {
  max-width: 1280px;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  .title {
    font-size: 30px;
    font-weight: bold;
    line-height: 60px;
  }
  .p {
    margin-top: 20px;
    font-size: 19px;
  }
  .TagDetail {
    position: relative;
    margin-top: 40px;
    width: 100%;
    .title {
      font-size: 20px;
      font-weight: bold;
      margin: 40px 0 20px;
    }
    /deep/ .el-table {
      position: absolute;
      .header-class {
        background-color: #f5f5f5 !important;
        color: black;
      }
    }
    .name {
      font-size: 15px;
      color: #636e89;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
