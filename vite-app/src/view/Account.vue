<template>
  <div class="account">
    <Header>
      <template v-slot:back
        ><span @click="back" class="backLogin"
          ><van-icon name="arrow-left" />返回</span
        >
      </template>
      <template v-slot:title>账户安全</template>
    </Header>
    <div class="password" @click="modify">
      <van-cell title="密码修改" is-link />
    </div>
    <div class="button" @click="quit">
      <van-button type="success" block>退出登录</van-button>
    </div>
    <DialogBill ref="dialog">
      <template v-slot:title>修改密码</template>
      <template v-slot:detail-content>
        <van-form ref="form">
          <van-cell-group inset>
            <van-field
              v-model="old_pass"
              type="password"
              name="原密码"
              label="原密码"
              placeholder="请填写原密码"
              :rules="[{ required: true, message: '请填写原密码' }]"
            />
            <van-field
              v-model="new_pass"
              type="password"
              name="新密码"
              label="新密码"
              placeholder="请填写新密码"
              :rules="[{ required: true, message: '请填写新密码' }]"
            />
            <van-field
              v-model="new_pass2"
              type="password"
              name="确认密码"
              label="确认密码"
              placeholder="再次确定密码"
              :rules="[
                {
                  message: '请填写确定密码',
                  require: true,
                },
              ]"
            />
          </van-cell-group>
        </van-form>
      </template>
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
import { onMounted, reactive, toRefs, ref } from "vue";
import DialogBill from "../components/DialogBill.vue";
import Header from "../components/Header.vue";
import { Toast } from "vant";
import { modify_pass } from "../api/user.js";
import { useRouter } from "vue-router";
export default {
  name: "account",
  components: {
    DialogBill,
    Header,
  },
  setup() {
    const state = reactive({
      count: 0,
      signature: "",
    });
    const form = reactive({
      old_pass: "",
      new_pass: "",
      new_pass2: "",
    });
    const show = ref(true);
    onMounted(() => {});
    const dialog = ref(null);
    const modify = () => {
      dialog.value.showDialog();
    };

    const confirm = async () => {
      if (form.new_pass === form.new_pass2) {
        const res = await modify_pass(form);
        Toast.success("修改成功");
        dialog.value.fade();
      } else {
        Toast.fail("两次密码不相同");
      }
      //清空
      form.new_pass = "";
      form.old_pass = "";
      form.new_pass2 = "";
    };
    const cancel = () => {
      dialog.value.fade();
      //清空
      form.new_pass = "";
      form.old_pass = "";
      form.new_pass2 = "";
    };
    //返回
    const router = useRouter();
    const back = () => {
      console.log("123");
      router.go(-1);
    };
    const quit = () => {
      router.push("/login");
    };
    return {
      ...toRefs(state),
      ...toRefs(form),
      show,
      modify,
      dialog,
      confirm,
      cancel,
      back,
      quit,
    };
  },
};
</script>

<style lang="scss" scoped>
.account {
  overflow: hidden;
}
.backLogin {
  display: inline-block;
  padding-left: 10px;
}
.password {
  margin-top: 46px;
  text-align: left;
}
.button {
  width: 90%;
  margin: auto;
  margin-top: 10px;
}
</style>
