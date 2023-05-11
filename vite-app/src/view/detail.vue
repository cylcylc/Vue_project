<template>
  <div class="detail">
    <Header>
      <template v-slot:back
        ><span @click="back" class="backLogin"
          ><van-icon name="arrow-left" />返回</span
        >
      </template>
      <template v-slot:title>账单详情</template>
    </Header>
    <div class="bill">
      <div class="icon">
        <span
          :class="{
            out: detailBill.pay_type === 1,
            income: detailBill.pay_type === 2,
          }"
        >
          <i
            class="iconfont"
            :class="detailBill.type_id ? typesIcon[detailBill.type_id].icon : 0"
          ></i>
        </span>

        <span class="name">{{ detailBill.type_name }}</span>
      </div>
      <div class="money">
        {{
          detailBill.pay_type === 1
            ? "-" + detailBill.amount
            : "+" + detailBill.amount
        }}
      </div>
      <div class="time">
        <span class="title">记录时间</span
        ><span class="content">{{
          timestamp(Number(detailBill.date), 3)
        }}</span>
      </div>
      <div class="remark">
        <span class="title">备注</span
        ><span class="content">{{
          detailBill.remark ? detailBill.remark : "-"
        }}</span>
      </div>
      <div class="oper">
        <span class="cancel" @click="cancel"
          ><van-icon name="delete-o" />删除</span
        >
        <span class="edit" @click="edit"><van-icon name="edit" />编辑</span>
      </div>
    </div>
    <AddBill ref="addBill" :detailBill="detailBill"></AddBill>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref, watchEffect } from "vue";
import { detailBill, deleteBill } from "../api/detail";
import { useRoute, useRouter } from "vue-router";
import Header from "../components/Header.vue";
import { timestamp } from "../utils/date";
import { Dialog, Toast } from "vant";
import AddBill from "../components/AddBill.vue";
export default {
  name: "detail",
  components: {
    Header,
    AddBill,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      detailBill: [],
    });
    onMounted(async () => {
      const res = await detailBill({ id: route.query.id });
      state.detailBill = res.data;
    });
    const back = () => {
      router.push("/home");
    };
    const cancel = () => {
      Dialog.confirm({
        title: "删除",
        message: "确认要删除账单",
      })
        .then(async () => {
          const res = await deleteBill({ id: state.detailBill.id });
          router.push("/home");
          Toast.success("删除成功");
        })
        .catch(() => {});
    };
    const addBill = ref(null);
    const edit = () => {
      addBill.value.showPop();
    };
    watchEffect(async () => {
      if (addBill.value !== null) {
        console.log(addBill.value);
        const isAdd = addBill.value.isAdd;
        if (isAdd === false) {
          //修改新的账单之后，页面数据刷新
          const res = await detailBill({ id: route.query.id });
          state.detailBill = res.data;
        }
      }
    });
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
      back,
      typesIcon,
      timestamp,
      cancel,
      edit,
      addBill,
    };
  },
};
</script>

<style lang="scss" scoped>
.detail {
  overflow: hidden;
}
.bill {
  width: 90%;
  height: 231px;
  background-color: rgb(255, 255, 255);
  margin: 60px auto;
  border-radius: 10px;
  overflow: hidden;
}
.icon {
  margin-top: 25px;
  span {
    display: inline-block;
    line-height: 20px;
    border-radius: 50%;
  }
  .out {
    width: 20px;
    height: 20px;
    border: 1px solid rgb(57, 190, 119);
    color: white;
    background-color: rgb(57, 190, 119);
  }
  .income {
    width: 20px;
    height: 20px;
    border: 1px solid rgb(236, 190, 37);
    color: white;
    background-color: rgb(236, 190, 37);
  }
  .name {
    padding-left: 5px;
  }
}
.money {
  font-size: 20px !important;
  font-weight: 700;
  margin-top: 20px;
  margin-bottom: 30px;
}
.time,
.remark {
  width: 90%;
  margin: 10px auto;
  display: flex;
  span {
    display: inline-block;
    text-align: left;
    height: 20px;
    font-size: 14px;
    line-height: 20px;
  }
  .title {
    width: 25%;
    color: #969799;
  }
  .content {
    width: 80%;
  }
}
.oper {
  width: 90%;
  margin: auto;
  height: 47px;
  margin-bottom: 0px;
  display: flex;
  line-height: 47px;
  border-top: 1px solid #f1f4f7;
  span {
    display: inline-block;
    width: 50%;
    height: 100%;
    font-size: 16px;
  }
  .cancel {
    color: red;
    border-right: 1px solid #f1f4f7;
  }
}
</style>
