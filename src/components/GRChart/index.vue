<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
import elementResizeDetectorMaker from "element-resize-detector";
import * as echarts from "echarts";
import _ from 'lodash'

export default {
  name: "GRChart",
  props: {
    options: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      chart: null,
      canDo: false,
    };
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      let erd = elementResizeDetectorMaker();
      erd.listenTo(this.$refs.chart, () => {
        this.chart.resize();
      });

      this.canDo = true;
    },
    reloadChart() {
      this.$nextTick(() => {

      console.log('3333');
        if (this.canDo) {
          this.chart.clear();
          this.chart.setOption(this.options);
        }
      });
    },
  },
  watch: {
    options: {
      handler(e) {
        console.log("XXXXXX,", e);
        this.reloadChart();
      },
      deep: true,
    },
  },
  async mounted() {
    await this.initChart();
    let that = this;
    this.reloadChart();
  },
};
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
