<template>
  <div>
    <van-popup
      v-model:show="isAdd"
      round
      position="bottom"
      :style="{ height: '78%' }"
      closeable
      close-icon-position="top-left"
    >
      <div class="confirm" @click="addConfirm">
        <span>确定</span>
      </div>
      <div class="second">
        <div class="send-item">
          <span @click="changePayType(1)" :class="{ active1: isChange === 1 }">
            支出
          </span>
          <span @click="changePayType(2)" :class="{ active2: isChange === 2 }"
            >收入</span
          >
        </div>
        <div class="time" @click="show = true">
          {{ timestamp(Number(addDates.date), 2)
          }}<i class="iconfont icon-icon_sanjiaoxing"></i>
        </div>
      </div>
      <div class="third">
        <span>¥</span>
        <span class="count">{{ count }}</span>
      </div>
      <!-- 选择时间 -->
      <van-popup
        v-model:show="show"
        round
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="confirm"
          @cancel="cancel"
        />
      </van-popup>
      <!-- 账单类型 -->
      <div class="types">
        <div
          v-for="item in out"
          class="out"
          v-if="isChange === 1"
          @click="changeType(item)"
        >
          <span
            :class="{ outIcon: true, inActive: addDates.type_id === item.id }"
            ><i class="iconfont" :class="typesIcon[item.id].icon"></i
          ></span>
          <span>{{ item.name }}</span>
        </div>
        <div class="in" v-else v-for="item in income" @click="changeType(item)">
          <span
            :class="{ inIcon: true, comeActive: addDates.type_id === item.id }"
            ><i class="iconfont" :class="typesIcon[item.id].icon"></i
          ></span>
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div class="remark" @click="addRemark">
        {{ remarks === "" ? "添加备注" : remarks }}
      </div>
      <DialogBill ref="remark">
        <template v-slot:title>备注</template>
        <template v-slot:detail-content>
          <van-field
            v-model="remarks"
            placeholder="请添加备注"
            rows="2"
            autosize
            type="textarea"
            maxlength="20"
            show-word-limit
        /></template>
        <template v-slot:cancel>
          <div @click="closeRemark">取消</div>
        </template>
        <template v-slot:confirm>
          <div @click="confirmRemark">确定</div>
        </template>
      </DialogBill>
      <van-number-keyboard v-model="count" :show="isShow" />
    </van-popup>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted, watchEffect } from "vue";
import { format, timestamp } from "../utils/date";
import { add, getTypes } from "../api/home.js";
import { update } from "../api/detail.js";
import { Toast } from "vant";
import { useRoute } from "vue-router";
import DialogBill from "./DialogBill.vue";
export default {
  name: "AddBill",
  components: {
    DialogBill,
  },
  props: ["detailBill"],
  setup(props) {
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
    const isAdd = ref(false);
    const addDate = reactive({
      money: "",
      addDates: {
        amount: "",
        date: Date.parse(new Date()),
        pay_type: 1,
        remark: "",
        type_id: 1,
        type_name: "餐饮",
      },
    });
    const state = reactive({
      isChange: 1,
      count: "",
      out: [],
      income: [],
      isShow: true,
      editRemark: false,
      remarks: "",
    });
    const showPop = () => {
      isAdd.value = !isAdd.value;
      isConfirmAdd.value = false;
    };
    //切换支付状态
    const changePayType = (value) => {
      if (value === 2) {
        addDate.addDates.type_id = 11;
        addDate.addDates.type_name = "工资";
      } else {
        addDate.addDates.type_id = 1;
        addDate.addDates.type_name = "餐饮";
      }
      state.isChange = value;
      addDate.addDates.pay_type = value;
    };
    //选择时间
    const show = ref(false);
    const currentDate = ref(new Date());
    const confirm = () => {
      addDate.addDates.date = Date.parse(currentDate.value);
      show.value = false;
    };
    const cancel = () => {
      show.value = false;
    };
    //选择支付类型
    const changeType = (item) => {
      addDate.addDates.type_id = item.id;
      addDate.addDates.type_name = item.name;
    };
    //添加备注
    const remark = ref(null);
    const addRemark = () => {
      remark.value.showDialog();
    };
    const confirmRemark = () => {
      remark.value.fade();
      addDate.addDates.remark = state.remarks;
    };
    const closeRemark = () => {
      remark.value.fade();
    };
    //详情页编辑
    const isDetail = ref(false);
    const route = useRoute();
    watchEffect(() => {
      if (route.path === "/detail") {
        addDate.addDates = JSON.parse(JSON.stringify(props.detailBill));
        state.count = props.detailBill.amount;
        state.remarks = props.detailBill.remark;
        state.isChange = props.detailBill.pay_type;
        isDetail.value = true;
      }
    });
    //确定添加账单
    const isConfirmAdd = ref(false);
    const addConfirm = async () => {
      addDate.addDates.amount = Number(state.count).toFixed(2) + "";
      if (addDate.addDates.amount === "0.00") {
        Toast.fail("请输入金额");
      } else {
        if (isDetail.value) {
          const res = await update(addDate.addDates);
          Toast.success("修改成功");
          isDetail.value;
        } else {
          const res = await add(addDate.addDates);
          Toast.success("添加成功");
        }
        isAdd.value = false;
        isConfirmAdd.value = true;
        //清空数据
        addDate.addDates = {
          amount: "",
          date: Date.parse(new Date()),
          pay_type: 1,
          remark: "",
          type_id: 1,
          type_name: "餐饮",
        };
        state.count = "";
        state.isChange = 1;
      }
    };

    //图标
    const typesIcon = {
      1: {
        icon: "icon-canyin",
      },
      2: {
        icon: "icon-fushi",
      },
      3: {
        icon: "icon-gongjiao",
      },
      4: {
        icon: "icon-ziyuan",
      },
      5: {
        icon: "icon-gouwuchexuanzhong",
      },
      6: {
        icon: "icon-xuexi",
      },
      7: {
        icon: "icon-yaopin",
      },
      8: {
        icon: "icon-feiji",
      },
      9: {
        icon: "icon-xiaolian",
      },
      10: {
        icon: "icon-qita",
      },
      11: {
        icon: "icon-gongzi",
      },
      12: {
        icon: "icon-wodegongzi",
      },
      13: {
        icon: "icon-zhuanzhang",
      },
      14: {
        icon: "icon-licai",
      },
      15: {
        icon: "icon-refund",
      },
      16: {
        icon: "icon-qita",
      },
    };
    return {
      ...toRefs(addDate),
      ...toRefs(state),
      isAdd,
      timestamp,
      showPop,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate,
      show,
      confirm,
      cancel,
      changePayType,
      typesIcon,
      changeType,
      addConfirm,
      addRemark,
      confirmRemark,
      closeRemark,
      remark,
      isConfirmAdd,
    };
  },
};
</script>
<style lang="scss" scoped>
.confirm {
  width: 90%;
  height: 50px;
  margin: auto;
  span {
    display: block;
    float: right;
    width: 50px;
    height: 30px;
    margin-top: 7px;
    border-radius: 3px;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    background-color: rgb(57, 190, 119);
    color: aliceblue;
  }
}
.second {
  width: 90%;
  height: 50px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  .send-item {
    span {
      display: inline-block;
      width: 50px;
      height: 28px;
      margin-right: 10px;
      text-align: center;
      line-height: 28px;
      color: #969799;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 14px;
    }
    .active1 {
      border: 1px solid rgb(57, 190, 119);
      color: rgb(57, 190, 119);
      background-color: rgb(234, 251, 246);
    }
    .active2 {
      border: 1px solid rgb(236, 190, 37);
      color: rgb(236, 190, 37);
      background-color: rgb(251, 248, 240);
    }
  }
  .time {
    width: 70px;
    height: 28px;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 14px;
    text-align: center;
    line-height: 28px;
  }
}
.third {
  width: 90%;
  margin: auto;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  span:nth-of-type(1) {
    font-size: 30px;
    font-weight: 700;
    padding-right: 10px;
  }
  span:nth-of-type(2) {
    display: inline-block;
    width: 90%;
    text-align: left;
    font-size: 30px;
    font-weight: 700;
    border: 0;
  }
  .count::after {
    content: "";
    display: inline-block;
    width: 2px;
    height: 28px;
    animation: blink 1s infinite steps(1, start);
  }
  @keyframes blink {
    0% {
      background-color: white;
    }
    50% {
      background-color: rgba(0, 0, 0, 0.3);
    }
    100% {
      background-color: white;
    }
  }
}
.types {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  overflow: auto;
  div {
    width: 27px;
    display: flex;
    margin: 20px 14px;
    flex-direction: column;
    justify-content: space-between;
    .inIcon,
    .outIcon {
      width: 27px;
      height: 27px;
      color: #969799;
      border-radius: 14px;
      background-color: rgba(0, 0, 0, 0.05);
    }
    .inActive {
      border: 1px solid rgb(57, 190, 119);
      color: white;
      background-color: rgb(57, 190, 119);
    }
    .comeActive {
      border: 1px solid rgb(236, 190, 37);
      color: white;
      background-color: rgb(236, 190, 37);
    }
  }
}
.remark {
  width: 90%;
  margin: auto;
  text-align: left;
  color: #4b67e2;
}
</style>
