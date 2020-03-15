<template>
  <div class="container">
    <el-aside width="200px">
      <div class="block">
        <div class="directory-div">
          <div>
            <p class="title">资源目录</p>
          </div>
        </div>
        <el-tree
          :data="treeData"
          node-key="id"
          default-expand-all
          @node-click="handleNodeClick"
          :render-content="renderContent"
        ></el-tree>
      </div>
    </el-aside>
    <el-container>
      <el-main>
        <el-table :data="tableData" border style="width:900px;">
          <el-table-column prop="name" label="名称" align="center"></el-table-column>
          <el-table-column prop="way" label="添加方式" :formatter="formatWayStatus" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" :formatter="formatStatus" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.status == 0"
                @click="showTransDirectory(scope.row.id)"
                type="text"
                size="small"
              >创建</el-button>
              <el-button @click="edit(scope.row.id)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteRow(scope.row.id)" type="text" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </el-main>
    </el-container>

    <!--添加目录-->
    <el-dialog title="添加目录" :visible.sync="dialogFormVisible" width="20%">
      <el-form :model="directoryModel">
        <el-form-item label="名称">
          <el-input v-model="directoryModel.label" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDirectory()">确 定</el-button>
      </div>
    </el-dialog>

    <!--选择目录-->
    <el-dialog title="请选择目录" :visible.sync="dialogVisible" width="30%">
      <el-tree
        :data="directoryTreeData"
        node-key="id"
        default-expand-all
        @node-click="handleNodeClick2"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="buildTrans">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  postRequest,
  deleteById,
  getRequest,
  postKeyValueRequest
} from "../../api/api";
const PREFIX_BASE = "/etl/master";
export default {
  name: "tranList",
  components: { Pagination },
  data() {
    return {
      treeData: [],
      directoryTreeData: [],
      trans: {
        id: "",
        directory: ""
      },
      dialogVisible: false,
      dialogFormVisible: false,
      directoryModel: {
        id: "",
        label: ""
      },
      tableData: [],
      total: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    };
  },
  created() {
    this.getDirectoryTree("", 1);
    this.getList();
  },
  methods: {
    //添加方式
    formatWayStatus: function(row, column) {
      let status = "";
      switch (row.status) {
        case 0:
          status = "添加";
          break;
        case 1:
          status = "上传";
          break;
      }
      return status;
    },
    //状态
    formatStatus: function(row, column) {
      let status = "";
      switch (row.status) {
        case 0:
          status = "未创建";
          break;
        case 1:
          status = "已创建";
          break;
      }
      return status;
    },
    /**
     * 获取目录列表数据
     */
    getDirectoryTree(id, type) {
      if (type == 1) {
        getRequest(PREFIX_BASE + "/r/directory/tree", id).then(response => {
          this.treeData = response.data;
        });
      } else {
        getRequest(PREFIX_BASE + "/r/directory/tree", id).then(response => {
          this.directoryTreeData = response.data;
        });
      }
    },
    /**
     * 编辑
     */
    edit(id) {
      this.$router.push({ path: "/trans/create", query: { id: id } });
    },
    /**
     * 获取列表数据
     */
    getList() {
      this.listLoading = true;
      let param = {
        current: this.listQuery.page,
        size: this.listQuery.limit,
        directory: this.trans.directory
      };
      postRequest(PREFIX_BASE + "/trans/data", param).then(response => {
        if (response.code == 0) {
          let result = response.data;
          this.tableData = result.data.records;
          this.total = result.data.total;
        }
        this.trans.directory = "";
        this.listLoading = false;
      });
    },
    /**
     * 构建转换
     */
    showTransDirectory(id) {
      this.dialogVisible = true;
      this.trans.id = id;
      this.getDirectoryTree(0, 2);
    },
    buildTrans() {
      postRequest(PREFIX_BASE + "/trans/create", this.trans).then(response => {
        if (response != undefined && response.code == 0) {
          this.trans.id = "";
          this.trans.directory = "";
          this.dialogVisible = false;
          this.getList();
          //跳转到任务列表
          this.$router.push({path:'/task/list'});
        } else {
          this.$message.error("失败");
        }
      });
    },
    /**
     * 删除
     */
    deleteRow(id) {
      deleteById(PREFIX_BASE + "/trans/delete/primary/" + id).then(response => {
        if (response.code == 0) {
          this.getList();
        } else {
          Message.error({ message: "删除失败" });
        }
      });
    },
    /**
     * 添加目录
     */
    addDirectory(data) {
      this.directoryModel.id = data.id;
      this.dialogFormVisible = true;
    },
    /**
     * 点击树节点
     */
    handleNodeClick(data) {
      this.getDirectoryTree(data.id, 1);
    },
    handleNodeClick2(data) {
      this.trans.directory = data.id;
    },
    /**
     * 提交添加目录
     */
    submitDirectory() {
      postRequest(PREFIX_BASE + "/r/directory/add", this.directoryModel).then(
        response => {
          if (response.code == 0) {
            this.directoryModel.id = "";
            this.directoryModel.label = "";
            this.getDirectoryTree(0, 1);
          }
        }
      );
      this.dialogFormVisible = false;
    },
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    /**
     * 删除目录
     */
    remove(node, data) {
      getRequest(PREFIX_BASE + "/r/directory/remove", data.id).then(
        response => {
          if (response.code == 0) {
            this.getDirectoryTree(0, 1);
          } else {
            Message.error({ message: "删除失败" });
          }
        }
      );
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span style="margin-left:35px;">
            <el-button
              size="mini"
              type="text"
              on-click={() => this.addDirectory(data)}
            >
              添加
            </el-button>
            <el-button
              v-show={data.id != 0}
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              删除
            </el-button>
          </span>
        </span>
      );
    }
  }
};
</script>
<style scoped>
.container {
  display: inline-flex;
}

.directory-div {
  display: flex;
  flex-direction: row;
}
.title {
  margin-top: 5px;
  font-size: 14px;
}
.tool {
  margin-left: 5%;
}
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
/* .base-container {
  display: flex;
  flex-direction: row;
} */
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>