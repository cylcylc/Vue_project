<template>
  <div class="upload">
    <el-upload
      class="avatar-uploader"
      action="http://backend-api-02.newbee.ltd/manage-api/v1/upload/file"
      :headers="{
        token: state.token,
      }"
      accept="jpg,jpeg,png"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="handleBeforeUpload"
    >
      <img v-if="state.ruleForm.url" :src="state.ruleForm.url" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>
<script setup>
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
const state = reactive({
  token: localStorage.getItem("token"),
  ruleForm: {
    url: "",
  },
});
const handleBeforeUpload = (file) => {
  const sufix = file.name.split(".")[1] || "";
  if (!["jpg", "jpeg", "png"].includes(sufix)) {
    ElMessage.error("请上传 jpg、jpeg、png 格式的图片");
    return false;
  }
};
// 上传图片
const handleAvatarSuccess = (val) => {
  state.ruleForm.url = val.data || "";
};
</script>

<style scoped>
.upload {
  width: 178px;
  height: 178px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
