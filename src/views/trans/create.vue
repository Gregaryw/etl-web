<template>
  <div class="trans-container">
    <div class="trans-title">
      <span class="trans-title-content">转换流程指导</span>
    </div>
    <div class="trans-step">
      <el-steps :space="450" :active="active" finish-status="success">
        <el-step title="选择模板"></el-step>
        <el-step title="源"></el-step>
        <el-step title="目标"></el-step>
        <el-step title="字段清洗"></el-step>
      </el-steps>
    </div>
    <div class="trans-template">
      <div class="trans-template-left">
        <el-card class="box-card">
          <ul>
            <li
              v-for="(item,index) in modelData"
              :key="index"
              class="model-li"
              v-bind:class="{modelFontColor:config.type==item.value}"
              @click="chooseModel(item.value)"
            >{{item.name}}</li>
          </ul>
        </el-card>
      </div>
      <div class="trans-template-right">
        <!--源--->
        <el-form ref="config" :model="config" label-width="80px" v-show="sourceShow">
          <el-form-item label="名称">
            <el-input v-model="config.name" style="width: 28%;" />
          </el-form-item>
          <el-form-item label="数据源">
            <el-select v-model="config.tableinput.dataSource" placeholder="请选择数据源">
              <el-option
                v-for="item in datasourceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="源表">
            <el-input v-model="config.tableinput.tableName" style="width: 28%;" />
            <el-button type="primary" @click="showSourceAllTables(1)">选择表</el-button>
          </el-form-item>
          <el-form-item label="SQL">
            <el-input type="textarea" :rows="7" v-model="config.tableinput.SQL"></el-input>
          </el-form-item>
        </el-form>

        <!--目标-->
        <el-form ref="form" :model="form" label-width="80px" v-show="active == 2">
          <el-form-item label="数据源">
            <el-select v-model="config.insertupdate.dataSource" placeholder="请选择数据源">
              <el-option
                v-for="item in datasourceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标表">
            <el-input v-model="config.insertupdate.tableName" style="width: 28%;" />
            <el-button type="primary" @click="showTargetAllTables(2)">选择表</el-button>
          </el-form-item>
          <el-form-item label="表字段">
            <div class="field-table">
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width:75%"
                class="el-table__header"
              >
                <tr class="table-field-column">
                  <th>流字段</th>
                  <!-- <th>目标字段</th> -->
                </tr>
                <tr v-for="item2 in updateStream" :key="item2.value">
                  <td>
                    <el-select v-model="item2.value" size="mini" placeholder="请选择">
                      <el-option
                        v-for="item in streamOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </td>
                </tr>
              </table>
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width:75%"
                class="el-table__header"
              >
                <tr class="table-field-column">
                  <th>目标字段</th>
                </tr>
                <tr v-for="(item2) in updateLookUp" :key="item2.value">
                  <td>
                    <el-select v-model="item2.value" size="mini" placeholder="请选择">
                      <el-option
                        v-for="item in targetOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </td>
                </tr>
              </table>
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width:75%"
                class="el-table__header"
              >
                <tr class="table-field-column">
                  <th>更新</th>
                </tr>
                <tr v-for="(item2) in updateOptions" :key="item2.value">
                  <td>
                    <el-select v-model="item2.value" size="mini" placeholder="请选择">
                      <el-option
                        v-for="item in updateOptions2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </td>
                </tr>
              </table>
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width:75%"
                class="el-table__header"
              >
                <tr class="table-field-column">
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in fieldConditionOptions" :key="item.value">
                  <td>
                    <el-button size="mini" type="text" @click="removeCondition(index,1)">移除</el-button>
                  </td>
                </tr>
              </table>
            </div>
            <el-button type="success" @click="getTableField">获取字段</el-button>
          </el-form-item>
        </el-form>

        <!--数据清洗-->
        <el-form ref="form" :model="form" label-width="80px" v-show="active == 3">
          <el-form-item label="约束条件">
            <div class="field-table">
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width:75%"
                class="el-table__header"
              >
                <tr class="table-field-column">
                  <th>流字段</th>
                  <!-- <th>目标字段</th> -->
                </tr>
                <tr v-for="item2 in keyStream" :key="item2.value">
                  <td>
                    <el-select v-model="item2.value" size="mini" placeholder="请选择">
                      <el-option
                        v-for="item in streamOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </td>
                </tr>
              </table>
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width:75%"
                class="el-table__header"
              >
                <tr class="table-field-column">
                  <th>比较符</th>
                </tr>
                <tr v-for="(item2,index) in keyCondition" :key="index">
                  <td>
                    <el-select v-model="item2.value" placeholder="请选择" size="mini">
                      <el-option
                        v-for="item in conditionOperationOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </td>
                </tr>
              </table>
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width:75%"
                class="el-table__header"
              >
                <tr class="table-field-column">
                  <th>目标字段</th>
                </tr>
                <tr v-for="item2 in keyLookup" :key="item2.value">
                  <td>
                    <el-select v-model="item2.value" size="mini" placeholder="请选择">
                      <el-option
                        v-for="item in targetOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </td>
                </tr>
              </table>
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width:75%"
                class="el-table__header"
              >
                <tr class="table-field-column">
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in keyOperationCondition" :key="index">
                  <td>
                    <el-button size="mini" type="text" @click="removeCondition(index,2)">移除</el-button>
                  </td>
                </tr>
              </table>
            </div>
            <el-button type="success" @click="reloadConditionColumn">获取字段</el-button>
          </el-form-item>
        </el-form>

        <div class="footer">
          <el-button type="primary" v-if="active >= 2" @click="pre" icon="el-icon-arrow-left">上一步</el-button>
          <el-button type="primary" v-if="active <= 1" @click="preview">预览</el-button>
          <el-button type="primary" v-if="active < 3" @click="next">
            下一步
            <i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
          <el-button type="primary" v-if="active == 3" @click="onSubmit">创建</el-button>
        </div>
      </div>
    </div>

    <!--输入预览数量对话框-->
    <el-dialog title="请输入预览数据量" :visible.sync="previewDialogFormVisible" width="30%">
      <el-form :model="previewForm">
        <el-form-item label="预览数据量" :label-width="previeWFormLabelWidth">
          <el-input v-model="previewForm.num" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="previewDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmPreview">确 定</el-button>
      </div>
    </el-dialog>

    <!--显示预览结果对话框-->
    <el-dialog title="预览数据" :visible.sync="previewResultDialogFormVisible">
      <div
        class="el-table el-table--fit el-table--scrollable-x el-table--enable-row-hover el-table--medium"
      >
        <div class="el-table__body-wrapper is-scrolling-left">
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            class="el-table__header"
            style="width: 1640px;"
            v-if="previewGridData.length > 0"
          >
            <tr>
              <th v-for="column in Object.keys(previewGridData[0])" :key="column">{{column}}</th>
            </tr>
            <tr v-for="item in previewGridData" :key="item">
              <td v-for="value in Object.values(item)" :key="value">{{value}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="previewGridData.length == 0">
        <span class="table__empty-text">没有数据</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="previewResultDialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--显示所有表名-->
    <el-dialog title="数据库表预览" :visible.sync="tablesVisible" width="30%">
      <el-tree :data="treeTableData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-dialog>
    <el-dialog title="数据库表预览" :visible.sync="targetTablesVisible" width="30%">
      <el-tree :data="treeTableData" :props="defaultProps" @node-click="handleNodeClick2"></el-tree>
    </el-dialog>
  </div>
</template>
<script>
import {
  postRequest,
  postKeyValueRequest,
  deleteById,
  getRequest
} from "../../api/api";
import { getDictFieldValue } from "../../api/common.js";
const PREFIX_BASE = "/etl/master";
export default {
  name: "createTrans",
  data() {
    return {
      active: 0,
      datasourceOptions: [],
      updateOptions: [],
      updateOptions2: [
        { label: "Y", value: true },
        { label: "N", value: false }
      ],
      updateLookUp: [],
      updateStream: [],
      update: [],
      keyLookup: [],
      keyCondition: [],
      keyOperationCondition: [],
      conditionOperationOptions: [
        { label: "=", value: "=" },
        { label: "!=", value: "!=" },
        { label: ">=", value: ">=" },
        { label: "=<", value: "=<" }
      ],
      config: {
        type: "",
        name: "",
        tableinput: {
          dataSource: "",
          tableName: "",
          SQL: ""
        },
        insertupdate: {
          dataSource: "",
          tableName: "",
          keyLookup: [],
          keyStream: [],
          keyCondition: [],
          updateLookup: [],
          updateStream: [],
          update: []
        }
      },
      tablesVisible: false,
      targetTablesVisible: false,
      treeTableData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },

      streamOptions: [],
      targetOptions: [],
      fieldConditionOptions: [],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      modelData: [],
      tableFieldData: [{ name: "test" }],
      previewGridData: [],
      previewForm: {
        num: 1000
      },
      sourceShow: true,
      targetShow: false,
      dialogTableVisible: false,
      previewDialogFormVisible: false,
      previeWFormLabelWidth: "120px",
      previewResultDialogFormVisible: false
    };
  },
  created() {
    this.getDatasourceList();
    getDictFieldValue("taskModel").then(response => {
      this.modelData = response.data;
    });
  },
  methods: {
    /**
     * 获取数据源
     */
    getDatasourceList() {
      let param = {
        status: 1 //在线数据库
      };
      postRequest(PREFIX_BASE + "/datasource/list", param).then(response => {
        this.datasourceOptions = response.data;
      });
    },
    /**
     * 源所有表
     */
    showSourceAllTables(value) {
      if (this.config.tableinput.dataSource == "") {
        this.$message("请选择数据源");
        return;
      }
      let source = this.datasourceOptions.find(item => {
        return item.name == this.config.tableinput.dataSource;
      });
      this.showAllTables(value, source.id);
    },
    /**
     * 显示目标所有表
     */
    showTargetAllTables(value) {
      if (this.config.insertupdate.dataSource == "") {
        this.$message("请选择数据源");
        return;
      }
      let source = this.datasourceOptions.find(item => {
        return item.name == this.config.insertupdate.dataSource;
      });
      this.showAllTables(value, source.id);
    },
    /**
     * 显示所有表名
     */
    showAllTables(value, tdId) {
      getRequest(PREFIX_BASE + "/connect/tables/byId?id=" + tdId).then(
        response => {
          if (response.code == 0) {
            this.treeTableData = response.data;
            if (value == 1) {
              this.tablesVisible = true;
            } else if (value == 2) {
              this.targetTablesVisible = true;
            }
          }
        }
      );
    },
    /**
     * 获取字段
     */
    getTableField() {
      let source = this.datasourceOptions.find(item => {
        return item.name == this.config.tableinput.dataSource;
      });
      let targetSource = this.datasourceOptions.find(item => {
        return item.name == this.config.insertupdate.dataSource;
      });
      var params = {
        source: {
          id: source.id,
          tableName: this.config.tableinput.tableName
        },
        target: {
          id: targetSource.id,
          tableName: this.config.insertupdate.tableName
        }
      };
      postRequest(PREFIX_BASE + "/connect/getTableField", params).then(
        response => {
          this.streamOptions = response.data.streamOptions;
          this.targetOptions = response.data.targetOptions;
          //源表字段
          this.updateLookUp = [];
          //目标表字段
          this.updateStream = [];
          this.updateOptions = [];
          for (let item of this.streamOptions) {
            var obj = new Object();
            obj.value = item.value;
            this.updateStream.push(obj);
          }
          for (let item of this.targetOptions) {
            var obj = new Object();
            obj.value = item.value;
            this.updateLookUp.push(obj);
          }
          let len =
            this.streamOptions.length > this.targetOptions.length
              ? this.streamOptions.length
              : this.targetOptions.length;
          this.update = new Array(len).fill({});
          for (let i = 0; i < len; i++) {
            var obj = new Object();
            obj.value = true;
            this.updateOptions.push(obj);
          }
          this.compareFieldLength(1);
        }
      );
    },
    compareFieldLength(type) {
      let len = this.streamOptions.length - this.targetOptions.length;
      //添加空白行
      if (type == 1) {
        for (let i = 0; i < Math.abs(len); i++) {
          if (len > 0) {
            this.updateLookUp.push({});
          } else {
            this.updateStream.push({});
          }
        }
        this.fieldConditionOptions = new Array(this.streamOptions.length).fill(
          {}
        );
      } else if (type == 2) {
        for (let i = 0; i < Math.abs(len); i++) {
          if (len > 0) {
            this.keyLookup.push({});
          } else {
            this.keyStream.push({});
          }
        }
      }
      // this.config.insertupdate.update = new Array(size).fill({});
    },
    /**
     * 重新刷新约束条件
     */
    reloadConditionColumn() {
      this.keyLookup = [];
      this.keyStream = [];
      this.keyCondition = [];
      this.keyOperationCondition = [];
      for (let item of this.streamOptions) {
        var obj = new Object();
        obj.value = item.value;
        this.keyStream.push(obj);
      }
      for (let item of this.targetOptions) {
        var obj = new Object();
        obj.value = item.value;
        this.keyLookup.push(obj);
      }
      let size =
        this.streamOptions.length > this.targetOptions.length
          ? this.streamOptions.length
          : this.targetOptions.length;
      this.keyOperationCondition = new Array(size).fill();
      // this.keyCondition = new Array(size).fill({value:""});
      for (let i = 0; i < size; i++) {
        var obj = new Object();
        obj.value = "";
        this.keyCondition.push(obj);
      }
      this.compareFieldLength(2);
    },
    handleNodeClick(data) {
      if (data.children == undefined) {
        this.config.tableinput.tableName = data.name;
        this.config.tableinput.SQL = "select * from " + data.name;
        this.tablesVisible = false;
      }
    },
    handleNodeClick2(data) {
      if (data.children == undefined) {
        this.config.insertupdate.tableName = data.name;
        this.targetTablesVisible = false;
      }
    },
    pre() {
      if (this.active-- < 0) this.active = 0;

      if (this.active == 1) {
        this.sourceShow = true;
      } else {
        this.sourceShow = false;
      }
    },
    next() {
      if (this.active <= 0) {
        this.$message("请选择模板");
        return;
      }
      if (this.active++ > 3) this.active = 0;
      this.sourceShow = false;
      // this.targetShow = true;
    },
    /**
     * 选择模板
     */
    chooseModel(value) {
      this.config.type = value;
      this.active = 1;
    },
    /**
     * 显示输入预览数量对话框
     */
    preview() {
      this.previewDialogFormVisible = true;
    },
    /**
     * 显示预览结果
     */
    confirmPreview() {
      this.previewDialogFormVisible = false;
      if (this.config.tableinput.datasource == "") {
        this.$message("请选择数据源");
        return;
      }
      if (this.config.tableinput.SQL == "") {
        this.$message("请输入SQL");
        return;
      }
      let source = this.datasourceOptions.find(item => {
        return item.name == this.config.tableinput.dataSource;
      });
      let param = {
        datasourceId: source.id,
        sql: this.config.tableinput.SQL,
        size: this.previewForm.num
      };
      postKeyValueRequest(PREFIX_BASE + "/connect/preview", param).then(
        response => {
          if (response.code == 0) {
            this.previewGridData = response.data;
            //显示预览结果对话框
            this.previewResultDialogFormVisible = true;
          }
        }
      );
    },
    /**
     * 异常约束条件
     */
    removeCondition(index, type) {
      if (type == 1) {
        this.updateLookUp.splice(index, 1);
        this.updateStream.splice(index, 1);
        this.updateOptions.splice(index, 1);
        this.fieldConditionOptions.splice(index, 1);
      } else if (type == 2) {
        this.keyLookup.splice(index, 1);
        this.keyStream.splice(index, 1);
        this.keyCondition.splice(index, 1);
        this.keyOperationCondition.splice(index,1);
      }
    },
    resetConfigData() {
      //清空
      this.config.insertupdate.updateLookup = [];
      this.config.insertupdate.updateStream = [];
      this.config.insertupdate.update = [];
      this.config.insertupdate.keyCondition = [];
      for (let item of this.updateLookUp) {
        if (item.value != undefined) {
          this.config.insertupdate.updateLookup.push(item.value);
        }
      }
      for (let item of this.updateStream) {
        if (item.value != undefined) {
          this.config.insertupdate.updateStream.push(item.value);
        }
      }
      for (let item of this.updateOptions) {
        if (item.value != undefined) {
          this.config.insertupdate.update.push(item.value);
        }
      }
      for (let item of this.keyLookup) {
        if (item.value != undefined) {
          this.config.insertupdate.keyLookup.push(item.value);
        }
      }
      for (let item of this.keyStream) {
        if (item.value != undefined) {
          this.config.insertupdate.keyStream.push(item.value);
        }
      }
      for (let item of this.keyCondition) {
        if (item.value != undefined) {
          this.config.insertupdate.keyCondition.push(item.value);
        }
      }
    },
    onSubmit() {
      this.resetConfigData();
      postRequest(PREFIX_BASE + "/trans/save/trans", this.config).then(
        response => {
          if (response.code == 0) {
            this.$router.push({ path: "/trans/list" });
          } else {
            this.$message.error("提交失败");
          }
        }
      );
    }
  }
};
</script>
<style scoped>
.trans-container {
  height: 100%;
  width: 100%;
}
.trans-title {
  text-align: center;
  height: 45px;
  line-height: 35px;
}
.trans-title-content {
  font-size: 28px;
}
.trans-step {
  width: 98%;
  margin: 0 auto;
  margin-top: 5px;
  margin-left: 10%;
}
.trans-template {
  display: flex;
  flex-direction: row;
}
.trans-template-left {
  width: 25%;
}
.trans-template-right {
  width: 75%;
}

.model-li {
  font-size: 14px;
  padding: 18px 0;
}

li:hover {
  color: #67c23a;
}

.box-card {
  width: 270px;
}
.template-sql {
  height: 200px;
}
.table-btn {
  margin-right: 5px;
}
.footer {
  margin-left: 40%;
  margin-bottom: 0;
}
table tr td,
th {
  border: 1px solid #000;
  width: 130px;
  text-align: center;
  height: 30px;
}
table {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
}
.table__empty-text {
  text-align: center;
  display: block;
  position: relative;
  top: 50%;
}
.table-field-column {
  color: #909399;
  font-size: 18px;
}
.table-field-column th {
  border: 1px solid #000;
  width: 130px;
  text-align: center;
  font-size: 14px;
}
.field-table {
  display: flex;
  flex-direction: row;
}
.modelFontColor {
  color: #67c23a;
}
</style>