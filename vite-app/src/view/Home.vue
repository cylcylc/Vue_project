<template>
  <div class="home">
    <div class="header">
      <div class="content">
        <div class="type" @click="select">
          <span>{{ type_name }}</span
          ><span class="divide"></span><span><van-icon name="qr" /></span>
        </div>
        <div class="total">
          <div class="time" @click="selectTime">
            {{ params.date }}<i class="iconfont icon-icon_sanjiaoxing"></i>
          </div>
          <div class="outTotal">总支出&nbsp;¥{{ save(totalExpense) }}</div>
          <div class="incomeTotal">总收入&nbsp;¥{{ save(totalIncome) }}</div>
        </div>
      </div>
    </div>
    <div class="list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="list-item" v-for="items in bills">
            <div class="list-count">
              <div class="bottom-line">
                <div class="list-time">{{ items.date }}</div>
                <div class="list-come">
                  <span><i>支</i>{{ save(items.out) }}</span>
                  <span><i>收</i>{{ save(items.in) }}</span>
                </div>
              </div>
            </div>
            <div
              class="list-content"
              v-for="item in items.bills"
              @click="detail(item)"
            >
              <div class="bottom-line">
                <div class="left">
                  <div class="list-type">
                    <span>{{ item.type_name }}</span
                    ><span>{{ timestamp(Number(item.date), 1) }}</span>
                  </div>
                </div>
                <div class="right">
                  <span v-if="item.pay_type === 1">
                    {{ "-" + item.amount }}
                  </span>
                  <span v-else style="color: #ecbe25">
                    {{ "+" + item.amount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <div class="add" @click="add"><i class="iconfont icon-classnotes"></i></div>
    <van-popup
      v-model:show="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '80%' }"
      round
    >
      <div class="title">请选择类型</div>
      <div class="types">
        <div class="content">
          <div
            :class="{ showType: true, active: params.type_id === 'all' }"
            @click="selectType({ type_id: 'all', name: '全部类型' })"
          >
            全部类型
          </div>
          <p>支出</p>
          <div class="out">
            <div
              v-for="item in out"
              @click="selectType(item)"
              :class="{ active: params.type_id === item.id }"
            >
              {{ item.name }}
            </div>
          </div>
          <p>收入</p>
          <div class="income">
            <div
              v-for="item in income"
              @click="selectType(item)"
              :class="{ active: params.type_id === item.id }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 选择时间 -->
    <van-popup
      v-model:show="showTime"
      round
      position="bottom"
      :style="{ height: '48%' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="confirm"
        @cancel="cancel"
      />
    </van-popup>

    <!-- 添加账单 -->
    <AddBill ref="addBill"></AddBill>
  </div>
</template>
<script>
import { reactive, toRefs, ref, onMounted, watchEffect, watch } from "vue";
import { getTypes, getList } from "../api/home.js";
import { format, timestamp } from "../utils/date";
import AddBill from "../components/AddBill.vue";
import { useRouter } from "vue-router";
export default {
  name: "Home",
  components: { AddBill },
  setup() {
    const state = reactive({
      out: [],
      income: [],
      types: [],
      nowTimeMD: format(new Date(), "MM-dd"),
    });
    const bill = reactive({
      totalExpense: 0,
      totalIncome: 0,
      totalPage: 0,
      type_name: "全部类型",
      params: {
        date: format(new Date(), "yyyy-MM"),
        type_id: "all",
        page: 0,
        page_size: 5,
      },
      bills: [],
    });
    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);
    const getBill = async () => {
      const { data } = await getList(bill.params);
      bill.totalExpense = data.totalExpense;
      bill.totalIncome = data.totalIncome;
      //下拉刷新
      if (refreshing.value) {
        bill.bills = [];
        refreshing.value = false;
      }
      //如果上拉刷新拼接数据
      bill.bills = bill.bills.concat(data.list);
      bill.totalPage = data.totalPage;
      loading.value = false;
      //没有更多数据了
      if (bill.params.page >= bill.totalPage) {
        finished.value = true;
      }
      //算每天支出和收入多少
      bill.bills.forEach((item) => {
        item.in = 0;
        item.out = 0;
        for (let i = 0; i < item.bills.length; i++) {
          if (item.bills[i].pay_type === 1) {
            item.out += Number(item.bills[i].amount);
          } else {
            item.in += Number(item.bills[i].amount);
          }
        }
      });
    };
    //刷新
    const onLoad = () => {
      if (!refreshing.value && bill.params.page < bill.totalPage) {
        bill.params.page += 1;
      }
      getBill();
    };
    //下拉刷新
    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      //页数重置为1
      bill.params.page = 1;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
      refreshing.value = true;
      onLoad();
    };
    onMounted(async () => {
      //全部类型
      const res = await getTypes();
      state.types = res.data.list;
      state.out = state.types.filter((item) => {
        return item.type === "1";
      });
      state.income = state.types.filter((item) => {
        return item.type === "2";
      });
    });
    //类型选择
    const show = ref(false); //显示类型选择
    const showTime = ref(false); //显示时间
    const select = async () => {
      show.value = true;
    };
    const selectType = (item) => {
      bill.params.type_id = item.id;
      bill.type_name = item.name;
      show.value = false;
      onRefresh();
    };
    //日期选择
    const selectTime = () => {
      showTime.value = true;
    };
    const currentDate = ref(new Date());
    const formatter = (type, val) => {
      if (type === "year") {
        return `${val}年`;
      }
      if (type === "month") {
        return `${val}月`;
      }
      return val;
    };
    const confirm = () => {
      showTime.value = false;
      bill.params.date = format(currentDate.value, "yyyy-MM");
      onRefresh();
    };
    const cancel = () => {
      showTime.value = false;
    };
    //保留2位小数
    const save = (num) => {
      return num.toFixed(2);
    };
    //添加新账单
    const addBill = ref(null);
    const addbill = ref(false);
    const add = () => {
      addBill.value.showPop();
      addbill.value = false;
    };
    const isConfirmAdd = ref(false);
    watchEffect(() => {
      if (addBill.value !== null) {
        const isAdd = addBill.value.isAdd;
        if (!isAdd) {
          isConfirmAdd.value = true;
        } else {
          isConfirmAdd.value = false;
        }
      }
    });
    //监听isConfirmAdd
    watch(isConfirmAdd, () => {
      if (isConfirmAdd.value) {
        onRefresh();
      }
    });
    //账单详情
    const router = useRouter();
    const detail = (item) => {
      router.push({
        path: "detail",
        query: { id: item.id },
      });
    };
    return {
      ...toRefs(state),
      ...toRefs(bill),
      select,
      show,
      showTime,
      selectTime,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2080, 10, 1),
      formatter,
      currentDate,
      confirm,
      cancel,
      selectType,
      timestamp,
      format,
      save,
      add,
      addBill,
      detail,
      onLoad,
      loading,
      finished,
      onRefresh,
      refreshing,
    };
  },
};
</script>
<style lang="scss" scoped>
.home {
  overflow: hidden;
}
.header {
  padding-bottom: 90px;
  overflow: hidden;
  .content {
    position: fixed;
    width: 100%;
    height: 80px;
    background-color: $primary;
    z-index: 1000;
  }
}
.list {
  position: relative;
  padding-bottom: 66px;
}
.type {
  width: 100px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.15);
  color: aliceblue;
  margin: 10px;
  margin-left: 20px;
  line-height: 32px;
  border-radius: 5px;
  text-align: center;
  span {
    display: inline-block;
    font-size: 14px;
  }
  .divide {
    height: 8px;
    border: 0.05px solid;
    margin-left: 10px;
    margin-right: 10px;
  }
}
.title {
  font-size: 14px;
  margin-top: 16px;
  background-color: rgb(255, 255, 255);
  margin-bottom: 10px;
}
.types {
  width: 100%;
  height: 482px;
  background-color: rgb(245, 245, 245);
  .content {
    width: 90%;
    height: 100%;
    margin: auto;
    // background-color: aqua;
    overflow: auto;
    .showType {
      width: 102px;
      height: 47px;
      font-size: 16px;
      line-height: 47px;
      margin-top: 20px;
      background-color: rgba(255, 255, 255);
    }
    .active {
      background-color: rgb(57, 190, 119);
      color: aliceblue;
    }
    .out,
    .income {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: -20px;
    }
    .out div,
    .income div {
      width: 30%;
      height: 47px;
      font-size: 16px;
      line-height: 47px;
      text-align: center;
      background-color: rgba(255, 255, 255);
      margin-top: 10px;
    }
    .out .active,
    .income .active {
      background-color: rgb(57, 190, 119);
      color: aliceblue;
    }
    p {
      text-align: left;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
}
.total {
  display: flex;
  margin-left: 20px;
  color: aliceblue;
  div {
    margin-right: 10px;
    font-size: 13px;
  }
}
.list-item {
  width: 95%;
  background-color: rgb(255, 255, 255);
  margin: 10px auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 0.10667rem 0 rgb(0 0 0 / 10%);
  .list-count {
    width: 100%;
    height: 60px;
    background-color: rgb(249, 249, 249);
    .bottom-line {
      display: flex;
      width: 90%;
      height: 100%;
      margin: auto;
      justify-content: space-between;
      div {
        width: 50%;
        margin: auto;
      }
      .list-time {
        text-align: left;
      }
      .list-come {
        text-align: right;
        span {
          margin-left: 10px;
        }
        span i {
          display: inline-block;
          width: 15px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          background-color: rgba(0, 0, 0, 0.02);
          color: #969799;
          margin: auto 3px;
        }
      }
    }
  }
  .list-content {
    width: 100%;
    height: 66px;
    overflow: hidden;
    .bottom-line {
      display: flex;
      width: 90%;
      height: 100%;
      margin: auto;
      justify-content: space-between;
      border-top: 1px solid rgb(245, 249, 245);
      padding-top: 10px;
    }
    .left {
      width: 50%;
      text-align: left;
      span {
        display: block;
      }
      span:nth-of-type(1) {
        font-size: 14px;
      }
      span:nth-of-type(2) {
        color: #969799;
      }
    }
    .right {
      width: 50%;
      font-size: 14px;
      text-align: right;
    }
  }
}
.add {
  position: fixed;
  width: 40px;
  height: 40px;
  right: 30px;
  bottom: 120px;
  color: rgb(57, 190, 119);
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 0.26667rem 0 rgb(0 0 0 / 20%);
  z-index: 1;
  border-radius: 50%;
}
</style>
