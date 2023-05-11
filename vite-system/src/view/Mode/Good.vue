<template>
  <div class="good">
    <div class="oper">
      <el-button type="primary" @click="add"
        ><i class="iconfont icon-tianjia"></i>新增商品</el-button
      >
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
        <el-table-column label="商品编号" prop="goodsId"> </el-table-column>
        <el-table-column property="goodsName" label="商品名" />
        <el-table-column property="goodsIntro" label="商品简介" />
        <el-table-column property="goodsCoverImg" label="商品图片">
          <template #default="scope">
            <!-- {{ scope }} -->
            <img :src="scope.row.goodsCoverImg" />
          </template>
        </el-table-column>
        <el-table-column property="stockNum" label="商品库存" />
        <el-table-column property="sellingPrice" label="商品售价" />
        <el-table-column property="goodsSellStatus" label="上架状态">
          <template #default="scope">
            <span
              :class="{ active: scope.row.goodsSellStatus === 1, status: true }"
              >{{ scope.row.goodsSellStatus === 0 ? "销售中" : "已下架" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link @click="update(scope.row)">修改</el-button>
            <el-button link @click="updateStatus(scope.row)">{{
              scope.row.goodsSellStatus === 0 ? "下架" : "上架"
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="state.totalPage * 10"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { goods, up, down } from "../../api/mode.js";
import { useRoute, useRouter } from "vue-router";
const state = reactive({
  tableData: [],
  params: {
    pageSize: 10,
    pageNumber: 1,
  },
  totalPage: "",
  ids: [],
});
const getGoods = async () => {
  const {
    data: { list },
    data,
  } = await goods(state.params);
  state.tableData = list;
  state.totalPage = data.totalPage;
};
onMounted(() => {
  getGoods();
});
//分页
const sizeChange = () => {};
const currentChange = (val) => {
  state.params.pageNumber = val;
  getGoods();
};
const handleSelectionChange = (val) => {};
//商品的新增和修改,下架
const router = useRouter();
const add = () => {
  router.push("add");
};
const update = (row) => {
  console.log(row);
  router.push({ path: "/add", query: { id: row.goodsId } });
};
const updateStatus = async (row) => {
  console.log(row);
  state.ids = [];
  state.ids.push(row.goodsId);
  if (row.goodsSellStatus === 0) {
    const res = await down({ ids: state.ids });
  } else {
    const res = await up({ ids: state.ids });
  }
  getGoods();
};
</script>
<style lang="scss" scoped>
.good {
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
      color: rgb(34, 165, 241) !important;
    }
    img {
      width: 100px;
      height: 100px;
    }
    .status {
      color: rgb(0, 137, 121);
    }
    .active {
      color: red;
    }
  }
}
.el-pagination {
  margin: 20px 20px;
}
</style>
