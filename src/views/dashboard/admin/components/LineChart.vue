<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "350px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.initChart();
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHandler);
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    this.sidebarElm &&
      this.sidebarElm.addEventListener(
        "transitionend",
        this.sidebarResizeHandler
      );
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHandler);
    }

    this.sidebarElm &&
      this.sidebarElm.removeEventListener(
        "transitionend",
        this.sidebarResizeHandler
      );

    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === "width") {
        this.__resizeHandler();
      }
    },
    setOptions(data) {
      var dateList = data.map(function(item) {
        return item[0];
      });
      var cpuValueList = data.map(function(item) {
        return item[1];
      });
      var memValueList = data.map(function(item) {
        return item[2];
      });

      //  var base = cpuValueList.reduce(function(min, val) {
      //   return Math.floor(Math.min(min, val.l));
      // }, Infinity);

      this.chart.setOption({
        // Make gradient line here
        visualMap: [
          {
            show: false,
            type: "continuous",
            seriesIndex: 0,
            min: 0,
            max: dateList.length - 1
          }
          // {
          //   show: false,
          //   type: "continuous",
          //   seriesIndex: 1,
          //   dimension: 0,
          //   min: 0,
          //   max: dateList.length - 1
          // }
        ],

        title: [
          {
            left: "center",
            text: "CPU使用率"
          }
          // {
          //   top: "55%",
          //   left: "center",
          //   text: "内存使用量"
          // }
        ],
        tooltip: {
          trigger: "axis"
        },
        xAxis: [
          {
            data: dateList
          }
          // {
          //   data: dateList
          // }
        ],
        yAxis: {
          axisLabel: {
            formatter: function(val) {
              return val + "%";
            }
          },
          min: 0,
          max: 100,
          splitNumber: 5,
          splitLine: {
            show: false
          }
        },
        grid: [
          // {
          //   bottom: "60%"
          // },
          {
            top: "10%"
          }
        ],
        series: [
          {
            type: "line",
            showSymbol: false,
            data: cpuValueList
          }
        ]

        // title: {
        //   text: "Confidence Band",
        //   subtext: "Example in MetricsGraphics.js",
        //   left: "center"
        // },
        // tooltip: {
        //   trigger: "axis",
        //   axisPointer: {
        //     type: "cross",
        //     animation: false,
        //     label: {
        //       backgroundColor: "#ccc",
        //       borderColor: "#aaa",
        //       borderWidth: 1,
        //       shadowBlur: 0,
        //       shadowOffsetX: 0,
        //       shadowOffsetY: 0,

        //       color: "#222"
        //     }
        //   },
        //   formatter: function(params) {
        //     return params[2].name + "<br />" + params[2].value;
        //   }
        // },
        // grid: {
        //   left: "3%",
        //   right: "4%",
        //   bottom: "3%",
        //   containLabel: true
        // },
        // xAxis: {
        //   type: "category",
        //   data: data.map(function(item) {
        //     return item.date;
        //   }),
        //   axisLabel: {
        //     formatter: function(value, idx) {
        //       var date = new Date(value);
        //       return idx === 0
        //         ? value
        //         : [date.getMonth() + 1, date.getDate()].join("-");
        //     }
        //   },
        //   splitLine: {
        //     show: false
        //   },
        //   boundaryGap: false
        // },
        // yAxis: {
        //   axisLabel: {
        //     formatter: function(val) {
        //       return (val - base) * 100 + "%";
        //     }
        //   },
        //   axisPointer: {
        //     label: {
        //       formatter: function(params) {
        //         return ((params.value - base) * 100).toFixed(1) + "%";
        //       }
        //     }
        //   },
        //   splitNumber: 3,
        //   splitLine: {
        //     show: false
        //   }
        // },
        // series: [
        //   {
        //     name: "L",
        //     type: "line",
        //     data: cpuValueList.map(function(item) {
        //       return item + "%";
        //     }),
        //     lineStyle: {
        //       opacity: 0
        //     },
        //     stack: "confidence-band",
        //     symbol: "none"
        //   },
        //   {
        //     name: "U",
        //     type: "line",
        //     data: data.map(function(item) {
        //       return item.u - item.l;
        //     }),
        //     lineStyle: {
        //       opacity: 0
        //     },
        //     areaStyle: {
        //       color: "#ccc"
        //     },
        //     stack: "confidence-band",
        //     symbol: "none"
        //   },
        //   {
        //     type: "line",
        //     data: data.map(function(item) {
        //       return item.value + base;
        //     }),
        //     hoverAnimation: false,
        //     symbolSize: 6,
        //     itemStyle: {
        //       color: "#c23531"
        //     },
        //     showSymbol: false
        //   }
        // ]
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      // this.setOptions(this.chartData);
    }
  }
};
</script>
