<template>
  <section>
      <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

    <!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55"/>
			<el-table-column type="index" width="60" label="序号"/>
			<el-table-column prop="username" label="用户名" width="150" sortable/>
      <el-table-column prop="realName" label="真实姓名" width="150" sortable/>
      <el-table-column prop="nickName" label="昵称" width="250" sortable/>
      <el-table-column prop="phone" label="手机号码" width="150" sortable/>
			<el-table-column prop="email" label="电子邮箱" width="150" sortable/>
      <el-table-column prop="status" label="状态" width="150" :formatter="formatStatus" sortable/>
			<el-table-column label="操作" width="150">
				 <template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

    <!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
  </section>  
</template>

<script>
  export default {
     data() {
       return {
            filters: {
              name: ''
            },
            users: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列
            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            editFormRules: {
              name: [
                { required: true, message: '请输入姓名', trigger: 'blur' }
              ]
            },
            //编辑界面数据
            editForm: {
              id: 0,
              name: '',
              sex: -1,
              age: 0,
              birth: '',
              addr: ''
            },

            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            addFormRules: {
              name: [
                { required: true, message: '请输入姓名', trigger: 'blur' }
              ]
            },
            //新增界面数据
            addForm: {
              name: '',
              sex: -1,
              age: 0,
              birth: '',
              addr: ''
            }
       }
     },
     methods:{
       //状态显示转换
			formatStatus: function (row, column) {
         let status = '';
         switch(row.status){
            case 0: status = '删除';
            case 1: status = '正常';
            case 2: status = '锁定';
         }
				return status;
			},
       getUsers(){
         alert(11);
       },
       //显示新增界面
			handleAdd: function () {
        alert(11);
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
        };
        alert(234);
      },
      selsChange: function (sels) {
				this.sels = sels;
      }
      
     }
  }
</script>

<style>

</style>


