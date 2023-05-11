<template>
  <div class="statistics">
    <div class="title">
      <div class="time" @click="showDate">
        <span>{{ format(date, "yyyy-MM") }}</span
        ><span class="divide">|</span
        ><span><van-icon name="description" /></span>
      </div>
      <div class="total">
        <p>共支出</p>
        <div class="money">¥{{ data.total_expense }}</div>
        <div class="income">
          <span>共收入¥{{ data.total_income }}</span>
        </div>
      </div>
    </div>
    <div class="diagram">
      <div class="diagram_title">
        <div>收支构成</div>
        <div>
          <span :class="{ active: isOut === 1, out: true }" @click="isChange(1)"
            >支出</span
          ><span
            class="in"
            :class="{ activeIn: isOut === 2, out: true }"
            @click="isChange(2)"
            >收入</span
          >
        </div>
      </div>
      <div class="content" v-for="item in isOut === 1 ? out : income">
        <div class="icon">
          <i class="iconfont" :class="typesIcon[Number(item.type_id)].icon"></i>
        </div>
        <div class="name">{{ item.type_name }}</div>
        <div class="precent">
          {{
            (
              (item.number /
                (isOut === 1 ? data.total_expense : data.total_income)) *
              100
            ).toFixed(2)
          }}%
        </div>
        <div class="progress">
          <van-progress
            color="rgb(57, 190, 119)"
            :percentage="
              (
                (item.number /
                  (isOut === 1 ? data.total_expense : data.total_income)) *
                100
              ).toFixed(2)
            "
            stroke-width="5"
            :show-pivot="false"
            track-color="#ffffff"
          />
        </div>
        <div class="count">¥{{ item.number.toFixed(2) }}</div>
      </div>
    </div>
    <div class="diagram">
      <div class="diagram_title">
        <div>收支构成</div>
        <div>
          <span :class="{ active: isIn === 3, out: true }" @click="isChange(3)"
            >支出</span
          ><span
            class="in"
            :class="{ activeIn: isIn === 4, out: true }"
            @click="isChange(4)"
            >收入</span
          >
        </div>
      </div>
      <div id="proportion"></div>
    </div>
    <van-popup
      v-model:show="isShow"
      round
      position="bottom"
      :style="{ height: '48%' }"
    >
      <van-datetime-picker
        v-if="isShow"
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
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from "vue";
import { statistisc_data } from "../api/statistisc";
import { format } from "../utils/date.js";
import * as echarts from "echarts";
export default {
  name: "Statistics",
  setup() {
    const state = reactive({
      data: {},
      date: new Date(),
      currentDate: "",
      isOut: 1,
      isIn: 3,
      out: [],
      income: [],
    });
    onMounted(async () => {
      getMessage();
    });
    const getMessage = async () => {
      const res = await statistisc_data({
        date: format(state.date, "yyyy-MM"),
      });
      state.data = res.data;
      state.out = state.data.total_data
        .filter((item) => {
          return item.pay_type === 1;
        })
        .sort((a, b) => b.number - a.number);
      state.income = state.data.total_data
        .filter((item) => {
          return item.pay_type === 2;
        })
        .sort((a, b) => b.number - a.number);
      setPie();
    };
    //时间选择
    const isShow = ref(false);
    const formatter = (type, val) => {
      if (type === "year") {
        return `${val}年`;
      }
      if (type === "month") {
        return `${val}月`;
      }
      return val;
    };
    const showDate = () => {
      isShow.value = true;
      state.currentDate = state.date;
    };
    const cancel = () => {
      isShow.value = false;
    };
    const confirm = () => {
      isShow.value = false;
      state.date = state.currentDate;
      getMessage();
    };
    //支出和收入切换
    const isChange = (value) => {
      // 进度条（1,2）
      if (value <= 2) {
        state.isOut = value;
      } else {
        // 饼状图（3,4）
        state.isIn = value;
        setPie();
      }
    };
    //饼状图
    // 绘制饼状图
    const setPie = () => {
      //初始化
      const proportion = echarts.init(document.getElementById("proportion"));
      const pie_data = state.isIn === 3 ? state.out : state.income;
      console.log(pie_data, 123);
      //添加图表配置信息
      proportion.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c}({d}%)",
        },
        //图例
        legend: {
          data: pie_data.map((item) => item.type_name),
        },
        series: [
          {
            name: "支出",
            type: "pie", //图标类型
            radius: "55%",
            //饼图数据
            data: pie_data.map((item) => {
              return { value: item.number, name: item.type_name };
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
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
      ...toRefs(state),
      formatter,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      isShow,
      showDate,
      cancel,
      confirm,
      format,
      isChange,
      typesIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  height: 190px;
  background-color: rgb(255, 255, 255);
  overflow: hidden;
  .time {
    width: 100px;
    height: 30px;
    line-height: 30px;
    background-color: rgba(0, 0, 0, 0.05);
    margin: 20px auto;
    border-radius: 5px;
    font-size: 13px;
    .divide {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .total {
    p,
    .money {
      color: rgb(57, 190, 119);
    }
    .money {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .income {
      color: #969696;
    }
  }
}
.diagram {
  width: 100%;
  background-color: rgb(255, 255, 255);
  margin-top: 10px;
  overflow: hidden;
  .diagram_title {
    width: 90%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    div:nth-of-type(1) {
      font-size: 18px;
    }
    div:nth-of-type(2) {
      span {
        display: inline-block;
        width: 40px;
        height: 24px;
        margin-left: 10px;
        border-radius: 5px;

        background-color: rgba(0, 0, 0, 0.1);
      }
      .active {
        color: rgb(57, 190, 119);
        background-color: rgb(215, 242, 228);
      }
      .activeIn {
        color: #ecbe25;
        background-color: rgba(236, 190, 37, 0.2);
      }
    }
  }
}
.content {
  width: 90%;
  margin: 20px auto;
  height: 30px;
  display: flex;
  justify-content: space-between;
  div {
    height: 30px;
    line-height: 30px;
  }
  .progress {
    // width: 100%;
    width: 140px;
    .van-progress {
      margin-top: 11px;
    }
  }
  .icon {
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    background-color: rgb(57, 190, 119);
    color: rgb(255, 255, 255);
  }
  .count {
    width: 60px;
    text-align: left;
  }
}
#proportion {
  width: 90%;
  margin: auto;
  height: 350px;
}
</style>
