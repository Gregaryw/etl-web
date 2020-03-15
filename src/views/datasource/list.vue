<template>
  <div>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="datasourceTypeName" label="类型" align="center"></el-table-column>
      <el-table-column prop="dbName" label="数据库名称" align="center"></el-table-column>
      <el-table-column prop="url" label="连接地址" align="center"></el-table-column>
      <el-table-column prop="driverClass" label="驱动" align="center"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" @click.native.prevent="deleteRow(scope.row.id)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增数据源" :visible.sync="dialogFormVisible">
      <el-form :model="datasourceForm" :rules="datasourceRules" ref="datasourceForm">
        <el-form-item label="连接名称" prop="name">
          <el-input v-model="datasourceForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <div class="detail">
          <div class="detail-type">
            <el-form-item label="连接类型" prop="driverClass">
              <el-select
                v-model="datasourceForm.driverClass"
                @change="optionChange"
                placeholder="请选择数据库类型"
              >
                <el-option
                  v-for="item in datasourceOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="detail-set">
            <div class="datasource-link">
              <span>数据库连接设置</span>
            </div>
            <div class="column">
              <el-input v-model="datasourceForm.url" placeholder="数据库地址" autocomplete="off"></el-input>
            </div>
            <div class="column">
              <el-input v-model="datasourceForm.port" placeholder="端口" autocomplete="off"></el-input>
            </div>
            <div class="column">
              <el-input v-model="datasourceForm.dbName" placeholder="数据库名称" autocomplete="off"></el-input>
            </div>
            <div class="column">
              <el-input v-model="datasourceForm.username" placeholder="用户名" autocomplete="off"></el-input>
            </div>
            <div class="column">
              <el-input
                v-model="datasourceForm.password"
                type="password"
                placeholder="密码"
                autocomplete="off"
              ></el-input>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="dialogFormVisible = false">测试连接</el-button>
        <el-button type="primary" @click="submitForm('datasourceForm')">确 定</el-button>
      </div>
    </el-dialog>

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
const DATASOURCE_TYPE_CODE = "datasourceType";
export default {
  name: "datasource",
  components: { Pagination },
  data() {
    return {
      tableData: [],
      datasourceOptions: [],
      dialogFormVisible: false,
      filters: {
        name: null
      },
      datasourceForm: {
        id: "",
        name: "",
        dbName: "",
        url: "",
        datasourceTypeName: "",
        driverClass: "",
        username: "",
        password: "",
        port: "",
        duty: ""
      },
      datasourceRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        driverClass: [
          { required: true, message: "请选择数据库类型", trigger: "change" }
        ]
      },
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
  methods: {
    /**
     * 新增
     */
    add() {
      this.getDatasourceList();
    },
    /**
     * 删除
     */
    deleteRow(id) {
      deleteById(PREFIX_BASE + "/datasource/delete/primary/" + id).then(
        response => {
          if (response.code == 0) {
            this.getList();
          } else {
            Message.error({ message: "删除失败" });
          }
        }
      );
    },
    /**
     * 获取数据库数据
     */
    getDatasourceList() {
      getRequest(
        PREFIX_BASE + "/sys/dict/code?code=" + DATASOURCE_TYPE_CODE
      ).then(respone => {
        this.datasourceOptions = respone.data[0].sysDictFieldList;
        this.dialogFormVisible = true;
      });
    },
    /**
     * 下拉有变化
     */
    optionChange(event) {
      let obj = {};
      obj = this.datasourceOptions.find(item => {
        return item.value == event;
      });
      this.datasourceForm.datasourceTypeName = obj.name;
    },
    /**
     * 提交表单
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          postRequest(
            PREFIX_BASE + "/datasource/save",
            this.datasourceForm
          ).then(rep => {
            if (rep.code == 0) {
              this.$refs[formName].resetFields();
              this.datasourceForm.url = "";
              this.datasourceForm.port = "";
              this.datasourceForm.dbName = "";
              this.datasourceForm.username = "";
              this.datasourceForm.password = "";
              this.dialogFormVisible = false;
              this.getList();
            }
          });
        } else {
          return false;
        }
      });
    },
    /**
     * 获取列表数据
     */
    getList() {
      this.listLoading = true;
      let param = {
        current: this.listQuery.page,
        size: this.listQuery.limit
      };
      postRequest(PREFIX_BASE + "/datasource/list/byPage", param).then(
        response => {
          this.tableData = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }
      );
    },
    /**
     * 获取数据类型
     */
    getDatasourceType() {
      postRequest(PREFIX_BASE + "/dict/field/list", {
        sysDictId: sysDictId
      }).then(response => {
        this.dictFieldTableData = response.data;
      });
    },
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
.datasource-link span {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-weight: 700;
}
.column {
  line-height: 40px;
}
.el-dialog__footer {
  padding: 10px 20px 20px;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>