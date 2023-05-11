<template>
  <div class="order">
    <div class="oper">
      <!-- <div class="search"> -->
      <el-input
        v-model="state.params.orderNo"
        placeholder="请输入订单号"
        width="100px"
        size="small"
        @blur="searchOrderNo"
      />
      <el-select v-model="state.input" @change="searchStatus">
        <el-option label="全部" value=""></el-option>
        <el-option label="待支付" value="0"></el-option>
        <el-option label="已支付" value="1"></el-option>
        <el-option label="配货完成" value="2"></el-option>
        <el-option label="出库关闭" value="3"></el-option>
        <el-option label="交易成功" value="4"></el-option>
        <el-option label="手动关闭" value="-1"></el-option>
        <el-option label="超时关闭" value="-2"></el-option>
        <el-option label="商家关闭" value="-3"></el-option>
      </el-select>
      <el-button type="primary" @click="finish"
        ><i class="iconfont icon-chuku"></i>配货完成</el-button
      >
      <el-button type="primary" @click="checkouted"
        ><i class="iconfont icon-chuku"></i>出库</el-button
      >
      <el-button type="danger" @click=""
        ><i class="iconfont icon-shanchu"></i>关闭订单</el-button
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
        <el-table-column label="订单号" prop="orderNo" min-width="150px">
        </el-table-column>
        <el-table-column property="totalPrice" label="订单总价" />
        <el-table-column property="orderStatus" label="订单状态"
          ><template #default="scope">
            {{ orderStatus(scope.row.orderStatus) }}</template
          ></el-table-column
        >
        <el-table-column property="payType" label="支付方式">
          <template #default="scope">
            {{
              scope.row.payType === 0
                ? "未支付"
                : scope.row.payType === 1
                ? "微信支付"
                : "支付宝支付"
            }}
          </template>
        </el-table-column>
        <el-table-column
          property="createTime"
          label="创建时间"
          min-width="150px"
        />
        <el-table-column label="操作" min-width="200">
          <template #default="scope">
            <el-popconfirm
              title="确定要配货完成吗?"
              @confirm="confirm(scope.row, '配货完成')"
              v-if="scope.row.orderStatus === 1"
            >
              <template #reference>
                <el-button link>配货完成</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              title="确定要出库吗?"
              @confirm="confirm(scope.row, '出库')"
              v-if="
                (scope.row.orderStatus === 2 || scope.row.orderStatus === 1) &&
                (scope.row.orderStatus !== 3 || !scope.row.orderStatus < 0)
              "
            >
              <template #reference>
                <el-button link>出库</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              title="确定要关闭订单吗?"
              @confirm="confirm(scope.row, '关闭订单')"
              v-if="scope.row.orderStatus >= 0"
            >
              <template #reference>
                <el-button link>关闭订单</el-button>
              </template>
            </el-popconfirm>
            <el-button link @click="detail(scope.row)">订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="state.totalCount"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getOrders, finished, checkout, close } from "../../api/mode.js";
import { ElMessage } from "element-plus";
const state = reactive({
  input: "",
  tableData: [],
  totalCount: 0,
  params: {
    pageNumber: 1,
    pageSize: 10,
    orderNo: "",
    orderStatus: "",
  },
  ids: [],
});
const ordersMessage = async () => {
  const {
    data: { list, totalCount },
  } = await getOrders(state.params);
  state.tableData = list;
  state.totalCount = totalCount;
};
onMounted(() => {
  ordersMessage();
});
//分页
const sizeChange = (val) => {};
const currentChange = (val) => {
  state.params.pageNumber = val;
  ordersMessage();
};
//订单状态转换
const orderStatus = (val) => {
  let status = "";
  switch (val) {
    case 0:
      status = "待支付";
      break;
    case 1:
      status = "已支付";
      break;
    case 2:
      status = "配货完成";
      break;
    case 3:
      status = "出库关闭";
      break;
    case 4:
      status = "交易成功";
      break;
    case -1:
      status = "手动关闭";
      break;
    case -2:
      status = "超时关闭";
      break;
    case -3:
      status = "商家关闭";
  }
  return status;
};
//搜索
const searchOrderNo = () => {
  ordersMessage();
};
const searchStatus = () => {
  state.params.orderStatus = state.input;
  console.log(state.params.orderStatus);
  ordersMessage();
};
//多选
const handleSelectionChange = (val) => {
  state.ids = [];
  val.map((item) => {
    state.ids.push(item.orderId);
  });
};
//配货，出库，关闭
const finish = async () => {
  if (state.ids.length === 0) return;
  await finished({ ids: state.ids });
  ElMessage.success("配货完成");
  ordersMessage();
};
const checkouted = async () => {
  if (state.ids.length === 0) return;
  await checkout({ ids: state.ids });
  ElMessage.success("出库成功");
  ordersMessage();
};
const closeOrder = async () => {
  if (state.ids.length === 0) return;
  await close({ ids: state.ids });
  ElMessage.success("关闭成功");
  ordersMessage();
};
const confirm = async (row, value) => {
  state.ids = [];
  state.ids.push(row.orderId);
  if (value === "配货完成") {
    finish();
  }
  if (value === "出库") {
    checkouted();
  }
  if (value === "关闭订单") {
    closeOrder();
  }
};
//订单详情
const router = useRouter();
const detail = (row) => {
  router.push({
    path: "/order_detail",
    query: { id: row.orderId },
  });
};
</script>
<style lang="scss" scoped>
.order {
  overflow: hidden;
  .oper {
    display: flex;
    text-align: left;
    padding: 20px;
    border-bottom: 1px solid #e9e9e9;
    .el-input {
      width: 200px !important;
      font-size: 14px;
    }
    .el-select {
      margin-left: 10px;
      margin-right: 10px;
    }

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
  }
}
.el-pagination {
  margin: 20px 20px;
}
</style>
