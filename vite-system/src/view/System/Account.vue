<template>
  <div class="password">
    <el-card>
      <el-form
        ref="formRef"
        :model="state.form"
        label-width="120px"
        class="demo-dynamic"
      >
        <el-form-item
          prop="loginUserName"
          label="登录名"
          :rules="[
            {
              required: true,
              message: '请输入登录名',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="state.form.loginUserName" size="large" />
        </el-form-item>

        <el-form-item
          prop="nickName"
          label="昵称"
          :rules="[
            {
              required: true,
              message: '请输入昵称',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="state.form.nickName" size="large" />
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="updateName">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-form
        ref="ruleRef"
        :model="state.passwordForm"
        label-width="120px"
        class="demo-dynamic"
      >
        <el-form-item
          prop="oldPass"
          label="原密码"
          :rules="[
            {
              required: true,
              message: '请输入原密码',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="state.passwordForm.oldPass" size="large" />
        </el-form-item>
        <el-form-item
          prop="newPass"
          label="新密码"
          :rules="{
            required: true,
            message: '请输入新密码',
            trigger: 'blur',
          }"
        >
          <el-input v-model="state.passwordForm.newPass" size="large" />
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="updatePass">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref } from "vue";
import { profile } from "../../api/login.js";
import { name, password } from "../../api/account.js";
import md5 from "js-md5";
const state = reactive({
  form: { nickName: "", loginUserName: "" },
  passwordForm: {
    oldPass: "",
    newPass: "",
  },
});
onMounted(async () => {
  const { data } = await profile();
  state.form.nickName = data.nickName;
  state.form.loginUserName = data.loginUserName;
});
const formRef = ref(null);
const updateName = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await name(state.form);
    }
  });
};
const ruleRef = ref(null);
const updatePass = async () => {
  ruleRef.value.validate(async (valid) => {
    if (valid) {
      await password({
        newPassword: md5(state.passwordForm.oldPass),
        originalPassword: md5(state.passwordForm.newPass),
      });
    }
  });
};
</script>
<style lang="scss" scoped>
.password {
  position: absolute;
  //   width: 100%;
}
.el-card {
  margin-bottom: 20px;
}
.el-input {
  width: 200px !important;
}
</style>
