<i18n>
{
  "en": {
    "name":"name",
    "country":"country",
    "region":"region",
    "latestValue":"latest value",
    "latestTime":"lastest time",
    "unit":"unit",
    "currencies":"currencies",
    "yearOverYear":"year over year(%)",
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
    "latestTime":"最新时间",
    "unit":"单位",
    "currencies":"币种",
    "yearOverYear":"% 同比",
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
        :row-class-name="tableRowClassName"
        :header-cell-class-name="headerClass"
        row-key="id"
      >
        <el-table-column
          v-for="(column, index) in tableColumns"
          v-bind="column"
          :key="'column' + index"
          :sortable="column.sortable"
        >
          <template slot-scope="scope">
            <div
              v-if="column.prop === 'name'"
              @click="indectorDetail(scope.row)"
              class="name-col"
            >
              <div class="name val">{{ scope.row.name }}</div>
              <div>
                <span
                  :class="['fi', `fi-${scope.row['country_emoji_flag']}`]"
                ></span>
                <span class="name-regions">{{ scope.row['regions'] }}</span>
                <span class="name-latest-time">
                  {{ scope.row['latestTime'] }}
                </span>
                <span class="name-frequency">{{ scope.row['frequency'] }}</span>
              </div>
            </div>
            <div v-else-if="column.prop === 'latestValue'">
              <div>
                <span class="data-latest-value">
                  {{ scope.row[column.prop] }}
                </span>
                <span>{{ scope.row['units'] }}</span>
                <span class="currencies" v-if="scope.row['currencies']">{{
                  scope.row['currencies']
                }}</span>
              </div>
            </div>
            <div v-else-if="column.prop === 'yearOverYear'">
              <div>
                <span v-if="scope.row[column.prop]" class="data-year-over-year">
                  {{ scope.row[column.prop] > 0 ? '+' : '' }}
                  {{ scope.row[column.prop] }}
                </span>
                <span v-if="scope.row[column.prop]">%</span>
              </div>
              <div v-if="!scope.row[column.prop]">--</div>
            </div>
            <div v-else-if="column.prop === 'sources'">
              <span class="val">{{ scope.row[column.prop] }}</span>
              <span class="is-updating" v-if="scope.row['isUpdating']">
                {{ scope.row['isUpdating'] }}
              </span>
            </div>
            <div v-else>
              <div class="val">{{ scope.row[column.prop] }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="" width="100" align="center">
          <template slot-scope="scope">
            <el-dropdown
              @command="e => menuCommandHandle(e, scope.row.id)"
              placement="bottom-start"
            >
              <div class="operate">
                <i class="el-icon-more"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="remove"
                  icon="el-icon-remove-outline"
                  divided
                  >移除自选</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getFavoritesList,
  cancelFavorites,
  setFavoritesOrder
} from '@/api/index'
import Sortable from 'sortablejs'

export default {
  name: 'welcome',
  components: {},
  props: {},
  data() {
    return {
      tableColumns: [],
      tableData: []
    }
  },
  beforeCreate() {},
  created() {},
  mounted() {
    if (this.loginStatus) {
      this.setTableHeader()
      this.getFavoritesDataList()
    }
  },
  computed: {
    ...mapState(['langArrIndex', 'userInfo']),
    loginStatus() {
      return localStorage.getItem('access_token') ? 1 : 0
    }
  },
  watch: {
    userInfo() {},
    langArrIndex() {
      this.setTableHeader()
      this.getFavoritesDataList()
    }
  },
  methods: {
    setTableHeader() {
      this.tableColumns = [
        { label: this.$t('name'), prop: 'name', width: 400, sortable: true },
        { label: this.$t('latestValue'), prop: 'latestValue', sortable: true },
        {
          label: this.$t('yearOverYear'),
          prop: 'yearOverYear',
          sortable: true
        },
        { label: this.$t('sources'), prop: 'sources', sortable: true }
      ]
    },
    indectorDetail(singleData) {
      console.log(singleData)
      const id = singleData.id
      // const indectorData = await getIndicatorDetail(id);
      // console.log("indectorData", indectorData);
      // this.$router.push(`/indicatorDetail/${id}`);
      let pathInfo = this.$router.resolve(`/indicatorDetail/${id}`)
      window.open(pathInfo.href, '_blank')
    },

    headerClass() {
      return 'header-class'
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'highlight-row'
      } else {
        return 'default-row'
      }
    },
    async getFavoritesDataList() {
      let preTableData = await getFavoritesList()
      console.log(preTableData, '🔥')
      let tableData = []
      if (preTableData && preTableData.length) {
        preTableData.forEach(item => {
          console.log(item)
          let singleData = {
            id: item.id,
            name: item?.names?.name_json[this.langArrIndex],
            country: item?.countries?.country_json[this.langArrIndex],
            regions: item?.regions?.region_json[this.langArrIndex],
            latestTime: item?.data?.data_latest_time,
            latestValue: item.data?.data_latest_value,
            units: item?.units?.unit_json[this.langArrIndex],
            currencies: item?.currencies?.iso4217_code,
            country_emoji_flag: item?.countries?.iso3166_alpha2.toLowerCase(),
            frequency: item?.frequency?.frequency_json[this.langArrIndex],
            isUpdating: item.is_updating ? 'Y' : '',
            sources: item?.sources?.source_json[this.langArrIndex]
          }
          console.log(item)
          if (item?.data_year_over_year?.data_latest_value) {
            let tmpD =
              item.data_year_over_year.data_latest_value -
              item.data_year_over_year_fixed
            tmpD = tmpD.toFixed(2)
            singleData['yearOverYear'] = tmpD
          } else {
            singleData['yearOverYear'] = ''
          }

          tableData.push(singleData)
        })
      }
      this.tableData = tableData
      this.rowDrop()
    },
    latestTimeToFrequency(date, frequency) {
      const arr = date.split('-')
      const month = Number(arr[1])
      switch (frequency) {
        case '年':
          return arr[0]
          break
        case '季':
        case 'Quarterly':
          return Math.floor(month % 3 == 0 ? month / 3 : month / 3 + 1)
          break
        case '月':
          return month
        case '日':
          return arr[2]
        default:
          break
      }
    },
    async menuCommandHandle(e, id) {
      switch (e) {
        case 'remove':
          this.cancelFavoritesHanlder(id)
          break
        default:
          break
      }
    },
    async cancelFavoritesHanlder(id) {
      let res = await cancelFavorites(id)
      this.$store.commit('SET_FAVORITES_DATA', res.favorites)
      this.$message.success('移除自选成功')
      this.getFavoritesDataList()
    },
    //行拖拽
    async rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd: async ({ newIndex, oldIndex }) => {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
          const data = {
            indicators: _this.tableData.map(item => {
              return Number(item.id)
            })
          }
          console.log(data)
          let res = await setFavoritesOrder(data)
          console.log(res)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.Welcome {
  max-width: 1280px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding-top: 15px;
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
      .highlight-row {
        background: #fafafa;
      }
    }
    .name-col {
      .name {
        font-size: 16px;
        color: #636e89;
        text-decoration: underline;
        cursor: pointer;
        margin-bottom: 5px;
        font-weight: 500;
      }
      .name-country {
        font-size: 15px;
        font-weight: 500;
      }
      .name-regions {
        margin-left: 10px;
      }
      .name-latest-time {
        margin-left: 25px;
        border: 1px solid #999999;
        padding: 1px 4px;
        border-radius: 5px;
        color: #999999;
      }
      .name-frequency {
        margin-left: 20px;
        border: 1px solid #999999;
        padding: 1px 4px;
        border-radius: 5px;
        color: #999999;
      }
    }
    .val {
      font-size: 16px;
    }
    .data-latest-value,
    .data-year-over-year {
      font-size: 20px;
      color: #c62a29;
      font-weight: 550;
      margin-right: 5px;
    }
    .is-updating {
      margin-left: 10px;
      border: 1px solid #cccccc;
      height: 18px;
      width: 18px;
      border-radius: 50%;
      text-align: center;
      line-height: 18px;
      display: inline-block;
      font-weight: 500;
      font-size: 14px;
      color: #cccccc;
    }

    .currencies {
      margin-left: 15px;
      color: #4b44ff;
      border: 1px solid #4b44ff;
      padding: 1px 4px;
      font-size: 12px;
      border-radius: 6px;
    }
  }
  .operate {
    font-size: 15px;
    color: #268dff;
    cursor: pointer;
  }
}
</style>
