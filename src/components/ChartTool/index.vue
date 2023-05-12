<template>
  <div class="tool-bar">
    <div class="tool-item">
      <el-popover
        placement="bottom-start"
        width="400"
        trigger="click"
        :visible-arrow="false"
      >
        <el-radio-group
          size="small"
          v-model="currentType"
          @change="typeChangeHandler"
        >
          <template v-for="item in types">
            <el-radio-button :label="item.name" :name="item.name">
              {{ item.label }}
            </el-radio-button>
          </template>
        </el-radio-group>
        <el-button icon="el-icon-s-data" size="small" slot="reference">
          图表{{ currentType }}
        </el-button>
      </el-popover>
    </div>

    <div class="tool-item">
      <el-popover
        placement="bottom-start"
        width="400"
        trigger="click"
        :visible-arrow="false"
      >
        <el-checkbox-group
          v-model="currentTools"
          size="small"
          @change="toolChangeHandler"
        >
          <template v-for="item in tools">
            <el-checkbox-button
              v-if="getDepends(item)"
              :label="item.name"
              :key="item.name"
              >{{ item.label }}</el-checkbox-button
            >
          </template>
        </el-checkbox-group>
        <el-button icon="el-icon-setting" size="small" slot="reference">
          工具
        </el-button>
      </el-popover>
    </div>

    <div class="tool-item">
      <el-button icon="el-icon-folder" size="small" @click="exportHandler">
        导出
      </el-button>
    </div>
    <div class="tool-item">
      <el-button icon="el-icon-camera" size="small" @click="imgExportHandler">
        截图
      </el-button>
    </div>
    <div class="tool-item">
      <el-button
        icon="el-icon-data-analysis"
        size="small"
        @click="comparisonHandler"
      >
        对比
      </el-button>
    </div>
  </div>
</template>
<script>
import { CHART_TYPES } from "./config/chartType.config";
export default {
  data() {
    return {
      currentType: "area",
      currentTools: [
        "yAxis.axisLine.show",
        "xAxis.axisLine.show",
        "series.smooth",
      ],
      lastTools: ["yAxis.axisLine.show", "xAxis.axisLine.show"],
      types: [
        {
          label: "折线图",
          name: "line",
        },
        {
          label: "柱状图",
          name: "bar",
        },
        {
          label: "面积图",
          name: "area",
        },
      ],
      tools: [
        {
          label: "y轴分割",
          name: "yAxis.splitLine.show",
        },
        {
          label: "y轴",
          name: "yAxis.axisLine.show",
        },
        {
          label: "x轴分割",
          name: "xAxis.splitLine.show",
        },
        {
          label: "x轴",
          name: "xAxis.axisLine.show",
        },
        {
          label: "标签",
          name: "series.label.show",
        },
        {
          label: "平滑",
          name: "series.smooth",
          depends: ["!=", "bar"],
        },
      ],
      plusMap: {
        "series.label.show": "series.showSymbol",
      },
    };
  },
  methods: {
    getDepends({ depends }) {
      if (depends) {
        switch (depends[0]) {
          case "!=":
            if (this.currentType !== depends[1]) {
              return true;
            }
            return false;

          default:
            return false;
        }
      }
      return true;
    },
    typeChangeHandler(e) {
      console.log(e);
      this.$emit("changeType", CHART_TYPES[e]);
    },
    toolChangeHandler(e) {
      this.lastTools.forEach((item) => {
        if (e.indexOf(item) == -1) {
          const arr = item.split(".");
          this.$emit("changeTools", arr, false);
          if (this.plusMap[item]) {
            this.$emit("changeTools", this.plusMap[item].split("."), false);
          }
        }
      });
      e.forEach((item) => {
        if (this.lastTools.indexOf(item) == -1) {
          const arr = item.split(".");
          this.$emit("changeTools", arr, true);
          if (this.plusMap[item]) {
            this.$emit("changeTools", this.plusMap[item].split("."), true);
          }
        }
      });
      this.lastTools = e;
    },
    exportHandler() {
      this.$emit("export");
    },
    imgExportHandler() {
      this.$emit("imgExport");
    },
    comparisonHandler() {
      this.$emit("comparison");
    },
  },
};
</script>

<style lang="less" scoped>
.tool-bar {
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 3px;
  margin: 6px 0 -20px;
  display: flex;
  .tool-item {
    margin-right: 10px;
  }
}
</style>
