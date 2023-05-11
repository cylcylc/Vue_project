<template>
  <div class="user">
    <div class="title">
      <div class="img"><img src="../assets/img/yyqx.png" /></div>
      <div class="userMessage">
        <span class="name">{{ userMessage.username }}</span>
        <span class="signature"> 个性签名:{{ userMessage.signature }}</span>
      </div>
    </div>
    <div class="content">
      <van-list>
        <van-cell @click="Modify">
          <div class="list-item">
            <div><i class="iconfont icon-xiugai"></i>&nbsp;修改个性签名</div>
            <div><van-icon name="arrow" /></div>
          </div>
        </van-cell>
        <van-cell>
          <div class="list-item" @click="account">
            <div><i class="iconfont icon-shezhi"></i>&nbsp;账户安全</div>
            <div><van-icon name="arrow" /></div>
          </div>
        </van-cell>
        <van-cell>
          <div class="list-item" @click="grade">
            <div><i class="iconfont icon-dianzan"></i>&nbsp;软件评分</div>
            <div><van-icon name="arrow" /></div>
          </div>
        </van-cell>
        <van-cell>
          <div class="list-item" @click="about">
            <div><i class="iconfont icon-xiaolian"></i>&nbsp;关于我们</div>
            <div><van-icon name="arrow" /></div>
          </div>
        </van-cell>
      </van-list>
    </div>
    <DialogBill ref="dialog" v-if="isSignature">
      <template v-slot:title>个性签名</template>
      <template v-slot:detail-content>
        <van-field
          v-model="signature"
          placeholder="请输入个性签名"
          rows="2"
          autosize
          type="textarea"
          maxlength="20"
          show-word-limit
      /></template>
      <template v-slot:cancel>
        <div @click="cancel">取消</div>
      </template>
      <template v-slot:confirm>
        <div @click="confirm">确定</div>
      </template>
    </DialogBill>
    <DialogBill ref="dialog" v-else>
      <template v-slot:title>软件评分</template>
      <template v-slot:detail-content
        ><van-rate v-model="rate_value" allow-half
      /></template>
      <template v-slot:cancel>
        <div @click="cancel">取消</div>
      </template>
      <template v-slot:confirm>
        <div @click="confirm">确定</div>
      </template>
    </DialogBill>
  </div>
</template>
<script>
import { reactive, toRefs, onMounted, ref } from "vue";
import { userinfo, modify } from "../api/user";
import DialogBill from "../components/DialogBill.vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
export default {
  name: "user",
  components: {
    DialogBill,
  },
  setup() {
    const state = reactive({
      userMessage: {},
      show: false,
      signature: "",
      isSignature: true,
      rate_value: 3.5,
    });
    onMounted(async () => {
      getMessage();
    });
    const getMessage = async () => {
      const res = await userinfo();
      state.userMessage = res.data;
    };
    const dialog = ref(null);
    const Modify = () => {
      state.signature = state.userMessage.signature;
      state.isSignature = true;
      dialog.value.showDialog();
      Toast.success("修改成功");
    };
    //账户安全
    const router = useRouter();
    const account = () => {
      router.push("/account");
    };
    //评分
    const grade = () => {
      state.isSignature = false;
      dialog.value.showDialog();
    };
    //关于我们
    const about = () => {
      router.push("/about");
    };
    const cancel = () => {
      dialog.value.fade();
    };
    const confirm = async () => {
      dialog.value.fade();
      if (state.isSignature) {
        const res = await modify({ signature: state.signature });
        getMessage();
      }
    };

    return {
      ...toRefs(state),
      Modify,
      dialog,
      cancel,
      confirm,
      account,
      grade,
      about,
    };
  },
};
</script>
<style lang="scss" scoped>
.user {
  width: 93%;
  margin: auto;
  overflow: hidden;
}
.title {
  display: flex;
  width: 100%;
  height: 75px;
  margin-top: 15px;
  background-color: rgb(108, 201, 152);
  border-radius: 5px;
  overflow: hidden;
  div {
    height: 50px;
    line-height: 40px;
    margin: 10px 10px;
  }
  .img {
    width: 50px;
    height: 50px;

    border-radius: 50%;
    border: 3px solid white;
    overflow: hidden;
    img {
      width: 100%;
      height: auto;
    }
  }
  .userMessage {
    span {
      display: block;
      height: 25px;
    }
    .name {
      text-align: left;
      font-size: 18px;
      color: white;
      font-weight: 540;
    }
    .signature {
      height: 10px;
      line-height: 10px;
      border-radius: 10px;
      margin-top: 10px;
      padding: 5px 10px;
      color: white;
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}
.content {
  margin-top: 10px;
  .list-item {
    display: flex;
    justify-content: space-between;
  }
}
</style>
