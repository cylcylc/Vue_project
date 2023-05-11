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
        <el-table-column label="商品名称" prop="configName"> </el-table-column>
        <el-table-column property="redirectUrl" label="跳转链接" />
        <el-table-column property="configRank" label="排序值" width="200" />
        <el-table-column property="goodsId" label="商品编号" width="200" />
        <el-table-column property="createTime" label="添加时间" width="200" />
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
      :title="isAdd ? '添加商品' : '修改商品'"
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
        <el-form-item label="商品名称" prop="configName">
          <el-input v-model="state.form.configName" size="large" />
        </el-form-item>
        <el-form-item label="跳转链接" prop="redirectUrl">
          <el-input v-model="state.form.redirectUrl" size="large" />
        </el-form-item>
        <el-form-item label="商品编号" prop="goodsId">
          <el-input v-model="state.form.goodsId" size="large" type="number" />
        </el-form-item>
        <el-form-item label="排序值" prop="configRank">
          <el-input
            v-model="state.form.configRank"
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
  hotConfigs,
  addConfig,
  updateConfig,
  deleteConfig,
} from "../../api/homePage.js";
import { ElMessage } from "element-plus";
const state = reactive({
  totalPage: 0,
  tableData: [],
  params: {
    pageSize: 10,
    pageNumber: 1,
    configType: 3,
  },
  dialogFormVisible: false,
  form: {
    configName: "",
    redirectUrl: "",
    goodsId: "",
    configRank: "",
    configType: 3,
  },
  updateForm: {},
  deleteId: [],
});
const getMessage = async () => {
  const { data } = await hotConfigs(state.params);
  state.tableData = data.list;
  state.totalPage = data.totalPage;
};
onMounted(() => {
  getMessage();
});
const handleSelectionChange = (val) => {
  state.deleteId = [];
  val.map((item) => {
    state.deleteId.push(item.configId);
  });
};
//分页
const sizeChange = (val) => {};
const currentChange = (val) => {
  state.params.pageNumber = val;
  getMessage();
};
//添加，修改商品
const isAdd = ref(true);
const rules = reactive({
  configName: [{ required: true, message: "请填入商品名称", trigger: "blur" }],
  goodsId: [{ required: true, message: "请填入商品编号", trigger: "blur" }],
  configRank: [{ required: true, message: "请填入排序值", trigger: "blur" }],
});
const ruleFormRef = ref(null);
const add = () => {
  state.dialogFormVisible = true;
  isAdd.value = true;
  //清空数据
  state.form = {
    configName: "",
    redirectUrl: "",
    goodsId: "",
    configRank: "",
    configType: 3,
  };
};
//修改
const update = (value) => {
  isAdd.value = false;
  state.dialogFormVisible = true;
  state.form.configName = value.configName;
  state.form.redirectUrl = value.redirectUrl;
  state.form.goodsId = value.goodsId;
  state.form.configRank = value.configRank;
  //两个对象直接赋值，updateForm会跟着form一起变化
  state.updateForm = state.form;
  state.updateForm.configId = value.configId;
};
const deleted = (value) => {
  state.deleteId = [];
  state.deleteId.push(value.configId);
};
const confirm = () => {
  state.dialogFormVisible = false;
  console.log(ruleFormRef.value);
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (isAdd.value) {
        const res = await addConfig(state.form);
        ElMessage.success("添加成功");
      } else {
        const res = await updateConfig(state.updateForm);
        ElMessage.success("修改成功");
      }
    } else {
      console.log(fields);
    }
    getMessage();
  });
  //清空数据
  clear();
};
const clear = () => {
  state.form = {
    configName: "",
    redirectUrl: "",
    goodsId: "",
    configRank: "",
    configType: 3,
  };
};
const cancel = () => {
  state.dialogFormVisible = false;
  //清空数据
  clear();
};
const closeDialog = () => {
  clear();
};
//删除商品
const confirmDelete = async () => {
  const res = await deleteConfig({ ids: state.deleteId });
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
