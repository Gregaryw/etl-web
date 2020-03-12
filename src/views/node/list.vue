<template>
  <div>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="nodeData" border style="width: 100%">
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="ip" label="IP" align="center"></el-table-column>
      <el-table-column prop="port" label="端口" align="center"></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        :formatter="formatterStatus"
      ></el-table-column>
      <el-table-column  label="JVM" align="center">
        <el-table-column prop="etlNodeMonitor.jvmMax" label="最大内存" align="center" ></el-table-column>
        <el-table-column prop="etlNodeMonitor.jvmCommitted" label="可用内存" align="center"></el-table-column>
        <el-table-column prop="etlNodeMonitor.jvmUsed" label="已用内存" align="center"></el-table-column>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { postRequest, deleteById, getRequest } from "../../api/api";
const PREFIX_BASE = "/etl/master";
export default {
  name: "node",
  components: { Pagination },
  data() {
    return {
      nodeData: [],
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
  },
  mounted(){
    setInterval(() => {
      this.getList();
    }, 3000);
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
      postRequest(PREFIX_BASE + "/node/list/page", param).then(response => {
        this.nodeData = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    /**
     * 格式化状态显示
     */
    formatterStatus: function(row, column) {
      let status = "";
      switch (row.status) {
        case 0:
          status = "删除";
          break;
        case 1:
          status = "在线";
          break;
        case 2:
          status = "离线";
          break;
      }
      return status;
    }
  }
};
</script>
