<template>
  <div class="category">
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
        <el-table-column label="分类名称" prop="categoryName">
        </el-table-column>
        <el-table-column property="categoryRank" label="排序值" />
        <el-table-column property="createTime" label="添加时间" width="200" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link @click="update(scope.row)">修改</el-button>
            <el-button link @click="nextLevel(scope.row)">下级分类</el-button>
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
      :title="isAdd ? '添加分类' : '修改分类'"
      width="400px"
      destroy-on-close="true"
      v-if="state.dialogFormVisible"
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
        <el-form-item label="商品名称" prop="categoryName">
          <el-input v-model="state.form.categoryName" size="large" />
        </el-form-item>
        <el-form-item label="排序值" prop="categoryRank">
          <el-input v-model="state.form.categoryRank" size="large" />
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
import { reactive, ref, onMounted, onUnmounted, watchEffect, watch } from "vue";
import {
  categories,
  deleteCategories,
  addCategories,
  updateCategories,
} from "../../api/mode.js";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
const state = reactive({
  tableData: [],
  params: {
    pageNumber: 1,
    pageSize: 10,
    categoryLevel: 1,
    parentId: 0,
  },
  ids: [],
  form: {
    categoryName: "",
    categoryRank: "",
    categoryLevel: 1,
    parentId: 0,
  },
  dialogFormVisible: false,
  totalPage: 0,
});
const rules = reactive({
  categoryName: [
    { required: true, message: "请填入分类名称", trigger: "blur" },
  ],
  categoryRank: [{ required: true, message: "请填入排序值", trigger: "blur" }],
});
const getCategories = async () => {
  const {
    data: { list },
    data,
  } = await categories(state.params);
  state.tableData = list;
  state.totalPage = data.totalPage;
};
onMounted(() => {
  getCategories();
});
//分类的增加，修改
const isAdd = ref(false);
const add = () => {
  state.dialogFormVisible = true;
  isAdd.value = true;
};
const update = (row) => {
  state.dialogFormVisible = true;
  state.form.categoryId = row.categoryId;
  state.form.categoryName = row.categoryName;
  state.form.categoryRank = row.categoryRank;
};
const ruleFormRef = ref(null);
const confirm = () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      state.dialogFormVisible = false;
      state.form.categoryLevel = state.params.categoryLevel;
      state.form.parentId = state.params.parentId;
      if (isAdd.value) {
        const res = await addCategories(state.form);
        ElMessage.success("添加成功");
      } else {
        const res = await updateCategories(state.form);
        ElMessage.success("修改成功");
      }
      getCategories();
      clear();
    }
  });
};
//
const clear = () => {
  state.form = {
    categoryName: "",
    categoryRank: "",
    categoryLevel: state.form.categoryLevel,
    parentId: state.form.parentId,
  };
};
const cancel = () => {
  state.dialogFormVisible = false;
  clear();
};
const closeDialog = () => {
  clear();
};
//分类的删除
const deleted = async (row) => {
  state.ids = [];
  state.ids.push(row.categoryId);
};
//多选
const handleSelectionChange = (val) => {
  state.ids = [];
  val.map((item) => {
    state.ids.push(item.configId);
  });
};
const confirmDelete = async () => {
  const res = await deleteCategories({ ids: state.ids });
};
//分页
const sizeChange = (val) => {
  state.params.pageSize = val;
  getCategories();
};
const currentChange = (val) => {
  state.params.pageNumber = val;
  getCategories();
};
//下级分类
const router = useRouter();
const nextLevel = (row) => {
  if (state.params.categoryLevel >= 3) {
    ElMessage.error("没有下一级了");
    return;
  } else {
    state.params.categoryLevel++;
  }
  router.push({
    path: `/category/level${state.params.categoryLevel}`,
    query: {
      level: state.params.categoryLevel,
      parent_Id: row.categoryId,
    },
  });
  state.params.parentId = row.categoryId;
};
const route = useRoute();
watchEffect(() => {
  //保证返回的时候内容保持一致
  if (route.fullPath.includes("category")) {
    state.params.categoryLevel =
      typeof route.query.level === "string" ? route.query.level : 1;
    state.params.parentId =
      typeof route.query.parent_Id === "string" ? route.query.parent_Id : 0;
    getCategories();
  }
});
</script>
<style lang="scss" scoped>
.category {
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
.el-button {
  font-size: 12px !important;
  i {
    padding-right: 5px;
  }
}
</style>
