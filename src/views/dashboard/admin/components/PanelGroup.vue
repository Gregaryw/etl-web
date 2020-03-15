<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('task')">
        <div class="card-panel-icon-wrapper icon-task">
          <router-link to="/task/list">
            <svg-icon icon-class="task-c" class-name="card-panel-icon" />
          </router-link>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">任务数量</div>
          <count-to :start-val="0" :end-val="taskNum" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('node')">
        <div class="card-panel-icon-wrapper icon-node">
          <router-link to="/node/list">
            <svg-icon icon-class="monitor-c" class-name="card-panel-icon" />
          </router-link>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">节点数量</div>
          <count-to :start-val="0" :end-val="nodeNum" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('trans')">
        <div class="card-panel-icon-wrapper icon-trans">
          <router-link to="/trans/list">
            <svg-icon icon-class="trans-c" class-name="card-panel-icon" />
          </router-link>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">转换数量</div>
          <count-to :start-val="0" :end-val="transNum" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('resources')">
        <div class="card-panel-icon-wrapper icon-resources">
          <router-link to="/datasource/list">
            <svg-icon icon-class="database-c" class-name="card-panel-icon" />
          </router-link>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">资源数量</div>
          <count-to :start-val="0" :end-val="resources" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo
  },
  props: {
    taskNum: {
      type: Number,
      default: 0
    },
    nodeNum: {
      type: Number,
      default: 0
    },
    transNum: {
      type: Number,
      default: 0
    },
    resources: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-task {
        background: #40c9c6;
      }
      .icon-node {
        background: #36a3f7;
      }
      .icon-trans {
        background: #f4516c;
      }
      .icon-resources {
        background: #34bfa3;
      }
    }
    .icon-task {
      color: #40c9c6;
    }
    .icon-node {
      color: #36a3f7;
    }
    .icon-trans {
      color: #f4516c;
    }
    .icon-resources {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
