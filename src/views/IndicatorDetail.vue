<template>
  <div class="IndicatorDetail">
    <div id="chart" ref="chart">
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {getIndicatorDetail} from "@/api/index"
import * as echarts from "echarts"
export default {
  name: "IndicatorDetail",
  components: {},
  props: {},
  data() {
    return {
      formatData:[],
      title:'',
      option:[]
    };
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
    indicatorId(){
      const id = this.$route.params['indicatorId']
      // if(id){
      //   this.getData(val)
      // }
      return id
    }
  },
  watch: {
    indicatorId:{
      handler(val){
        if(val){
          this.getData(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    async getData(id){
      const rowData = await getIndicatorDetail(id)
      this.title = rowData.name_json[0] || '鸡蛋'
      const option = this.buildChartOption(rowData)
      this.option = option
      this.buildChart(option)
    },
    buildChartOption(rowData) {
      let xAxisData = []
      let seriesData = []
      const keyObj = rowData.data.data_json
      const keys = Object.keys(keyObj)
      keys.forEach(key=>{
        const val = keyObj[key]
        xAxisData.push(key)
        seriesData.push(val[0])
      })
        

      let dataZoomEndValue = keys.length
      if (dataZoomEndValue < 12) {
        dataZoomEndValue = 12
      }
      let dataZoomStartValue
      dataZoomStartValue = dataZoomEndValue - 11
      if (dataZoomStartValue < 0) {
        dataZoomStartValue = 0
      }
      let option = {
        title: {
          // text: "里程碑按期完成率",
          text: rowData.name_json[0],
          left: "left",
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: function (data) {
            
            // if (tipData) {
            //   let dataIndex = data[0].dataIndex
            //   let targetItem = tipData[dataIndex]
            //   if (!targetItem.planCompleteMilestone) {
            //     targetItem.planCompleteMilestone = "计划完成里程碑:-"
            //   }
            //   if (!targetItem.actualCompleteMilestone) {
            //     targetItem.actualCompleteMilestone = " 按期完成里程碑:-"
            //   }

            //   return `${data[0].axisValue} <br/>
            //     ${targetItem.actualCompleteMilestone}
            //     <br/>
            //     ${targetItem.planCompleteMilestone}
            //    `
            // }
            
          }
        },
        grid: {
          left: "15px",
          right: "30px",
          bottom: "15px",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function (value) {
              return value
            }
          },
        },
        dataZoom: [
          {
            type: "inside",
            // startValue: 0,
            // endValue: 12
            // 展示最近的值
            startValue: dataZoomStartValue,
            endValue: dataZoomEndValue
          }
        ],
        series: [
          {
            // data: [10, 20, 50, 80, 80, 60, 50, 50, 80, 80, 60, 98],
            data: seriesData,
            type: "line",
            // 平滑
            // smooth: true,
            lineStyle: {
              color: "#3594FF"
            },
            itemStyle: {
              borderWidth: 30,
              borderColor: "#000000",
              normal: {
                label: {
                  show: true,
                  color: "rgba(53,148,255,0.6)",
                  formatter: function (data) {
                    return `${data.value}`
                  }
                }
              }
            }
          }
        ]
      }
      return option
    },
    resizeFun() {
      this.lineChart.resize()
    },
    buildChart(option) {
      if (!this.lineChart) {
        this.lineChart = echarts.init(this.$refs['chart'])
      }
      // let option = this.buildMapOption()
      this.lineChart.setOption(option)
      this.lineChart.on("click", () => {
        event.stopPropagation()
      })
      window.addEventListener("resize", this.resizeFun)
    },
  },
};
</script>
<style lang="less" scoped>
.IndicatorDetail {
  height: 100%;
  width: 100%;
  #chart{
    height: 500px;
    width: 100%;
  }
}
</style>
