<template>
  <el-container>
    <!-- <el-steps :active="active" align-center>
      <el-step title="选择源表" description="选择源加载表字段，支持单表或多表"></el-step>
      <el-step title="目标" description></el-step>
    </el-steps>-->

    <div class="dynamic-table-title">
      <span class="dynamic-table-title-content">{{title}}</span>
    </div>

    <!--源-->
    <div class="content" v-show="active == 0">
      <div class="left">
        <el-button @click="getCheckedNodes" type="primary" size="mini">加载选中的表字段</el-button>
        <el-tree :props="props" :load="loadNode" ref="tree" lazy node-key="dbId" show-checkbox></el-tree>
      </div>
      <div class="right">
        <div v-for="(item,index) in tableColumnData" :key="index">
          <span>表：{{item[index].tableName}}</span>
          <el-table
            ref="multipleTable"
            :data="item"
            tooltip-effect="dark"
            :border="true"
            style="width: 100%"
            @selection-change="handleSelectionChange(index)"
          >
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="tdColumnName" label="名称" width="200" align="center"></el-table-column>
            <el-table-column prop="typeName" label="类型" width="200" align="center"></el-table-column>
            <el-table-column prop="columnSize" label="大小" width="200" align="center"></el-table-column>
          </el-table>
          <br />
        </div>
      </div>
    </div>
    <!--目标-->
    <div class="target-content" v-show="active == 1">
      <div>
        <el-form
          :model="dynamicTable"
          :rules="rules"
          ref="dynamicTable"
          label-width="100px"
          class="target-table-form"
        >
          <el-form-item label="目标数据库" prop="dbId">
            <el-select v-model="dynamicTable.dbId" placeholder="请选择目标数据库">
              <el-option
                v-for="(item,index) in databases"
                :key="index"
                :label="item.name"
                :value="item.dbId"
              ></el-option>
            </el-select>
          </el-form-item>

          <div v-for="(item,index) in dynamicTable.tableNameList" :key="index">
            <el-form-item label="表名">
              <el-input v-model="dynamicTable.tableNameList[index]" style="width: 23%;"></el-input>
            </el-form-item>

            <el-form-item>
              <el-table
                :data="dynamicTable.tableAttrList[index]"
                style="width: 100%"
                max-height="250"
              >
                <el-table-column prop="tdColumnName" align="center" label="名称"></el-table-column>
                <el-table-column prop="typeName" align="center" label="源字段类型"></el-table-column>
                <el-table-column align="center" label="更改">
                  <template slot-scope="scope">
                    <el-select v-model="updateTypeName" placeholder="请选择">
                      <el-option
                        v-for="(item,index) in fieldAttOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="columnSize" align="center" label="大小"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index,dynamicTable.tableAttrList[index])"
                      type="text"
                      size="small"
                    >移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <el-footer>
      <el-button type="primary" v-show="active > 0" @click="up">上一步</el-button>
      <el-button type="primary" v-show="active < 1" @click="next">下一步</el-button>
      <el-button type="primary" v-show="active == 1" @click="submitForm('dynamicTable')">立即创建</el-button>
    </el-footer>
  </el-container>
</template>
<script>
import { postRequest, postKeyValueRequest, getRequest } from "../../../api/api";
import { getDictFieldValue } from "../../../api/common.js";
const PREFIX_BASE = "/etl/master";
export default {
  name: "dynamicTable",
  data() {
    return {
      active: 0,
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      count: 1,
      title: "选择源库",
      databases: [],
      tableColumnData: [],
      multipleSelection: [],
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      dynamicTable: {
        dbId: "",
        tableNameList: [],
        tableAttrList: []
      },
      fieldAttOptions: [],
      rules: {
        dbId: [{ required: true, message: "请选择目的源", trigger: "change" }],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      }
    };
  },
  watch: {
    active(value) {
      if (value == 0) {
        this.title = "选择源库";
      } else if (value == 1) {
        this.title = "选择目标库";
      }
    }
  },
  created() {},
  methods: {
    up() {
      this.active > 0 ? this.active-- : 0;
    },
    next() {
      if (this.dynamicTable.tableAttrList.length == 0) {
        this.$message.info("请选择表和获取表字段");
        return;
      }
      if (this.active < 1) {
        this.active++;
      }
    },
    //懒加载获取节点数据
    loadNode(node, resolve) {
      //获取第一级节点数据
      if (node.level === 0) {
        getRequest(PREFIX_BASE + "/connect/databases").then(res => {
          if (res.code == 0) {
            this.databases = res.data;
            resolve(res.data);
          } else {
            this.$message.error("失败");
          }
        });
      }
      if (node.level > 3) return resolve([]);

      //获取第二级数据
      if (node.level == 1) {
        let data = [
          {
            dbId: node.data.dbId,
            name: "表",
            type: 0,
            leaf: false
          },
          {
            dbId: node.data.dbId,
            name: "视图",
            type: 1,
            leaf: false
          }
        ];
        resolve(data);
      }

      //获取第三级数据
      if (node.level == 2) {
        let uri = node.data.type == 1 ? "view" : "tables";
        getRequest(
          PREFIX_BASE + "/connect/" + uri + "?id=" + node.data.dbId
        ).then(res => {
          if (res.code == 0) {
            if (res.data.length > 0) {
              resolve(res.data);
            } else {
              resolve([{ dbId: "", name: "", leaf: true }]);
            }
          } else {
            this.$message.error("失败");
          }
        });
      }
    },
    /**
     * 获取表字段
     */
    getTableField(params) {
      postRequest(PREFIX_BASE + "/connect/table/columns", params).then(res => {
        if (res.code == 0) {
          this.tableColumnData = [];
          let data = res.data;
          let newData = data.map(function(value,index,array) {
            return value.map(function(value,index,array) {
               return {
                columnSize: value.columnSize,
                ordinalPosition: value.ordinalPosition,
                tableName: value.tableName,
                tdColumnName: value.tdColumnName,
                typeName: value.typeName,
                updateTypeName: value.updateTypeName
              };
            });
          });
          this.tableColumnData = newData;
          this.dynamicTable.tableAttrList = res.data;
          //this.dynamicTable.tableNameList = value.name;
          this.$message.info("成功");
        } else {
          this.$message.error("失败");
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    /**
     * 处理选择行
     */
    handleSelectionChange(index) {
      if (this.$refs.multipleTable[index].selection.length > 0) {
        console.log("selection:", this.$refs.multipleTable[index].selection);
        let selectionData = [];
        this.$refs.multipleTable[index].selection.forEach(sel => {
          selectionData.push({
            tableName: sel.tableName,
            tdColumnName: sel.tdColumnName,
            typeName: sel.typeName,
            columnSize: sel.columnSize,
            ordinalPosition: sel.ordinalPosition,
            updateTypeName: sel.updateTypeName
          });
        });
        this.dynamicTable.tableAttrList[index] = selectionData;
      }
    },
    deleteRow(index, row) {
      debugger;
      row.splice(index, 1);
    },
    getCheckedNodes() {
      let params = [];
      this.dynamicTable.tableNameList = [];
      let checkNodeData = this.$refs.tree.getCheckedNodes();
      checkNodeData.forEach(node => {
        this.dynamicTable.tableNameList.push(node.name);
        params.push({ dbId: node.dbId, tableName: node.name });
      });
      if (params.length > 0) {
        this.getTableField(params);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          postRequest(
            PREFIX_BASE + "/connect/create/tables",
            this.dynamicTable
          ).then(res => {
            if (res.code == 0) {
              this.$message.info("提交成功");
            } else {
              this.$message.error("失败");
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.content {
  display: flex;
  flex-direction: row;
}
.content .right {
  margin-left: 3%;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 15px;
}
/* .target-content {
  text-align: center;
  margin: 0px auto;
} */
.dynamic-table-title {
  text-align: center;
  height: 45px;
  line-height: 35px;
}
.dynamic-table-title-content {
  font-size: 28px;
}
.el-footer {
  text-align: center;
  line-height: 60px;
  height: 60px;
  position: fixed;
  bottom: 5px;
  width: 100%;
  z-index: 9999;
}
</style>