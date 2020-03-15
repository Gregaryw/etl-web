<template>
  <div class="dashboard-editor-container">
    <panel-group
      :task-num="statisticsData.taskNum"
      :node-num="statisticsData.nodeNum"
      :trans-num="statisticsData.transNum"
      :resources="statisticsData.resources"
    />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" :gutter="8">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <cpu-chart :chart-data="cpuChartData" />
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="margin-bottom:30px;"
      >
        <memery-chart :chart-data="memChartData" />
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="cpuMemData" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import CpuChart from "./components/CpuChart";
import MemeryChart from "./components/MemeryChart";
import { postRequest, getRequest } from "../../../api/api";
import { dateTime2str } from "@/utils/dateUtil";
const PREFIX_BASE = "/etl/master";
export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    LineChart,
    CpuChart,
    MemeryChart
  },
  data() {
    return {
      statisticsData: {},
      // lineChartData: lineChartData.cpuMemData,
      memChartData: [],
      cpuChartData: [],
      cpuMemData: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    // handleSetLineChartData(type) {
    //   this.lineChartData = lineChartData[type];
    // },
    init() {
      for (let i = 0; i < 60; i++) {
        this.cpuMemData.push([dateTime2str(new Date(), "hh:mm:ss"), 0, 0]);
      }
      // setInterval(() => {
      //   getRequest(PREFIX_BASE + "/index/trend/data").then(res => {
      //     if (res.code == 0) {
      //       this.cpuMemData.push([
      //         dateTime2str(new Date(), "hh:mm:ss"),
      //         res.data.cpu,
      //         res.data.mem
      //       ]);
      //       if (this.cpuMemData.length >= 60) {
      //         this.cpuMemData.shift();
      //       }
      //     }
      //   });
      // }, 1000);
      this.fetchServerInfo();
     // this.startInterval();
    },
    //获取服务信息
    fetchServerInfo() {
      //获取统计数据
      getRequest(PREFIX_BASE + "/index/statistics").then(res => {
        if (res.code == 0) {
          this.statisticsData = res.data;
        }
      });
      //获取master服务器信息
      getRequest(PREFIX_BASE + "/index/server/info").then(res => {
        if (res.code == 0) {
          this.memChartData = [
            { value: res.data.mem.memUsed, name: "使用中" },
            { value: res.data.mem.memFrees, name: "可用" }
          ];
          this.cpuChartData = [
            { value: res.data.cpu.userPers, name: "用户利用率" },
            { value: res.data.cpu.sysPers, name: "系统利用率" },
            { value: res.data.cpu.cpuPers, name: "CPU利用率" },
            { value: res.data.cpu.remain, name: "剩余" }
          ];
        }
      });
    },
    //开启定时器
    startInterval() {
      //定时刷新数据
      setInterval(() => {
        this.fetchServerInfo();
      }, 3000);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
