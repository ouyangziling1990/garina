<template>
  <div class="IndicatorDetail" v-loading="loading">
    <div class="detail-wrap">
      <GRChart id="chart" :options="option"/>
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
import GRChart from "@/components/GRChart"
import { mapState } from "vuex";
import { getIndicatorDetail } from "@/api/index";
export default {
  name: "IndicatorDetail",
  components: { GRChart },
  props: {},
  data() {
    return {
      formatData: [],
      title: "",
      option: {},
      loading:false,
      descriptions: null,
      source: null
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.$nextTick(() => {
      // this.buildChart()
    });
  },
  computed: {
    ...mapState([]),
    indicatorId() {
      const id = this.$route.params["indicatorId"];
      // if(id){
      //   this.getData(val)
      // }
      return id;
    },
  },
  watch: {
    indicatorId: {
      handler(val) {
        if (val) {
          this.getData(val);
        }
      },
      immediate: true,
    },
  },
  methods: {
    async getData(id) {
      const LANGUAGE_INDEX = 0
      this.loading = true
      const rowData = await getIndicatorDetail(id);
      // 图表数据
      this.title = rowData.name_json[LANGUAGE_INDEX] || "鸡蛋";
      const option = this.buildChartOption(rowData);
      this.option = option;
      // 描述数据
      const descriptions = rowData.descriptions?.description_json[LANGUAGE_INDEX]
      this.descriptions = descriptions

      const source = rowData.sources?.source_json[LANGUAGE_INDEX]
      this.source = source

      this.loading = false
    },
    buildChartOption(rowData) {
      console.log(rowData);
      let xAxisData = [];
      let seriesData = [];
      const keyObj = rowData.data.data_json;
      const huanbiMap = rowData?.data_time_over_time?.data_json
      const data_time_over_time_fixed = rowData.data_time_over_time_fixed
      const tongbiMap = rowData?.data_year_over_year?.data_json
      const data_year_over_year_fixed = rowData.data_year_over_year_fixed
      const keys = Object.keys(keyObj);
      keys.forEach((key) => {
        const val = keyObj[key];
        xAxisData.push(key);
        seriesData.push(val[0]);
      });

      let dataZoomEndValue = keys.length;
      if (dataZoomEndValue < 12) {
        dataZoomEndValue = 12;
      }
      let dataZoomStartValue;
      dataZoomStartValue = dataZoomEndValue - 11;
      if (dataZoomStartValue < 0) {
        dataZoomStartValue = 0;
      }
      let option = {
        title: {
          // text: "里程碑按期完成率",
          text: rowData.name_json[0],
          left: "left",
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: function (data) {
              const dataIndex = data[0].dataIndex
              // console.log('dataIndex', data)
              const key = data[0]['axisValue']
              let tongbiRate = ''
              if(tongbiMap && tongbiMap[key]){
                tongbiRate = tongbiMap[key][0] - data_year_over_year_fixed
                tongbiRate = tongbiRate.toFixed(2)
                tongbiRate += '%'
              }
              let huanbiRate = ''
              if(huanbiMap && huanbiMap[key]){
                huanbiRate = huanbiMap[key][0] - data_time_over_time_fixed
                huanbiRate = huanbiRate.toFixed(2)
                huanbiRate += '%'
              }
              return `${data[0].axisValue} <br/>
                同比：${tongbiRate}
                <br/>
                环比：${huanbiRate}
               `
          },
        },
        grid: {
          left: "15px",
          right: "30px",
          bottom: "15px",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function (value) {
              return value;
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
            // startValue: 0,
            // endValue: 12
            // 展示最近的值
            start: 0,
            end: 10,
          },
          {
            start: 0,
            end: 10,
          },
        ],
        series: [
          {
            // data: [10, 20, 50, 80, 80, 60, 50, 50, 80, 80, 60, 98],
            data: seriesData,
            type: "line",
            // 平滑
            // smooth: true,

            // areaStyle: {},
            lineStyle: {
              color: "#3594FF",
            },
            itemStyle: {
              borderWidth: 30,
              borderColor: "#000000",
              normal: {
                label: {
                  show: true,
                  color: "rgba(53,148,255,0.6)",
                  formatter: function (data) {
                    return `${data.value}`;
                  },
                },
              },
            },
            smooth: true,
          },
        ],
      };
      return option;
    }
  }
};
</script>
<style lang="less" scoped>
.IndicatorDetail {
  height: 100%;
  width: 1200px;
  margin: auto;
  .detail-wrap {
    width: 1200px;
    display: flex;
    #chart {
      height: 500px;
      width: calc(100% - 500px);
      padding: 10px;
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
