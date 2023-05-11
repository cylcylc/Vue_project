<script setup>
import { onMounted, reactive, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const openeds = ["1", "2", "3", "4"];
const handleOpen = (key, keyPath) => {
  //   console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  //   console.log(key, keyPath);
};
const state = reactive({
  fullPath: "",
});
watchEffect(() => {
  //保证刷新后侧边栏激活状态还是原位置
  state.fullPath = route.fullPath;
});
</script>
<template>
  <div class="sideNav">
    <el-menu
      active-text-color="rgb(27,174,174)"
      background-color="rgb(34,40,50)"
      class="el-menu-vertical-demo"
      :default-active="state.fullPath"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
      :default-openeds="openeds"
      router
    >
      <header><img src="../assets/img/logo(1).png" /></header>
      <el-sub-menu index="1">
        <template #title>
          <span>Dashboard </span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/introduce"
            ><i class="iconfont icon-xitongguanli"></i>系统介绍</el-menu-item
          >
          <el-menu-item index="/dashboard"
            ><i class="iconfont icon-suduspeed8"></i>Dashboard</el-menu-item
          >
          <el-menu-item index="/add"
            ><i class="iconfont icon-tianjia"></i>添加商品</el-menu-item
          >
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <span>首页配置</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/swiper"
            ><i class="iconfont icon-tupian"></i>轮播图配置</el-menu-item
          >
          <el-menu-item index="/hot"
            ><i class="iconfont icon-shoucang"></i>热销商品配置</el-menu-item
          >
          <el-menu-item index="/new"
            ><i class="iconfont icon-xinpin"></i>新品上线配置</el-menu-item
          >
          <el-menu-item index="/recommend"
            ><i class="iconfont icon-tuijian"></i>为你推荐配置</el-menu-item
          >
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <span>模块管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/category"
            ><i class="iconfont icon-yingyongzhongxin"></i
            >分类管理</el-menu-item
          >
          <el-menu-item index="/good"
            ><i class="iconfont icon-shangpin"></i>商品管理</el-menu-item
          >
          <el-menu-item index="/guest"
            ><i class="iconfont icon-7"></i>会员管理</el-menu-item
          >
          <el-menu-item index="/order"
            ><i class="iconfont icon-dingdan"></i>订单管理</el-menu-item
          >
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="4">
        <template #title>
          <span>系统管理 </span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/account"
            ><i class="iconfont icon-mima"></i>修改密码</el-menu-item
          >
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>
<style lang="scss" scoped>
.sideNav {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  //   overflow-y: scroll;
}
header {
  width: 100%;
  height: 70px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  img {
    width: 80%;
    height: auto;
  }
}
.el-menu {
  width: 100%;
  height: 100%;
  .el-sub-menu {
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    .iconfont {
      padding-right: 10px;
    }
  }
}
</style>
