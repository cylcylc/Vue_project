<script setup>
import { ref, watchEffect, onMounted, reactive } from "vue";
import sideNav from "../components/sideNav.vue";
import { useRoute, useRouter } from "vue-router";
import { profile, loginOut } from "../api/login.js";
const route = useRoute();
const router = useRouter();
const title = ref("");
const showBack = ref(false);
watchEffect(() => {
  title.value = route.meta.title;
  if (
    route.fullPath.includes("level") ||
    route.fullPath.includes("order_detail?id")
  ) {
    showBack.value = true;
  } else {
    showBack.value = false;
  }
});
const state = reactive({
  user: {},
});
onMounted(async () => {
  const { data } = await profile();
  state.user = data;
});
const back = () => {
  router.go(-1);
};
const out = async () => {
  await loginOut();
  //清除token
  localStorage.removeItem("token");
  location.reload();
  router.push("/login");
};
</script>
<template>
  <div class="indexView">
    <div class="common-layout">
      <el-container>
        <el-aside width="200px"><sideNav></sideNav></el-aside>
        <el-container>
          <el-header>
            <span class="back" v-if="showBack" @click="back"
              ><i class="iconfont icon-fanhui"></i>
            </span>
            <span>{{ title }}</span>
            <span class="user">
              <el-popover
                placement="bottom"
                :width="400"
                trigger="click"
                class="popper-user-box"
              >
                <template #reference>
                  <div>
                    <i class="iconfont icon-7"></i>&nbsp;{{
                      state.user.nickName
                    }}&nbsp;<i class="iconfont icon-xiangxia"></i>
                  </div>
                </template>
                <div class="left">
                  <span>登录名：{{ state.user.loginUserName }}</span>
                  <span>昵称：{{ state.user.nickName }}</span>
                </div>
                <div class="right">
                  <el-button type="primary" size="small" @click="out"
                    >退出</el-button
                  >
                </div>
              </el-popover>
            </span></el-header
          >
          <el-main>
            <div class="content"><router-view></router-view></div>
          </el-main>
          <el-footer
            >Copyright © 2019-2021 十三. All rights reserved.</el-footer
          >
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.indexView {
  width: 100%;
  height: 100%;
  .common-layout,
  .el-container {
    width: 100%;
    height: 100%;
    .el-aside {
      width: 200px !important;
      background-color: rgb(34, 40, 50);
      overflow: hidden;
      overflow-y: scroll;
    }
    .el-aside::-webkit-scrollbar {
      display: none;
    }
    .el-main {
      background-color: rgb(254, 254, 254);
      .content {
        width: 100%;
        height: auto;
        background-color: rgb(255, 255, 255);
        box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.1);
      }
    }
    .el-main::-webkit-scrollbar {
      display: none;
    }
    .el-header {
      border-bottom: 1px solid #e9e9e9;
      text-align: left;
      line-height: 60px;
      font-size: 20px;
      .el-header > span {
        display: inline-block;
        float: left;
      }
      .user {
        position: relative;
        display: block;
        float: right;
        font-size: 16px;
      }
    }
    .el-footer {
      border-top: 1px solid #e9e9e9;
      text-align: left;
      line-height: 60px;
    }
  }
}

.is-light {
  background: url(https://s.yezgea02.com/lingling-h5/static/account-banner-bg.png)
    50% 50% no-repeat !important;
  background-size: cover !important;
  border-radius: 0 !important;
}

.el-popper {
  div {
    float: left;
  }
  .left {
    span {
      display: block;
    }
  }
  .right {
    float: right;
    padding-right: 10px;
  }
  .right .el-button {
    background-color: rgb(38, 173, 173);
    border: 0;
    width: 40px;
    height: 25px;
    margin-left: 20px;
  }
  span {
    height: 20px;
    line-height: 20px;
    margin: 10px 10px;
    // color: rgb(255, 255, 255);
    font-size: 14px;
  }
}
.back {
  display: inline-block;
  width: 25px;
  height: 25px;
  border: 1px solid #e9e9e9;
  border-radius: 50%;
  line-height: 25px;
  text-align: center;
  margin-right: 10px;
}
</style>
