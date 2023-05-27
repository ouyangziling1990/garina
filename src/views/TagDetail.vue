<i18n>
{
  "en": {
    "name":"Indicator",
    "country":"Country",
    "region":"Region",
    "latestValue":"Latest Value",
    "latestTime":"Lastest time",
    "unit":"Unit",
    "currencies":"Currency",
    "year_over_year":"% YoY",
    "frequency":"Frequency",
    "dataRange":"Data Range",
    "sources":"Data Source",
    "isUpdating":"Updating"
  },
  "zh-CN":{
    "name":"指标",
    "country":"国家",
    "region":"地区",
    "latestValue":"最新值",
    "latestTime":"最新时间",
    "unit":"单位",
    "currencies":"币种",
    "year_over_year":"% 同比",
    "frequency":"频率",
    "dataRange":"数据范围",
    "sources":"数据来源",
    "isUpdating":"持续更新"
  }
}
</i18n>
<template>
  <div class="TagDetail media-align" v-loading="loading">
    <div class="title">筛选列表</div>
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
        <template slot-scope="scope">
          <p
            v-if="column.prop === 'name'"
            class="name"
            @click="indectorDetail(scope.row)"
          >
            {{ scope.row.name }}
          </p>
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="loginStatus"
        fixed="right"
        label="自选"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div class="operate">
            <i
              class="el-icon-remove-outline remove"
              v-if="inFavorites(scope.row.id)"
              @click="cancelFavoritesHanlder(scope.row.id)"
            ></i>
            <i
              class="el-icon-circle-plus-outline plus"
              v-else
              @click="addFavoritesHanlder(scope.row.id)"
            ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        fixed="right"
        label="自选"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div class="operate">
            <i
              class="el-icon-circle-plus-outline plus"
              @click="addFavoritesHanlder(scope.row.id)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getDataDetail,
  getIndicatorDetail,
  getFavorites,
  addFavorites,
  cancelFavorites
} from '@/api/index'
export default {
  name: 'TagDetail',
  components: {},
  props: {},
  data() {
    const _this = this
    return {
      loading: false,
      tableData: [],
      tableColumns: []
    }
  },
  beforeCreate() {},
  created() {},
  mounted() {
    console.log('tagDetail router mounted')
    const { tagId, regionId } = this.$route.params
    this.getReginIndexInfo(tagId, regionId)
    if (this.lang) {
      this.$i18n.locale = this.lang
    }
    this.setTableHeader()
    if (this.loginStatus) {
      this.getFavoritesList()
    }
  },
  computed: {
    ...mapState([
      'tagInfo',
      'currentRegion',
      'langArrIndex',
      'lang',
      'favorites'
    ]),

    loginStatus() {
      return localStorage.getItem('access_token') ? 1 : 0
    }
  },
  watch: {
    currentRegion: {
      handler(val) {
        // this.getReginIndexInfo(this.tagInfo.id, val.id);
      },
      immediate: true
    },
    lang(val) {
      this.$i18n.locale = val
    }
  },
  methods: {
    setTableHeader() {
      this.tableColumns = [
        { label: this.$t('name'), prop: 'name', width: '350' },
        { label: this.$t('region'), prop: 'regions' },
        // { label: this.$t('latestTime'), prop: "latestTime" },
        // { label: this.$t('latestValue'), prop: "data_latest_value",  },
        // { label: this.$t('unit'), prop: "units"},
        // { label: this.$t('currencies'), prop: "currencies" },
        // { label: this.$t('year_over_year'), prop: "data_year_over_year", },
        { label: this.$t('dataRange'), prop: 'dataRange', width: '240' },
        { label: this.$t('frequency'), prop: 'frequency' },
        { label: this.$t('sources'), prop: 'sources', width: '320' },
        { label: this.$t('isUpdating'), prop: 'isUpdating', width: '80' }
      ]
    },
    async indectorDetail(singleData) {
      const id = singleData.id
      let pathInfo = this.$router.resolve(`/indicator/${id}`)
      window.open(pathInfo.href, '_blank')
    },
    headerClass() {
      return 'header-class'
    },
    async getReginIndexInfo(tagId, regionId) {
      this.loading = true
      const preTableData = await getDataDetail(tagId, regionId)
      this.loading = false
      if (preTableData && preTableData.length) {
        preTableData.forEach(item => {
          let singleData = {
            id: item.id,
            name: item?.names?.name_json[this.langArrIndex],
            country_emoji_flag: item?.countries?.country_emoji_flag,
            country: item?.countries?.country_json[this.langArrIndex],
            regions: item?.regions?.region_json[this.langArrIndex],
            latestTime: item?.data?.data_latest_time,
            data_latest_value: item.data?.data_latest_value,
            units: item?.units?.unit_json[this.langArrIndex],
            currencies:
              item?.currencies?.currency_json[this.langArrIndex] || '--',
            frequency: item?.frequency?.frequency_json[this.langArrIndex],
            dataRange: `${item.data.data_earliest_time} - ${item.data.data_latest_time}`,
            isUpdating: item.is_updating ? 'Y' : 'N',
            sources: item?.sources?.source_json[this.langArrIndex]
          }
          if (item?.data_year_over_year?.data_latest_value) {
            let tmpD =
              item.data_year_over_year.data_latest_value -
              item.data_year_over_year_fixed
            tmpD = tmpD.toFixed(2)
            singleData['data_year_over_year'] = tmpD
          } else {
            singleData['data_year_over_year'] = '--'
          }

          this.tableData.push(singleData)
        })
      }
    },
    inFavorites(id) {
      return this.favorites.indexOf(Number(id)) !== -1
    },

    async getFavoritesList() {
      let res = await getFavorites()
      console.log(res);
      this.$store.commit('SET_FAVORITES_DATA', res.favorites||[])
    },

    async addFavoritesHanlder(id) {
      let res = await addFavorites(id)
      this.$store.commit('SET_FAVORITES_DATA', res.favorites)
      this.$message.success('添加自选成功')
    },
    async cancelFavoritesHanlder(id) {
      let res = await cancelFavorites(id)
      this.$store.commit('SET_FAVORITES_DATA', res.favorites)
      this.$message.success('移除自选成功')
    }
  }
}
</script>
<style lang="less" scoped>
.TagDetail {
  position: relative;
  // max-width: 1280px;
  // width: 100%;
  // margin: 0 auto;
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
.operate {
  font-size: 15px;
  color: #268dff;
  cursor: pointer;
}
.remove {
  color: #f56c6c;
}
</style>
