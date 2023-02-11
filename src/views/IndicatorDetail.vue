<template>
  <div class="IndicatorDetail" v-loading="loading">
    <div class="detail-wrap">
      <div class="chart-data">
        <div class="chart-head">
          <div class="c-title">{{ dataInfo.title }}</div>
          <div class="c-tag-1" v-if="dataInfo.method">
            {{ dataInfo.method }}
          </div>
          <div class="c-tag-2" v-if="dataInfo.country_emoji_flag">
            {{ dataInfo.country_emoji_flag }}
          </div>
          <div class="c-tag-3" v-if="dataInfo.region">
            {{ dataInfo.region }}
          </div>
        </div>
        <div class="chart-head-2">
          <div class="chart-head-2-l">
            <div class="c-tag-4">
              {{ dataObj.data_latest_value }}
            </div>
            <div class="c-tag-5">
              {{ dataObj.unit }}
            </div>
            <div class="c-tag-6">
              {{ dataObj.currencie }}
            </div>
            <div class="c-tag-7">
              {{ dataObj.rate }}
            </div>
          </div>
          <div class="chart-head-2-r">
            <div>最近更新：{{ dataObj.data_latest_update_time }}</div>
          </div>
        </div>
        <ChartTool
          @changeType="changeChartTypeHandler"
          @changeTools="changeChartToolsHandler"
          @export="exportHandler"
          @imgExport="imgExportHandler"
        />
        <GRChart id="chart" ref="chart" :options="option" />
      </div>
      <div class="desc-data">
        <div class="desc-title">释义</div>
        <div class="desc-content">
          {{ descriptions }}
        </div>
        <div class="desc-title">数来来源</div>
        <div class="desc-content">
          {{ source }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GRChart from '@/components/GRChart'
import ChartTool from '@/components/ChartTool'
import { mapState } from 'vuex'
import { getIndicatorDetail } from '@/api/index'

const LANGUAGE_INDEX = 0
export default {
  name: 'IndicatorDetail',
  components: { GRChart, ChartTool },
  props: {},
  data() {
    return {
      formatData: [],
      dataInfo: {},
      dataObj: {},
      option: {},
      loading: false,
      descriptions: null,
      source: null,
      tableData: {}
    }
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.$nextTick(() => {
      // this.buildChart()
    })
  },
  computed: {
    ...mapState([]),
    indicatorId() {
      const id = this.$route.params['indicatorId']
      // if(id){
      //   this.getData(val)
      // }
      return id
    }
  },
  watch: {
    indicatorId: {
      handler(val) {
        if (val) {
          this.getData(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    async getData(id) {
      this.loading = true
      const rowData = await getIndicatorDetail(id)
      this.setInfoDataq(rowData)
      // 图表数据

      const option = this.buildChartOption(rowData)
      this.option = option
      // 描述数据
      const descriptions =
        rowData.descriptions?.description_json[LANGUAGE_INDEX]
      this.descriptions = descriptions

      const source = rowData.sources?.source_json[LANGUAGE_INDEX]
      this.source = source

      this.loading = false
    },
    setInfoDataq({
      name_json,
      methods,
      countries,
      regions,
      data,
      units,
      currencies,
      data_year_over_year,
      data_year_over_year_fixed
    }) {
      let dataInfo = {
        title: name_json[LANGUAGE_INDEX],
        method: methods?.method_json[LANGUAGE_INDEX],
        country_emoji_flag: countries?.country_emoji_flag,
        region: regions?.region_json[LANGUAGE_INDEX]
      }
      this.dataInfo = dataInfo
      const rate =
        data_year_over_year &&
        data_year_over_year.data_latest_value &&
        data_year_over_year_fixed
          ? (
              data_year_over_year.data_latest_value - data_year_over_year_fixed
            ).toFixed(2) + '%'
          : null
      let dataObj = {
        data_latest_value: data?.data_latest_value.toFixed(2),
        unit: units?.unit_json[LANGUAGE_INDEX],
        currencie: currencies?.currency_json[LANGUAGE_INDEX],
        rate: rate,
        data_latest_update_time: data?.data_latest_update_time
      }
      this.dataObj = dataObj
    },
    buildChartOption(rowData) {
      console.log(rowData)
      let xAxisData = []
      let seriesData = []
      const keyObj = rowData.data.data_json
      const huanbiMap = rowData?.data_time_over_time?.data_json
      const data_time_over_time_fixed = rowData.data_time_over_time_fixed
      const tongbiMap = rowData?.data_year_over_year?.data_json
      const data_year_over_year_fixed = rowData.data_year_over_year_fixed
      const keys = Object.keys(keyObj)
      const tableData = {}
      keys.forEach(key => {
        const val = keyObj[key]
        xAxisData.push(key)
        seriesData.push(val[0])

        const obj = {
          value: val[0]
        }
        if (tongbiMap && tongbiMap[key]) {
          obj.tongbiRate =
            (tongbiMap[key][0] - data_year_over_year_fixed).toFixed(2) + '%'
        }
        let huanbiRate = ''
        if (huanbiMap && huanbiMap[key]) {
          obj.huanbiRate =
            (huanbiMap[key][0] - data_time_over_time_fixed).toFixed(2) + '%'
        }
        tableData[key] = obj
      })
      console.log(tableData)
      this.tableData = tableData

      let option = {
        // backgroundColor: '#2c343c',
        title: {
          // text: "里程碑按期完成率",
          // text: rowData.name_json[0],
          left: 'left',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: data => {
            const dataIndex = data[0].dataIndex
            const key = data[0]['axisValue']

            return `${data[0].axisValue} <br/>
                ${data[0].value}${this.dataObj.unit}<br/>
                同比：${this.tableData[key].tongbiRate}
                <br/>
                环比：${this.tableData[key].huanbiRate}
               `
          }
        },
        grid: {
          left: '15px',
          right: '30px',
          bottom: 70,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: true
          },
          splitLine: {
            show: false
          },
          data: xAxisData
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (value) {
              return value
            }
          },
          axisLine: {
            show: true
          },
          splitLine: {
            show: false
          },
          position: 'right'
        },
        dataZoom: [
          {
            type: 'inside'
          },
          {
            type: 'slider'
          }
        ],
        series: [
          {
            data: seriesData,
            type: 'line',

            showSymbol: false,
            smooth: false,
            label: {
              show: true
            }
          }
        ]
      }
      return option
    },
    changeChartTypeHandler(e) {
      e.forEach(item => {
        this.option.series.forEach(s => {
          this.$set(s, item[0], item[1])
        })
      })
    },
    changeChartToolsHandler(e, res) {
      console.log(e, res)
      let obj = this.option
      if (e[0] == 'series') {
        obj.series.forEach(item => {
          let sObj = item
          console.log(sObj)
          e.forEach((attr, index) => {
            if (index == 0) return
            if (index < e.length - 1) {
              sObj = sObj[attr]
            }
          })
          console.log(sObj)
          this.$set(sObj, e[e.length - 1], res)
          console.log(this.option)
        })
      } else {
        e.forEach((attr, index) => {
          if (index < e.length - 1) {
            obj = obj[attr]
          }
        })
        this.$set(obj, e[e.length - 1], res)
      }
    },
    exportHandler() {
      let str = '日期,值,同比,环比\n'
      Object.keys(this.tableData).forEach(k => {
        const { key, value, tongbiRate, huanbiRate } = this.tableData[k]
        str += k + ','
        str += value ? value + ',' : ','
        str += tongbiRate ? tongbiRate + ',' : ','
        str += huanbiRate ? huanbiRate + ',' : ','
        str += '\n'
      })

      const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
      // 通过创建a标签实现
      const link = document.createElement('a')
      link.href = uri
      // 对下载的文件命名
      link.download = `${this.dataInfo.title}.csv`
      link.click()
    },
    imgExportHandler() {
      var img = new Image()
      img.src = this.$refs.chart.chart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
      })
      img.onload = function () {
        var canvas = document.createElement('canvas')
        console.log(canvas);
        canvas.width = img.width
        canvas.height = img.height
        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        var dataURL = canvas.toDataURL('image/png')

        var a = document.createElement('a')
        var event = new MouseEvent('click')
        a.download = '图片.png' || '下载图片名称'
        // 将生成的URL设置为a.href属性
        a.href = dataURL
        // 触发a的单击事件
        a.dispatchEvent(event)
        a.remove()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.IndicatorDetail {
  height: 100%;
  width: 1200px;
  margin: auto;
  .detail-wrap {
    width: 1200px;
    display: flex;
    .chart-data {
      width: calc(100% - 500px);
      padding: 10px;
      .chart-head {
        display: flex;
        .c-title {
          font-size: 20px;
          font-weight: bold;
          margin: 0 5px;
          line-height: 25px;
        }
        .c-tag-1 {
          height: 25px;
          font-size: 14px;
          background-color: #efefef;
          line-height: 25px;
          padding: 0 5px;
          margin: 0 10px;
          border-radius: 3px;
        }
        .c-tag-2 {
          margin: 0 5px;
          font-size: 25px;
          line-height: 25px;
        }
        .c-tag-3 {
          height: 25px;
          font-size: 14px;
          background-color: #e6f1fb;
          color: #06c;
          line-height: 25px;
          margin: 0 5px;
          padding: 0 10px;
          border-radius: 3px;
        }
      }
      .chart-head-2 {
        display: flex;
        margin-top: 20px;
        justify-content: space-between;
        border-bottom: 1px solid #edf0f5;
        .chart-head-2-l {
          display: flex;
          .c-tag-4 {
            font-size: 40px;
            line-height: 48px;
            font-weight: 600;
            color: #527f52;
            margin-right: 10px;
          }
          .c-tag-5,
          .c-tag-6 {
            color: #527f52;
            padding-top: 15px;
            margin-left: 8px;
            margin-right: 10px;
            font-size: 20px;
          }
          .c-tag-7 {
            color: #527f52;
            font-size: 22px;
            padding-top: 14px;
            margin-left: 8px;
            margin-right: 10px;
          }
        }
        .chart-head-2-r {
          text-align: right;
          margin-top: 16px;
          font-size: 12px;
          font-weight: 400;
          color: #909499;
          line-height: 14px;
        }
      }
      #chart {
        height: 400px;
        width: 100%;
      }
    }
    .desc-data {
      width: 500px;
      .desc-title {
        font-size: 16px;
        font-weight: bold;
        margin: 20px 0;
        margin-bottom: 15px;
        border-bottom: 1px solid #edf0f5;
        padding-bottom: 9px;
      }
      .desc-content {
        font-size: 14px;
        color: #33353c;
        line-height: 21px;
      }
    }
  }
}
</style>
