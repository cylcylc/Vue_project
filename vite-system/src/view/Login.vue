<template>
  <div class="login">
    <div class="content">
      <div class="logo">
        <img src="../assets/img/logo(1).png" />
        <h2>千纸鹤商城</h2>
      </div>
      <div class="form">
        <el-form
          ref="formRef"
          :model="form"
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item
            label="账号"
            prop="name"
            :rules="[{ required: true, message: '账号不能为空' }]"
          >
            <el-input
              v-model="form.name"
              type="text"
              autocomplete="off"
              size="large"
            />
          </el-form-item>
          <el-form-item
            label="密码"
            prop="passwordMd5"
            :rules="[{ required: true, message: '密码不能为空' }]"
          >
            <el-input
              v-model="form.passwordMd5"
              type="password"
              autocomplete="off"
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <div>登录表示您已同意<span class="active">《服务条款》</span></div>
            <el-button type="primary" @click="submitForm(formRef)" size="large"
              >立即登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { login, profile } from "../api/login.js";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import md5 from "js-md5";
const form = reactive({
  name: "admin",
  passwordMd5: "123456",
});
const formRef = ref(null);
const checked1 = ref(false);
const router = useRouter();
onMounted(async () => {
  await profile();
});
const submitForm = () => {
  if (!formRef) return;
  formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await login({
        userName: form.name,
        passwordMd5: md5(form.passwordMd5),
      });
      localStorage.setItem("token", res.data);
      ElMessage.success("登录成功");
      router.push("/");
      //通过校验
    } else {
      return false;
    }
  });
};
</script>
<style lang="scss" scoped>
.login {
  position: absolute;
  width: 425px;
  height: 500px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 15px 20px 10px rgb(0, 0, 0, 0.1);
  .content {
    .logo {
      margin-top: 20px;
      h2 {
        color: rgb(27, 174, 174);
        text-shadow: 0px 10px 10px;
      }
    }
    .form {
      width: 70%;
      margin: auto;
      .el-input {
        --el-input-focus-border-color: rgb(27, 174, 174);
      }
      .el-button {
        width: 100%;
        background-color: rgb(27, 174, 174);
        border: 0;
        margin: 5px 0px;
      }
      .active {
        color: rgb(27, 174, 174);
      }
    }
  }
}
</style>
