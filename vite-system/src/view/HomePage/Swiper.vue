<template>
  <div class="swiper">
    <div class="oper">
      <el-button type="primary" @click="add"
        ><i class="iconfont icon-tianjia"></i>添加</el-button
      >
      <el-popconfirm title="确定要删除吗?" @confirm="confirmDelete()">
        <template #reference>
          <el-button type="danger"
            ><i class="iconfont icon-tianjia"></i>批量删除</el-button
          >
        </template>
      </el-popconfirm>
    </div>
    <div class="content">
      <el-table
        ref="multipleTableRef"
        :data="state.tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :cell-style="{ padding: '10px 0px' }"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="轮播图" width="300" prop="carouselUrl">
          <template #default="scope"
            ><img :src="scope.row.carouselUrl" class="carouselImg"
          /></template>
        </el-table-column>
        <el-table-column property="redirectUrl" label="跳转链接" />
        <el-table-column property="carouselRank" label="排序值" width="120" />
        <el-table-column property="createTime" label="添加时间" width="120" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link @click="update(scope.row)">修改</el-button>
            <el-popconfirm title="确定要删除吗?" @confirm="confirmDelete()">
              <template #reference>
                <el-button link @click="deleted(scope.row)">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="state.totalPage * 10"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <el-dialog
      v-model="state.dialogFormVisible"
      :title="state.isAdd ? '添加轮播图' : '修改轮播图'"
      width="400px"
      @close="closeDialog"
    >
      <el-form
        ref="ruleFormRef"
        :model="state.form"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="default"
        status-icon
      >
        <el-form-item label="图片" prop="carouselUrl">
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
            <img
              v-if="state.form.carouselUrl"
              :src="state.form.carouselUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"
              ><i class="iconfont icon-tianjia" style="font-size: 28px"></i
            ></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="redirectUrl">
          <el-input v-model="state.form.redirectUrl" size="large" />
        </el-form-item>

        <el-form-item label="排序值" prop="carouselRank">
          <el-input
            v-model="state.form.carouselRank"
            size="large"
            type="number"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref } from "vue";
import {
  carousels,
  deleteCarousels,
  addCarousels,
  updateCarousels,
} from "../../api/homePage.js";
import upload from "../../components/upload.vue";
import { ElMessage } from "element-plus";

const state = reactive({
  totalPage: 0,
  tableData: [],
  params: {
    pageSize: 10,
    pageNumber: 1,
  },
  dialogFormVisible: false,
  form: {
    carouselUrl: "",
    redirectUrl: "",
    carouselRank: "",
  },
  ids: [],
  token: localStorage.getItem("token"),
});
const rules = reactive({
  carouselUrl: [{ required: true, message: "请选择图片", trigger: "blur" }],
  carouselRank: [{ required: true, message: "请填入排序值", trigger: "blur" }],
});
const getCarousels = async () => {
  const { data } = await carousels(state.params);
  state.tableData = data.list;
  state.totalPage = data.totalPage;
};
onMounted(() => {
  getCarousels();
});

//分页
const sizeChange = (val) => {
  console.log(val);
};
const currentChange = (val) => {
  state.params.pageNumber = val;
  getCarousels();
};
//轮播图的删除
const handleSelectionChange = (val) => {
  state.ids = [];
  val.map((item) => {
    state.ids.push(item.carouselId);
  });
};
const confirmDelete = async () => {
  const res = await deleteCarousels({ ids: state.ids });
};
const deleted = (value) => {
  state.ids = [];
  state.ids.push(value.carouselId);
};
//轮播图的增加和删除
const isAdd = ref(false);
const add = () => {
  isAdd.value = true;
  state.dialogFormVisible = true;
};
const update = (value) => {
  isAdd.value = false;
  state.dialogFormVisible = true;
  state.form.carouselUrl = value.carouselUrl;
  state.form.redirectUrl = value.redirectUrl;
  state.form.carouselRank = value.carouselRank;
  state.form.carouselId = value.carouselId;
};
//弹窗
const confirm = async () => {
  state.dialogFormVisible = false;
  if (isAdd.value) {
    const res = await addCarousels(state.form);
    ElMessage.success("添加成功");
  } else {
    const res = await updateCarousels(state.form);
    ElMessage.success("修改成功");
  }
  getCarousels();
  //清除
  clear();
};
const clear = () => {
  state.form = {
    carouselUrl: "",
    redirectUrl: "",
    carouselRank: "",
  };
};
const cancel = () => {
  state.dialogFormVisible = false;
  clear();
};
const closeDialog = () => {
  clear();
};
//上传图片
const handleBeforeUpload = (file) => {
  const sufix = file.name.split(".")[1] || "";
  if (!["jpg", "jpeg", "png"].includes(sufix)) {
    ElMessage.error("请上传 jpg、jpeg、png 格式的图片");
    return false;
  }
};
const handleAvatarSuccess = (val) => {
  //后端返回的图片路径
  state.form.carouselUrl = val.data || "";
};
</script>
<style lang="scss" scoped>
.swiper {
  overflow: hidden;
  .oper {
    text-align: left;
    padding: 20px;
    border-bottom: 1px solid #e9e9e9;
    .el-button {
      font-size: 12px !important;
      i {
        padding-right: 5px;
      }
    }
  }
  .content {
    padding: 30px 30px;
    .el-button {
      //   border: 0px;
      color: rgb(34, 165, 241);
    }
    .carouselImg {
      width: 150px;
      height: auto;
    }
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>
<style>
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px solid var(--el-border-color) !important;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
