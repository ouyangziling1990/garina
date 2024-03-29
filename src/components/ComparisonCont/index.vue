<i18n>
  {
    "en": {
      "search":"Search"
    },
    "zh-CN":{
      "search":"搜索"
    }
  }
</i18n>
<template>
  <div class="box">
    <div class="box-l">
      <GRChart id="chart1" ref="chart" :options="option" v-if="option" />
    </div>
    <div class="box-r">
      <el-autocomplete
        class="inline-input"
        v-model="searchInput"
        :fetch-suggestions="querySearch"
        :placeholder="$t('search')"
        :trigger-on-focus="false"
        @select="handleSelect"
        popper-class="popup"
      >
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
        <template slot-scope="{ item }">
          <div class="item">
            <span :class="['country', 'fi', `fi-${item.country_emoji_flag}`]">
            </span>
            <span class="target">{{ item.region }}</span>
            <span class="target">{{ item.name }}</span>
          </div>
        </template>
      </el-autocomplete>
      <div class="box-r-cont">
        <div v-for="item in tags" class="tag">
          <el-tag
            :key="item.id"
            :closable="item.id !== defaultId"
            @close="delTag(item)"
          >
            <span
              :class="['country', 'fi', `fi-${item.country_emoji_flag}`]"
            ></span>
            <span class="target">{{ item.region }}</span>
            {{ item.name.name_json[langArrIndex] }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GRChart from "@/components/GRChart";
import TopSearch from "@/components/TopSearch";
import { searchIndicators, getIndicatorDetail } from "@/api/index";
import { mapState } from "vuex";
export default {
  name: "IndicatorDetail",
  components: { GRChart, TopSearch },
  props: {
    defaultId: String,
  },
  data() {
    return {
      // option: null,
      searchInput: null,
      dataMap: {},
    };
  },
  mounted() {
    if (!this.dataMap[this.defaultId]) {
      this.handleSelect({ id: this.defaultId });
    }
  },
  computed: {
    ...mapState(["langArrIndex"]),
    option() {
      const keys = Object.keys(this.dataMap);
      if (!keys.length) return;
      console.log(this.dataMap);
      const newMap = {};
      keys.forEach((k) => {
        this.dataMap[k].listData.forEach((item) => {
          if (newMap[item.label]) {
            newMap[item.label][k] = item;
          } else {
            newMap[item.label] = {
              [k]: item,
            };
          }
        });
      });
      console.log(newMap);
      const opt = {
        tooltip: {
          show: true,
          trigger: "axis",
          // formatter: (data) => {
          //   // const dataIndex = data[0].dataIndex;
          //   // const key = data[0]["axisValue"];
          //   // return `${data[0].axisValue} <br/>
          //   //     ${data[0].value}${this.dataObj.unit[this.langArrIndex]}<br/>
          //   //     同比：${this.tableData[key].tongbiRate}
          //   //     <br/>
          //   //     环比：${this.tableData[key].huanbiRate}
          //   //    `;
          // },
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
          data: Object.keys(newMap).sort((a, b) => {
            return new Date(a) - new Date(b);
          }),
        },
        yAxis: {
          type: "log",
          // type: "value",
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
        series: keys.map((k) => {
          return {
            name: k,
            data: Object.keys(newMap)
              .sort((a, b) => {
                return new Date(a) - new Date(b);
              })
              .map((key) => {
                if (newMap[key][k]) return newMap[key][k].value;
                return undefined;
              }),
            type: "line",
            areaStyle: {},
            showSymbol: false,
            smooth: true,
            connectNulls: true,
            label: {
              show: true,
            },
          };
        }),
        dataZoom: [
          {
            type: "inside",
          },
          {
            type: "slider",
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
                  text: `SOURCE: WWW.GARINASSET.COM`,
                  font: "bold 16px sans-serif",
                },
              },
            ],
          },
        ],
        legend: {},
      };
      console.log(opt);
      return opt;
    },
    tags() {
      return Object.values(this.dataMap).map((item) => {
        return {
          id: item.id,
          name: item.name,
          country_emoji_flag: item.country_emoji_flag,
          region: item.regions[this.langArrIndex],
        };
      });
    },
  },
  methods: {
    async querySearch(queryString, cb) {
      console.log(queryString, cb);
      let res = await searchIndicators(queryString);
      console.log(res);
      if (res && res.length) {
        const list = res
          .map((item) => {
            return {
              id: item.id,
              name: item.names.name_json[this.langArrIndex],
              country_emoji_flag: item.countries.iso3166_alpha2.toLowerCase(),
              region: item.regions.region_json[this.langArrIndex],
            };
          })
          .filter((item) => {
            return !this.dataMap[item.id];
          });
        cb(list);
      } else {
        return cb([]);
      }
    },
    async handleSelect({ id }) {
      console.log(id);

      const rowData = await getIndicatorDetail(id);
      console.log(rowData);
      this.$set(this.dataMap, id, {
        id: id,
        name: rowData.names,
        country_emoji_flag: rowData.countries.iso3166_alpha2.toLowerCase(),
        listData: this.getMapData(rowData),
        regions: rowData.regions.region_json,
      });
      console.log(this.dataMap, "👀");
    },
    getMapData(rowData) {
      const data_time_over_time_fixed = rowData.data_time_over_time_fixed;
      const data_year_over_year_fixed = rowData.data_year_over_year_fixed;
      const huanbiMap = rowData?.data_time_over_time?.data_json;
      const tongbiMap = rowData?.data_year_over_year?.data_json;
      const keyObj = rowData.data.data_json;
      const keys = Object.keys(keyObj);
      const arr = keys.map((key) => {
        const obj = {
          label: key,
          value: keyObj[key][0],
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
        return obj;
      });
      return arr;
    },
    delTag(item) {
      this.$delete(this.dataMap, item.id);
      console.log(this.dataMap);
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 500px;
  display: flex;
  flex-wrap: wrap;
  .box-l {
    width: calc(100% - 330px);
    margin-right: ;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
    #chart1 {
      width: 100%;
    }
  }
  .box-r {
    width: 300px;
    margin-left: 30px;
    @media screen and (max-width: 768px) {
      margin-left: 0;
      width: 100%;
    }
    .box-r-cont {
      margin-top: 20px;
      .tag {
        margin: 0 5px 5px 0;
      }
    }
  }
}
</style>
