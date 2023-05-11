<template>
  <div class="add">
    <el-form
      ref="ruleFormRef"
      :model="state.ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="商品分类" prop="category">
        <el-cascader
          :props="props"
          v-model="state.ruleForm.category"
          size="large"
          style="width: 300px"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input
          v-model="state.ruleForm.goodsName"
          type="text"
          size="large"
          placeholder="请输入商品名称"
        />
      </el-form-item>
      <el-form-item label="商品简介" prop="goodsIntro">
        <el-input
          v-model="state.ruleForm.goodsIntro"
          type="textarea"
          style="width: 300px"
          placeholder="请输入商品简介(100字)"
          max="100"
        />
      </el-form-item>
      <el-form-item label="商品价格" prop="originalPrice">
        <el-input
          v-model="state.ruleForm.originalPrice"
          type="number"
          size="large"
          placeholder="请输入商品价格"
        />
      </el-form-item>
      <el-form-item label="商品售卖价" prop="sellingPrice">
        <el-input
          v-model="state.ruleForm.sellingPrice"
          type="number"
          size="large"
          placeholder="请输入商品售价"
        />
      </el-form-item>
      <el-form-item label="商品库存" prop="stockNum">
        <el-input
          v-model="state.ruleForm.stockNum"
          type="number"
          size="large"
          placeholder="请输入商品库存"
        />
      </el-form-item>
      <el-form-item label="商品标签" prop="tag">
        <el-input
          v-model="state.ruleForm.tag"
          type="text"
          size="large"
          placeholder="请输入商品小标签"
        />
      </el-form-item>
      <el-form-item label="上架状态" prop="goodsSellStatus">
        <el-radio-group v-model="state.ruleForm.goodsSellStatus">
          <el-radio label="0">上架</el-radio>
          <el-radio label="1">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品主图" prop="goodsCoverImg">
        <el-upload
          class="avatar-uploader"
          action="http://backend-api-02.newbee.ltd/manage-api/v1/upload/file"
          :headers="{
            token: state.token,
          }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="handleBeforeUpload"
        >
          <img
            v-if="state.ruleForm.goodsCoverImg"
            :src="state.ruleForm.goodsCoverImg"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"
            ><i class="iconfont icon-tianjia"></i
          ></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="详情内容" prop="goodsDetailContent">
        <Editor
          ref="editor"
          :goodsDetailContent="state.ruleForm.goodsDetailContent"
        ></Editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{
          isUpdate ? "立即修改" : "立即创建"
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, watchEffect } from "vue";
import { categories, getGood, addGood, updateGood } from "../../api/add.js";
import Editor from "../../components/editor.vue";
import { useRoute, useRouter } from "vue-router";
const formSize = ref("default");
const state = reactive({
  params: {
    pageNumber: 1,
    pageSize: 1000,
    categoryLevel: 1,
    parentId: 0,
  },
  url: "",
  id: "",
  token: localStorage.getItem("token"),
  goods: {},
  ruleForm: {
    goodsCategoryId: 0,
    goodsCoverImg: "",
    goodsDetailContent: "",
    goodsIntro: "",
    goodsName: "",
    goodsSellStatus: 0,
    originalPrice: "",
    sellingPrice: "",
    stockNum: "",
    tag: "",
    category: "",
  },
});
//商品分类
const props = {
  lazy: true,
  lazyLoad(node, resolve) {
    const { level } = node;
    setTimeout(async () => {
      if (level === 0) {
        const { data } = await categories(state.params);
        const nodes = data.list.map((item) => ({
          value: item.categoryName,
          label: item.categoryName,
          categoryId: item.categoryId,
          leaf: level >= 2,
        }));
        resolve(nodes);
      }
      if (level === 1) {
        state.params.parentId = node.data.categoryId;
        state.params.categoryLevel = 2;
      }
      if (level === 2) {
        state.params.parentId = node.data.categoryId;
        state.params.categoryLevel = 3;
      }
      const { data } = await categories(state.params);
      const nodes = data.list.map((item) => {
        state.ruleForm.goodsCategoryId = item.categoryId;
        return {
          value: item.categoryName,
          label: item.categoryName,
          categoryId: item.categoryId,
          leaf: level >= 2,
        };
      });
      //
      resolve(nodes);
    }, 0);
  },
};
const router = useRouter();
const route = useRoute();
const isUpdate = ref(false); //是否是添加
const getDetail = async () => {};
watchEffect(async () => {
  //修改获取值
  if (route.query.id) {
    isUpdate.value = true;
    const {
      data: { goods, firstCategory, secondCategory, thirdCategory },
    } = await getGood(route.query.id);
    state.ruleForm = goods;
    state.ruleForm.category = [
      firstCategory.categoryName,
      secondCategory.categoryName,
      thirdCategory.categoryName,
    ];
  } else {
    isUpdate.value = false;
  }
  state.ruleForm.goodsSellStatus = state.ruleForm.goodsSellStatus + "";
});
const rules = reactive({
  goodsName: [{ required: true, message: "请填入商品名称", trigger: "blur" }],
  category: [
    {
      required: true,
      message: "请选择商品分类",
      trigger: "change",
    },
  ],
  originalPrice: [
    {
      required: true,
      message: "请填写商品价格",
      trigger: "change",
    },
  ],
  sellingPrice: [
    {
      required: true,
      message: "请输入商品售价",
      trigger: "change",
    },
  ],
  stockNum: [
    {
      required: true,
      message: "请输入商品库存",
      trigger: "change",
    },
  ],
  goodsCoverImg: [
    {
      required: true,
      message: "请输入商品主图",
      trigger: "change",
    },
  ],
});
const ruleFormRef = ref();
const editor = ref(null);
const onSubmit = () => {
  if (!ruleFormRef) return;
  ruleFormRef.value.validate(async (valid, fields) => {
    console.log(state.ruleForm.goodsCategoryId);
    //验证通过
    if (valid) {
      state.ruleForm.goodsDetailContent = editor.value.valueHtml;
      if (isUpdate.value) {
        const res = await updateGood(state.ruleForm);
        ElMessage.success("修改成功");
      } else {
        const res = await addGood(state.ruleForm);
        ElMessage.success("添加成功");
      }
      router.push("/good");
    } else {
      console.log("error submit!", fields);
    }
  });
};
//上传图片
const handleBeforeUpload = (file) => {
  console.log(file, 13123);
  const sufix = file.name.split(".")[1] || "";
  if (!["jpg", "jpeg", "png"].includes(sufix)) {
    ElMessage.error("请上传 jpg、jpeg、png 格式的图片");
    return false;
  }
};
const handleAvatarSuccess = (val) => {
  state.ruleForm.goodsCoverImg = val.data || "";
};
</script>
<style lang="scss" scoped>
.add {
  padding: 20px;
}
.el-input {
  width: 300px;
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
  width: 100px;
  height: 100px;
  text-align: center;
  border: 1px solid #e9e9e9;
}
img {
  width: 100%;
  height: 100%;
}
</style>
