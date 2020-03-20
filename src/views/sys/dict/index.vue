<template>
  <div class="dict-container">
    <div class="dict-left">
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dictDialogFormVisible = true">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <div class="dict-list">
        <el-table
          ref="singleTable"
          :data="dictTableData"
          border
          @cell-dblclick="loadDictField"
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column property="code" label="代码" align="center"></el-table-column>
          <el-table-column property="name" label="名称" align="center"></el-table-column>
          <el-table-column property="type" label="类型" align="center" :formatter="formatterType"></el-table-column>
          <el-table-column property="remark" label="备注" header-align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="addDictField(scope.row)"
                type="text"
                size="small"
              >添加属性</el-button>
              <el-button @click.native.prevent="deleteRow(scope.row.id)" type="text" size="small">移除</el-button>
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
      </div>
    </div>
    <div class="dict-right">
      <div class="toolbar">
        <el-button
          type="danger"
          size="medium"
          icon="el-icon-delete"
          @click="batchRemove()"
          round
        >批量删除</el-button>
      </div>
      <div class="dict-field-list">
        <el-table
          ref="multipleTable"
          :data="dictFieldTableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="名称" width="120" align="center"></el-table-column>
          <el-table-column prop="value" label="属性" width="120" align="center"></el-table-column>
          <el-table-column prop="enable" label="是否启用" width="120" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable"
                active-text="是"
                :active-value="1"
                inactive-text="否"
                :inactive-value="0"
                @change="switchChange(scope.row.id)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="sortNo" label="排序" align="center"></el-table-column>
        </el-table>
      </div>
    </div>

    <!--字典-->
    <el-dialog
      :title="dictTitle"
      :rules="dictRules"
      :visible.sync="dictDialogFormVisible"
      width="30%"
    >
      <el-form :model="dictForm" :rules="dictRules" ref="dictForm">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="dictForm.type">
            <el-radio label="0">系统级</el-radio>
            <el-radio label="1">业务级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标识" :label-width="formLabelWidth" prop="code">
          <el-input v-model="dictForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dictForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="4" v-model="dictForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear('dictForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('dictForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--字典字段-->
    <el-dialog :title="dictFieldTitle" :visible.sync="dictFieldDialogFormVisible" width="30%">
      <el-form :model="dictFieldForm" :rules="dictFieldRules" ref="dictFieldForm">
        <el-form-item label="名称" :label-width="fieldLabelWidth" prop="name">
          <el-input v-model="dictFieldForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性值" :label-width="fieldLabelWidth" prop="value">
          <el-input v-model="dictFieldForm.value" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="fieldLabelWidth">
          <el-switch
            v-model="dictFieldForm.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            active-value="1"
            inactive-text="否"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="排序" :label-width="fieldLabelWidth">
          <el-slider v-model="dictFieldForm.sortNo" show-input></el-slider>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear('dictFieldForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('dictFieldForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { postRequest, deleteById } from "../../../api/api";
const PREFIX_BASE = "/etl/master/sys";
export default {
  name: "dict",
  components: { Pagination },
  data() {
    return {
      filters: {
        name: ""
      },
      dictForm: {
        code: "",
        name: "",
        type: "",
        remark: ""
      },
      dictFieldForm: {
        sysDictId: "",
        name: "",
        value: "",
        enable: 0,
        sortNo: 0
      },
      dictRules: {
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入标识", trigger: "blur" }]
      },
      dictFieldRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        value: [{ required: true, message: "请输入值", trigger: "blur" }]
      },
      dictTitle: "新增数据字典",
      dictFieldTitle: "",
      formLabelWidth: "50px",
      fieldLabelWidth: "80px",
      dictDialogFormVisible: false,
      dictFieldDialogFormVisible: false,
      value1: 1,
      value: 0,
      list: null,
      total: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dictTableData: null,
      dictFieldTableData: null,
      currentRow: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     * 取消
     */

    clear(formName) {
      if ("dictForm" === formName) {
        this.dictDialogFormVisible = false;
        this.$refs[formName].resetFields();
        this.dictForm.remark = "";
      } else if ("dictFieldForm" == formName) {
        this.dictFieldDialogFormVisible = false;
        this.$refs[formName].resetFields();
        this.dictFieldForm.enable = 0;
        this.dictFieldForm.sortNo = 0;
        this.dictFieldForm.sysDictId = "";
      }
    },
    /**
     * 添加属性
     */
    addDictField(row) {
      //显示添加窗口
      this.dictFieldTitle = "添加" + row.name + "字段";
      this.dictFieldDialogFormVisible = true;
      this.dictFieldForm.sysDictId = row.id;
    },
    /**
     * 删除数据
     */
    deleteRow(id) {
      deleteById(PREFIX_BASE + "/dict/delete/byId/" + id);
      this.getList();
      this.getDictFieldList("");
    },
    /**
     * 转换格式显示
     */
    formatterType: function(row, column) {
      let type = "";
      switch (row.type) {
        case 0:
          type = "系统级";
        case 1:
          type = "业务级";
      }
      return type;
    },
    /**
     * 加载字段属性列表
     */
    loadDictField(row) {
      this.getDictFieldList(row.id);
    },
    /**
     * 批量删除属性
     */
    batchRemove() {
      let params = [];
      this.$refs.multipleTable.selection.forEach(field => {
        params.push(field.id);
      });
      if(params.length > 0){
        postRequest(PREFIX_BASE + "/field/batch/remove").then(res => {
          if(res.code == 0){
            this.getDictFieldList();
          }
        })
      }
    },
    /**
     * 开关属性变更
     */
    switchChange(id) {
    },
    /**
     * 提交表单
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if ("dictForm" == formName) {
            postRequest(PREFIX_BASE + "/dict/save", this.dictForm).then(rep => {
              if (rep.code == 0) {
                this.$refs[formName].resetFields();
                this.dictForm.remark = "";
                this.dictDialogFormVisible = false;
                this.getList();
              }
            });
          } else if ("dictFieldForm" == formName) {
            postRequest(
              PREFIX_BASE + "/dict/field/save",
              this.dictFieldForm
            ).then(rep => {
              if (rep.code == 0) {
                let sysDictId = this.dictFieldForm.sysDictId;
                this.getDictFieldList(sysDictId);
                this.$refs[formName].resetFields();
              }
            });
          }
        } else {
          return false;
        }
      });
    },

    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    getList() {
      this.listLoading = true;
      let param = {
        current: this.listQuery.page,
        size: this.listQuery.limit
      };
      postRequest(PREFIX_BASE + "/dict/list/byPage", param).then(response => {
        this.dictTableData = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    getDictFieldList(sysDictId) {
      postRequest(PREFIX_BASE + "/dict/field/list", {
        sysDictId: sysDictId
      }).then(response => {
        this.dictFieldTableData = response.data;
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    }
    // handleCurrentChange(val) {
    //   this.listQuery.page = val;
    //   this.getList();
    // }
  }
};
</script>
<style scoped>
.dict-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.dict-left {
  width: 49%;
  height: 100%;
  border: 3px solid #b0c4de;
}
.dict-right {
  width: 50%;
  height: 100%;
  border: 3px solid #b0c4de;
  margin-left: 1%;
}
</style>