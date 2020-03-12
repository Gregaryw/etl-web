<template>
  <div>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="edit('')">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--etl任务列表-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="名称" align="center" width="120px;"></el-table-column>
      <el-table-column
        prop="model"
        label="类型"
        :formatter="formatterModel"
        align="center"
        width="120px;"
      ></el-table-column>
      <el-table-column prop="nodeName" label="工作节点" align="center" width="120px;"></el-table-column>
      <el-table-column
        prop="schedule"
        :formatter="formatterScheduleStatus"
        label="计划调度"
        align="center"
        width="80px;"
      ></el-table-column>
      <el-table-column prop="nextExecuteTime" label="下次调度时间" align="center" width="170px;"></el-table-column>
      <el-table-column prop="logStatus"  label="任务实例状态" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="300px;">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.status == 0 || scope.row.status == 3"
            @click="execute(scope.row.id,1)"
            icon="el-icon-video-play"
          >执行</el-button>
          <el-button type="text" v-if="scope.row.status == 1" icon="el-icon-loading">正在执行</el-button>
          <el-button
            type="text"
            v-if="scope.row.status == 2"
            @click="execute(scope.row.id,2)"
            icon="el-icon-video-pause"
          >暂停</el-button>
          <el-button
            type="text"
            v-if="scope.row.status == 1"
            size="small"
            @click="execute(scope.row.id,3)"
            icon="el-icon-switch-button"
          >停止</el-button>
          <el-button
            @click="transLog(scope.row)"
            type="text"
            icon="el-icon-reading"
            size="small"
          >查看日志</el-button>
          <el-button type="text" size="small" @click="edit(scope.row.id)" icon="el-icon-edit">编辑</el-button>
          <el-button
            type="text"
            size="small"
            @click="removeTask(scope.row.id)"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--新增/编辑任务对话框-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="转换" prop="etlTransId">
          <el-select v-model="form.etlTransId" placeholder="请选择转换">
            <el-option
              v-for="item in tranOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划调度">
          <el-switch
            v-model="form.schedule"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            :change="scheduleChange()"
          ></el-switch>
        </el-form-item>
        <el-form-item v-show="spaceShow">
          <div class="space">
            <div class="space-text">类型</div>
            <div class="space-type">
              <el-select
                v-model="form.scheduleType"
                size="small"
                @change="scheduleTypeChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in scheduleTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="space">
            <div class="space-text">秒间隔</div>
            <div class="space-content">
              <el-input-number
                v-model="form.seconds"
                size="small"
                controls-position="right"
                :min="0"
                :max="59"
                :disabled="timeAbled"
              ></el-input-number>
            </div>
          </div>
          <div class="space">
            <div class="space-text">分间隔</div>
            <div class="space-content">
              <el-input-number
                v-model="form.minutes"
                size="small"
                controls-position="right"
                :min="0"
                :max="59"
                :disabled="timeAbled"
              ></el-input-number>
            </div>
          </div>
          <div class="space">
            <div class="space-text" style="letter-spacing:5px;">每天</div>
            <div class="space-content">
              <el-input-number
                v-model="form.dayHours"
                size="small"
                controls-position="right"
                :min="0"
                :max="23"
                :disabled="dayAbled"
              ></el-input-number>
              <el-input-number
                v-model="form.dayMinutes"
                size="small"
                controls-position="right"
                :min="0"
                :max="59"
                :disabled="dayAbled"
              ></el-input-number>
            </div>
          </div>
          <div class="space">
            <div class="space-text" style="letter-spacing:5px;">每周</div>
            <div class="space-content">
              <el-select v-model="form.week" :disabled="weekAbled" placeholder="请选择">
                <el-option
                  v-for="item in weekOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="space">
            <div class="space-text" style="letter-spacing:5px;">每月</div>
            <div class="space-content">
              <el-input-number
                v-model="form.month"
                size="small"
                controls-position="right"
                :min="1"
                :max="30"
                :disabled="monthAbled"
              ></el-input-number>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="4" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!--转换日志对话框-->
    <el-dialog title="执行结果" :visible.sync="logDialogVisible" width="50%">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="日志" name="first">
            <pre>{{trasLog}}</pre>
          </el-tab-pane>
          <el-tab-pane label="步骤度量" name="second">
            <el-table :data="transStepGridData">
              <el-table-column property="stepname" align="center" label="步骤名称"></el-table-column>
              <el-table-column property="stepCopy" align="center" label="记录行数"></el-table-column>
              <el-table-column property="linesRead" align="center" label="读"></el-table-column>
              <el-table-column property="linesWritten" align="center" label="写"></el-table-column>
              <el-table-column property="linesInput" align="center" label="输入"></el-table-column>
              <el-table-column property="linesOutput" align="center" label="输出"></el-table-column>
              <el-table-column property="linesUpdated" align="center" label="更新"></el-table-column>
              <el-table-column property="linesRejected" align="center" label="拒绝"></el-table-column>
              <el-table-column property="errors" align="center" label="错误"></el-table-column>
              <el-table-column property="logDate" align="center" width="150px;" label="时间"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  postRequest,
  postKeyValueRequest,
  deleteById,
  getRequest,
  getDictField
} from "../../api/api";
import { getDictFieldValue } from "../../api/common.js";
const PREFIX_BASE = "/etl/master";
export default {
  name: "task",
  components: { Pagination },
  data() {
    return {
      filters: {
        name: ""
      },
      trasLog: "",
      transname: "",
      title: "",
      activeName: "first",
      timeAbled: true,
      dayAbled: true,
      weekAbled: true,
      monthAbled: true,
      tableData: [],
      transStepGridData: [],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        model: [{ required: true, message: "请选择类型", trigger: "change" }],
        etlTransId: [
          { required: true, message: "请选择转换", trigger: "change" }
        ],
        nodeId: [
          { required: true, message: "请选择工作节点", trigger: "change" }
        ]
      },
      tranOptions: [],
      nodeOptions: [],
      weekOptions: [
        { label: "周日", value: "SUN" },
        { label: "周一", value: "MON" },
        { label: "周二", value: "TUES" },
        { label: "周三", value: "WED" },
        { label: "周四", value: "THUR" },
        { label: "周五", value: "FRI" },
        { label: "周六", value: "SAT" }
      ],
      dialogFormVisible: false,
      logDialogVisible: false,
      form: {
        id: "",
        name: "",
        model: "",
        status: 0,
        etlTransId: "",
        nodeId: "",
        schedule: "0",
        scheduleType: "",
        seconds: "",
        minutes: "",
        dayHours: "",
        dayMinutes: "",
        week: "",
        month: "",
        year: "",
        remark: ""
      },
      spaceShow: false,
      scheduleTypes: [],
      list: null,
      total: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    };
  },
  created() {
    this.getList();
    //设置定时器，定期刷新列表数据
    setInterval(() => {
      this.getList();
    }, 15 * 10 * 10 * 10);
  },
  watch: {
    "form.scheduleType": {
      handler: function() {
        let scheduleType = this.form.scheduleType;
        this.timeAbled = scheduleType == 0 && scheduleType != "" ? false : true;
        this.dayAbled =
          scheduleType == 1 || scheduleType == 2 || scheduleType == 3
            ? false
            : true;
        this.weekAbled = scheduleType == 2 ? false : true;
        this.monthAbled = scheduleType == 3 ? false : true;
      }
    }
  },
  methods: {
    /**
     * 获取列表数据
     */
    getList() {
      this.listLoading = true;
      let param = {
        current: this.listQuery.page,
        size: this.listQuery.limit
      };
      postRequest(PREFIX_BASE + "/task/list/page", param).then(response => {
        this.tableData = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    /**
     * 编辑
     */
    edit(value) {
      if (value != null && value != "") {
        getRequest(PREFIX_BASE + "/task/selectOne?id=" + value).then(
          response => {
            if (response.code == 0) {
              this.form = response.data;
            } else {
              this.$message.error("失败");
              return;
            }
          }
        );
      }
      this.title = value == "" ? "新增" : "编辑";
      this.loadTransData();
      this.getEtlScheduleType();
      this.dialogFormVisible = true;
    },
    /**
     * 查看日志
     */
    transLog(item) {
      this.transname = item.name;
      postRequest(PREFIX_BASE + "/logs/list", {
        transname: this.transname
      }).then(response => {
        if (response.code == 0 && response.data.length > 0) {
          this.trasLog = response.data[0].logField;
        } else {
          this.$message.error("失败");
        }
      });
      this.logDialogVisible = true;
    },
    /**
     * 加载转换数据
     */
    loadTransData() {
      postRequest(PREFIX_BASE + "/trans/list", { status: 1 }).then(response => {
        this.tranOptions = response.data;
      });
    },
    /**
     * etl定时任务类型
     */
    getEtlScheduleType() {
      getDictField(
        PREFIX_BASE + "/sys/dict/field/code?code=etlTaskScheduleType"
      ).then(response => {
        this.scheduleTypes = response.data;
      });
    },
    /**
     * 取消
     */
    cancel() {
      this.resetFormField();
      this.dialogFormVisible = false;
    },
    resetFormField() {
      this.$refs["form"].resetFields();
      this.form.id = "";
      this.form.name = "";
      this.form.model = "";
      this.form.status = 0;
      this.form.etlTransId = "";
      this.form.nodeId = "";
      this.form.schedule = 0;
      this.form.scheduleType = "";
      this.form.seconds = "";
      this.form.minutes = "";
      this.form.dayHours = "";
      this.form.dayMinutes = "";
      this.form.month = "";
      this.form.year = "";
      this.form.remark = "";
    },
    /**
     * 计划调度切换
     */
    scheduleChange() {
      this.spaceShow = this.form.schedule == 1 ? true : false;
    },
    handleClick(tab, event) {
      let tabId = event.currentTarget.id;
      if (tabId == "tab-first") {
        postRequest(PREFIX_BASE + "/logs/list", {
          transname: this.transname
        }).then(response => {
          if (response.code == 0 && response.data.length > 0) {
            this.trasLog = response.data[0].logField;
          } else {
            this.$message.error("失败");
          }
        });
      } else if (tabId == "tab-second") {
        postRequest(PREFIX_BASE + "/logs/step/list", {
          transname: this.transname
        }).then(response => {
          if (response.code == 0) {
            this.transStepGridData = response.data;
          } else {
            this.$message.error("失败");
          }
        });
      }
    },
    /**
     * 提交表单
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = this.form.id == "" ? "insert" : "update";
          postRequest(PREFIX_BASE + "/task/" + url, this.form).then(rep => {
            if (rep.code == 0) {
              this.resetFormField();
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$message.error(rep.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    /**
     * 执行
     */
    execute(id, type) {
      let uri = "";
      switch (type) {
        case 1:
          uri = "start";
          break;
        case 2:
          uri = "pause";
          break;
        case 3:
          uri = "stop";
          break;
      }
      if (uri != "") {
        getRequest(PREFIX_BASE + "/task/" + uri, id).then(response => {
          if (response.code == 0) {
            this.getList();
          } else {
            this.$message.error("失败");
          }
        });
      }
    },
    /**
     * 删除任务
     */
    removeTask(id) {
      deleteById(PREFIX_BASE + "/task/remove/" + id).then(response => {
        if (response.code == 0) {
          this.getList();
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    formatterModel: function(row, column) {
      let status = "";
      switch (row.model) {
        case 1:
          status = "表到表全量";
          break;
        case 2:
          status = "表到表增量";
          break;
        case 3:
          status = "文件到表";
          break;
        case 4:
          status = "脚本到表";
          break;
      }
      return status;
    },
    scheduleTypeChange(event) {
      this.form.seconds = "";
      this.form.minutes = "";
      this.form.dayHours = "";
      this.form.dayMinutes = "";
      this.form.month = "";
      this.form.year = "";
    },
    formatterScheduleStatus: function(row, column) {
      let status = "";
      switch (row.schedule) {
        case "0":
          status = "否";
          break;
        case "1":
          status = "是";
          break;
      }
      return status;
    },
    // formatterStatus: function(row, column) {
    //   let status = "";
    //   switch (row.status) {
    //     case 0:
    //       status = "未执行";
    //       break;
    //     case (1, 2):
    //       status = "正在调度";
    //       break;
    //     case 3:
    //       status = "完成调度";
    //       break;
    //     case 4:
    //       status = "调度失败";
    //       break;
    //   }
    //   return status;
    // },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },

    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
};
</script>
<style scoped>
.detail {
  display: flex;
  flex-direction: row;
}
.detail-type {
  height: 50%;
  width: 40%;
}
.detail-set {
  margin-left: 40px;
}
.space {
  display: flex;
  flex-direction: row;
}
.space-text {
  text-align: right;
  vertical-align: middle;
  float: left;
  color: #606266;
  line-height: 30px;
  padding: 0 12px 0 0;
}
.space-content {
  display: inline-block;
  position: relative;
}
.space-type {
  margin-left: 10px;
}
</style>