<template>
  <div class="login">
    <Header>
      <template v-slot:back
        ><span @click="back" class="backLogin"
          ><van-icon name="arrow-left" />返回</span
        >
      </template>
      <template v-slot:title>{{ isLogin ? "登录" : "注册" }}</template>
    </Header>
    <div class="logo"><img src="../assets/img/note.75134fb0.svg" alt="" /></div>
    <div class="form">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="账号"
            label="账号"
            placeholder="请输入账号"
            :rules="[{ required: true, message: '请填写账号' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
            v-model="verify"
            type="password"
            name="验证码"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请填写验证码' }]"
            v-if="!isLogin"
          >
            <template #button>
              <ImageVerify ref="verifyRef"></ImageVerify>
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            {{ isLogin ? "登录" : "注册" }}
          </van-button>
        </div>
        <div class="tip" @click="register">
          <span>{{ isLogin ? "没有账号,前往注册" : "登录已有账号" }}</span>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from "vue";
import Header from "../components/Header.vue";
import { login, registerd } from "../api/login.js";
import { useRouter } from "vue-router";
import ImageVerify from "../components/VueImageVerify.vue";
import { Toast } from "vant";
export default {
  name: "login",
  components: {
    Header,
    ImageVerify,
  },
  setup() {
    const router = useRouter();
    const verifyRef = ref(null);
    const form = reactive({
      username: "",
      password: "",
      verify: "",
      imgCode: "",
    });
    const isLogin = ref(true);
    const register = () => {
      isLogin.value = !isLogin.value;
      console.log(verifyRef.value);
    };
    const onSubmit = async () => {
      if (isLogin.value) {
        const { data } = await login({
          password: form.password,
          username: form.username,
        });
        //存储token
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        form.imgCode = verifyRef.value.imgCode || "";
        console.log(verifyRef.value.imgCode, 234);
        if (form.imgCode != form.verify) {
          Toast.fail("验证码错误");
        } else {
          const { data } = await registerd({
            password: form.password,
            username: form.username,
          });
          isLogin.value = true;
        }
      }
    };
    const back = () => {
      if (!isLogin.value) {
        isLogin.value = true;
      }
      window.history.go(-1);
    };
    return {
      ...toRefs(form),
      onSubmit,
      isLogin,
      register,
      back,
      verifyRef,
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  overflow: hidden;
}
.logo {
  width: 120px;
  height: auto;
  margin: auto;
  margin-top: 90px;
}
.form {
  margin-top: 20px;
}
.tip {
  font-size: 14px;
  color: rgb(25, 137, 250);
}
.backLogin {
  padding: 10px;
}
</style>
