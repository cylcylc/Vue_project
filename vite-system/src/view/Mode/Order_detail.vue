<template>
  <div class="detail">
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="hover">
          <div>订单状态</div>
          <div>{{ state.datas.orderStatusString }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover"
          ><div>创建时间</div>
          <div>{{ state.datas.createTime }}</div></el-card
        >
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div>订单号</div>
          <div>{{ state.datas.orderNo }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12" class="content">
      <el-table :data="state.tableDate" style="width: 100%">
        <el-table-column prop="goodsCoverImg" label="商品图片" width="180">
          <template #default="scope">
            <img :src="scope.row.goodsCoverImg" />
            <!-- {{ scope.row.goodsCoverImg }} -->
          </template>
        </el-table-column>
        <el-table-column prop="goodsId" label="商品编号" width="180" />
        <el-table-column prop="goodsName" label="商品名称" />
        <el-table-column prop="goodsCount" label="商品数量" />
        <el-table-column prop="sellingPrice" label="价格" />
      </el-table>
    </el-row>
  </div>
</template>
<script setup>
// import { detail } from "../../api/mode.js";
import { onMounted, reactive } from "vue";
import { detail } from "../../api/mode.js";
import { useRoute } from "vue-router";
const route = useRoute();
const state = reactive({
  datas: {},
  tableDate: [],
});
onMounted(async () => {
  const { data } = await detail(route.query.id);
  state.datas = data;
  state.tableDate = data.newBeeMallOrderItemVOS;
  console.log(state.tableDate);
});
</script>
<style lang="scss" scoped>
.detail {
  padding: 20px;
}
.el-card {
  border: 1px solid #e9e9e9;
  --el-card-padding: 0px;
}
.el-card div {
  width: 100%;
  height: 60px;
  padding-left: 20px;
  line-height: 60px;
  text-align: left;
}
.el-card div:nth-of-type(1) {
  border-bottom: 1px solid #e9e9e9;
}
img {
  width: 100px;
}
.content {
  margin: 40px 0px;
  border: 1px solid #e9e9e9;
}
</style>
