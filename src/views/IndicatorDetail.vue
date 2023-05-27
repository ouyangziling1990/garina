<i18n>
{
  "en": {
    "dataSource": "Data Source",
    "dataRange": "Data Range",
    "lastUpdated": "Last Updated Time",
    "paraphrase": "Overview",
    "methods": "Statistical Method",
    "followers":"followers",
    "optional":"Follow",
    "followed":"Followed",
    "isUpdating":"Continuous Update",
    "stopUpdating":Discontinued Update"
  },
  "zh-CN":{
    "dataSource": "数据来源",
    "dataRange": "数据范围",
    "lastUpdated": "最近更新",
    "paraphrase": "简介",
    "methods":"统计方法",
    "followers":"人关注",
    "optional":"自选",
    "followed":"已添加",
    "isUpdating":"持续更新",
    "stopUpdating":"停止更新"
  }
}
</i18n>
<template>
  <div class="IndicatorDetail media-align" v-loading="loading">
    <div class="detail-wrap" v-if="!loading">
      <div class="chart-data">
        <div class="chart-head">
          <div class="c-title">{{ dataInfo.title[langArrIndex] }}</div>
          <!-- <div class="c-tag-1" v-if="dataInfo.method">
            {{ dataInfo.method[langArrIndex] }}
          </div> -->
          <div class="flex">
            <div class="c-tag-2" v-if="dataInfo.country_emoji_flag">
              <span :class="['fi', `fi-${dataInfo.country_emoji_flag}`]"></span>
            </div>
            <div class="c-tag-3" v-if="dataInfo.region">
              {{ dataInfo.region[langArrIndex] }}
            </div>
            <div class="c-tag-3">
              {{ isUpdating ? $t("isUpdating") : $t("stopUpdating") }}
            </div>
          </div>

          <div class="plus-optional">
            <el-button
              :type="inFavorites ? 'info' : 'primary'"
              @click="favoritesClickHandler"
              class="plus-optional-btn"
            >
              <i :class="inFavorites ? 'el-icon-check' : 'el-icon-plus'" />
              {{ inFavorites ? $t("followed") : $t("optional") }}
            </el-button>
          </div>
        </div>
        <div class="chart-head-2">
          <div class="chart-head-2-l">
            <div class="c-tag-4">
              {{ dataObj.data_latest_value }}
            </div>
            <div class="c-tag-5">
              {{ dataObj.unit[langArrIndex] }}
            </div>
            <div class="c-tag-6" v-if="dataObj.currencie">
              {{ dataObj.currencie[langArrIndex] }}
            </div>
            <div class="c-tag-7">
              {{ dataObj.rate > 0 ? "+" : ""
              }}{{ dataObj.rate ? dataObj.rate + "%" : "" }}
            </div>
          </div>
          <div class="chart-head-2-r">
            <div class="chart-head-2-r-item">
              {{ dataObj.favorites }} {{ $t("followers") }}
            </div>
            <div class="chart-head-2-r-item">
              {{ $t("lastUpdated") }}:{{ dataObj.data_latest_update_time }}
            </div>
          </div>
        </div>
        <ChartTool
          class="chart-tool"
          @changeType="changeChartTypeHandler"
          @changeTools="changeChartToolsHandler"
          @export="exportHandler"
          @imgExport="imgExportHandler"
          @comparison="comparisonHandler"
        />
        <GRChart id="chart" ref="chart" :options="option" />
      </div>
      <div class="desc-data">
        <div class="desc-title">{{ $t("paraphrase") }}</div>
        <div class="desc-content">
          {{ descriptions[langArrIndex] }}
        </div>
        <div class="desc-title" v-if="methods">{{ $t("methods") }}</div>
        <div class="desc-content" v-if="methods">
          {{ methods[langArrIndex] }}
        </div>
        <div class="desc-title">{{ $t("dataRange") }}</div>
        <div class="desc-content">
          {{ dataRange }}
        </div>
        <div class="desc-title">{{ $t("dataSource") }}</div>
        <div class="desc-content flex">
          <div>{{ source[langArrIndex] }}</div>
          <!-- <div class="desc-content-plus">
            <span class="weight">
              {{ isUpdating ? $t('isUpdating') : $t('stopUpdating') }}
            </span>
          </div> -->
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="90%">
      <ComparisonCont ref="ComparisonCont" :defaultId="indicatorId" />
    </el-dialog>
  </div>
</template>

<script>
import GRChart from "@/components/GRChart";
import ChartTool from "@/components/ChartTool";
import ComparisonCont from "@/components/ComparisonCont";
import { mapState } from "vuex";
import _ from "lodash";
import {
  getIndicatorDetail,
  addFavorites,
  cancelFavorites,
  getFavorites,
} from "@/api/index";

const LANGUAGE_INDEX = 0;
export default {
  name: "IndicatorDetail",
  components: { GRChart, ChartTool, ComparisonCont },
  props: {},
  data() {
    return {
      formatData: [],
      dataInfo: {
        title: null,
        method: null,
        country_emoji_flag: null,
        region: null,
      },
      dataObj: {},
      option: {},
      loading: false,
      descriptions: null,
      source: null,
      range: null,
      tableData: {},
      dataRange: null,
      methods: null,
      isUpdating: true,
      dialogVisible: false,
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {
    if (this.loginStatus) {
      this.getFavoritesList();
    }
  },
  computed: {
    ...mapState(["langArrIndex", "favorites"]),
    indicatorId() {
      const id = this.$route.params["indicatorId"];
      return id;
    },
    inFavorites() {
      return this.favorites.indexOf(Number(this.indicatorId)) !== -1;
    },

    loginStatus() {
      return localStorage.getItem("access_token") ? 1 : 0;
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
    langArrIndex(val) {
      console.log(this.dataInfo.title, val);
      document.title = `${this.dataInfo.title[val]} - ${this.dataInfo.country[val]} - ${this.dataInfo.region[val]} - DATA.GARINASSET.COM`;
    },
  },
  methods: {
    async getData(id) {
      this.loading = true;
      const rowData = await getIndicatorDetail(id);
      this.setInfoDataq(rowData);
      // 图表数据

      const option = this.buildChartOption(rowData);
      this.option = option;
      // 描述数据
      const descriptions = rowData.descriptions?.description_json;
      this.descriptions = descriptions;

      const source = rowData.sources?.source_json;
      this.source = source;

      const dataRange = `${rowData.data.data_earliest_time} ~ ${rowData.data.data_latest_time}`;
      this.dataRange = dataRange;

      const methods = rowData.methods?.method_json;
      this.methods = methods;

      const isUpdating = rowData.is_updating;
      this.isUpdating = isUpdating;

      this.loading = false;
    },
    setInfoDataq({
      names,
      methods,
      countries,
      regions,
      data,
      units,
      currencies,
      data_year_over_year,
      data_year_over_year_fixed,
      favorites,
    }) {
      let dataInfo = {
        title: names?.name_json,
        method: methods?.method_json,
        country_emoji_flag: countries?.iso3166_alpha2.toLowerCase(),
        country: countries?.country_json,
        region: regions?.region_json,
      };
      this.dataInfo = dataInfo;

      document.title = `${this.dataInfo.title[this.langArrIndex]} - ${
        this.dataInfo.country[this.langArrIndex]
      } - ${this.dataInfo.region[this.langArrIndex]} - DATA.GARINASSET.COM`;
      const rate =
        data_year_over_year && data_year_over_year.data_latest_value
          ? (
              data_year_over_year.data_latest_value - data_year_over_year_fixed
            ).toFixed(2)
          : null;
      let dataObj = {
        data_latest_value: data?.data_latest_value.toFixed(2),
        unit: units?.unit_json,
        currencie: currencies?.currency_json,
        rate: rate,
        data_latest_update_time: data?.data_latest_update_time,
        favorites: favorites,
      };
      this.dataObj = dataObj;
    },
    buildChartOption(rowData) {
      let xAxisData = [];
      let seriesData = [];
      console.log();
      const keyObj = rowData.data.data_json;
      const huanbiMap = rowData?.data_time_over_time?.data_json;
      const data_time_over_time_fixed = rowData.data_time_over_time_fixed;
      const tongbiMap = rowData?.data_year_over_year?.data_json;
      const data_year_over_year_fixed = rowData.data_year_over_year_fixed;
      const keys = Object.keys(keyObj);
      const tableData = {};
      keys.forEach((key) => {
        const val = keyObj[key];
        xAxisData.push(key);
        seriesData.push(val[0]);

        const obj = {
          value: val[0],
        };
        if (tongbiMap && tongbiMap[key]) {
          obj.tongbiRate =
            (tongbiMap[key][0] - data_year_over_year_fixed).toFixed(2) + "%";
        }
        let huanbiRate = "";
        if (huanbiMap && huanbiMap[key]) {
          obj.huanbiRate =
            (huanbiMap[key][0] - data_time_over_time_fixed).toFixed(2) + "%";
        }
        tableData[key] = obj;
      });
      this.tableData = tableData;

      let option = {
        // backgroundColor: '#2c343c',
        title: {
          // text: "里程碑按期完成率",
          // text: rowData.name_json[0],
          left: "left",
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: (data) => {
            const dataIndex = data[0].dataIndex;
            const key = data[0]["axisValue"];

            return `${data[0].axisValue} <br/>
                ${data[0].value}${this.dataObj.unit[this.langArrIndex]}<br/>
                同比：${this.tableData[key].tongbiRate}
                <br/>
                环比：${this.tableData[key].huanbiRate}
               `;
          },
        },
        grid: {
          left: "15px",
          right: "30px",
          bottom: 70,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            show: true,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: "dashed",
            },
          },
          data: xAxisData,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function (value) {
              return value;
            },
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: "dashed",
            },
          },
          position: "right",
        },
        dataZoom: [
          {
            type: "inside",
          },
          {
            type: "slider",
          },
        ],
        series: [
          {
            data: seriesData,
            type: "line",
            areaStyle: {},
            showSymbol: false,
            smooth: true,
            label: {
              show: true,
            },
          },
        ],
        graphic: [
          {
            type: "group",
            // rotation: Math.PI / 2,
            bounding: "raw",
            right: "center",
            top: "center",
            // z: 100,
            children: [
              {
                type: "text",
                left: "center",
                top: "center",
                // z: 100,
                style: {
                  fill: "#999999",
                  text: `SOURCE: DATA.GARINASSET.COM`,
                  font: "bold 16px sans-serif",
                },
              },
            ],
          },
        ],
      };
      return option;
    },
    changeChartTypeHandler(e) {
      e.forEach((item) => {
        this.option.series.forEach((s) => {
          this.$set(s, item[0], item[1]);
        });
      });
    },
    changeChartToolsHandler(e, res) {
      let obj = this.option;
      if (e[0] == "series") {
        obj.series.forEach((item) => {
          let sObj = item;
          e.forEach((attr, index) => {
            if (index == 0) return;
            if (index < e.length - 1) {
              sObj = sObj[attr];
            }
          });
          this.$set(sObj, e[e.length - 1], res);
        });
      } else {
        e.forEach((attr, index) => {
          if (index < e.length - 1) {
            obj = obj[attr];
          }
        });
        this.$set(obj, e[e.length - 1], res);
      }
    },
    exportHandler() {
      let str = "日期,值,同比,环比\n";
      Object.keys(this.tableData).forEach((k) => {
        const { key, value, tongbiRate, huanbiRate } = this.tableData[k];
        str += k + ",";
        str += value ? value + "," : ",";
        str += tongbiRate ? tongbiRate + "," : ",";
        str += huanbiRate ? huanbiRate + "," : ",";
        str += "\n";
      });

      const uri =
        "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
      // 通过创建a标签实现
      const link = document.createElement("a");
      link.href = uri;
      // 对下载的文件命名
      link.download = `${this.dataInfo.title}.csv`;
      link.click();
    },
    imgExportHandler() {
      var img = new Image();
      img.src = this.$refs.chart.chart.getDataURL({
        pixelRatio: 2,
        backgroundColor: "#fff",
      });
      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");

        var a = document.createElement("a");
        var event = new MouseEvent("click");
        a.download = "图片.png";
        // 将生成的URL设置为a.href属性
        a.href = dataURL;
        a.dispatchEvent(event);
        a.remove();
      };
    },
    async getFavoritesList() {
      let res = await getFavorites();
      this.$store.commit("SET_FAVORITES_DATA", res.favorites || []);
    },
    async favoritesClickHandler() {
      if (this.inFavorites) {
        let res = await cancelFavorites(this.indicatorId);
        this.$store.commit("SET_FAVORITES_DATA", res.favorites);
        this.$message.success("移除自选成功");
      } else {
        let res = await addFavorites(this.indicatorId);
        this.$store.commit("SET_FAVORITES_DATA", res.favorites);
        this.$message.success("添加自选成功");
      }
    },
    comparisonHandler() {
      this.dialogVisible = true;
      // this.$nextTick(() => {
      //   console.log(this.$refs.ComparisonCont);
      //   this.$refs.ComparisonCont.setOption(_.cloneDeep(this.option));
      // });
    },
  },
};
</script>
<style lang="less" scoped>
.flex {
  display: flex;
}
.IndicatorDetail {
  height: 100%;
  max-width: 1280px;
  // width: 100%;
  margin: auto;
  @media screen and (max-width: 768px) {
    padding: 0 10px;
  }
  .detail-wrap {
    width: 100%;
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    .chart-data {
      width: 63%;
      @media screen and (max-width: 768px) {
        width: 100%;
      }
      // flex: 1;
      padding: 10px 0;
      .chart-head {
        display: flex;
        flex-wrap: wrap;
        .plus-optional {
          margin-left: auto;
          .plus-optional-btn {
            padding: 0.5rem 0.5rem;
            @media screen and (max-width: 768px) {
              padding: 0 0.5rem;
              height: 25px;
            }
            font-size: 0.8rem;
          }
          /deep/.el-button--info {
            background-color: #e6f1fb;
            color: #06c;
            border: 1px solid #e6f1fb;
          }
        }
        .c-title {
          font-size: 1.5rem;

          font-weight: bold;
          margin: 0 5px 10px;
          line-height: 25px;
        }
        .c-tag-1 {
          height: 25px;
          // font-size: 14px;
          font-size: 1rem;
          background-color: #efefef;
          line-height: 25px;
          padding: 0 5px;
          margin: 0 10px;
          border-radius: 3px;
        }
        .c-tag-2 {
          margin: 0 0.2rem;
          // font-size: 25px;
          font-size: 1.5rem;
          line-height: 25px;
        }
        .c-tag-3 {
          height: 25px;
          // font-size: 14px;
          font-size: 0.7rem;
          background-color: #e6f1fb;
          color: #06c;
          line-height: 25px;
          margin: 0 0.2rem;
          padding: 0 0.5rem;
          border-radius: 3px;
        }
      }
      .chart-head-2 {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        justify-content: space-between;
        border-bottom: 1px solid #edf0f5;
        padding: 10px 0;
        .chart-head-2-l {
          margin-bottom: 7px;
          display: flex;
          align-items:flex-end;
          // font-size: 30px;
          font-size: 20px;
          @media screen and (max-width: 768px) {
            font-size: 14px;
          }
          .c-tag-4 {
            font-size: 2rem;
            font-weight: 600;
            color: #527f52;
            margin-right: 0.5rem;
          }
          .c-tag-5,
          .c-tag-6 {
            // height: 20px;
            color: #527f52;
            margin-left: 0.1rem;
            margin-right: 0.1rem;
            font-size: 0.7em;
            padding-bottom: .3rem;
          }
          .c-tag-7 {
            color: #527f52;
            font-size: 1.2rem;
            // line-height: 2rem;
            margin-left: 0.7rem;
            margin-right: 0.5rem;
            padding-bottom: .1rem;
          }
        }
        .chart-head-2-r {
          display: flex;
          flex-direction: column;
          align-content: center;
          text-align: right;
          @media screen and (max-width: 768px) {
            text-align: left;
          }
          // margin-top: 16px;
          font-size: 0.6em;
          font-weight: 400;
          color: #909499;
          line-height: 14px;
          .chart-head-2-r-item {
            margin-bottom: 3px;
          }
        }
      }
      .chart-tool {
        @media screen and (max-width: 768px) {
          display: none;
        }
      }
      #chart {
        height: 400px;
        width: 100%;
        @media screen and (max-width: 768px) {
          height: 300px;
        }
      }
    }
    .desc-data {
      width: calc(37% - 50px);
      margin-left: 50px;
      @media screen and (max-width: 768px) {
        margin-left: 0;
        width: 100%;
      }
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
      .flex {
        display: flex;
        // justify-content: space-between;
      }
      .desc-content-plus {
        margin-left: 5px;
        color: #33353c;
        background-color: #e6f1fb;
        color: #06c;
        padding: 0 5px;
      }
    }
  }
}
</style>
