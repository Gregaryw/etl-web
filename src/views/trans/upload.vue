<template>
  <div class="trans-container">
    <div>
      <el-row style="margin-top: 20px;">
        <el-col :span="12" :offset="4">
          <el-form
            :model="formData"
            :rules="rules"
            ref="formData"
            label-width="110px"
            class="demo-formData"
          >
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>

            <el-form-item label="上传转换">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                limit="1"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </el-form-item>
            <el-form-item class="button_submit">
              <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        name: ""
      },
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>
<style scoped>
.trans-container {
  height: 100%;
  width: 100%;
}
</style>