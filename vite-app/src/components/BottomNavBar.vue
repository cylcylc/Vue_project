<template>
  <div class="bottomNavBar">
    <van-tabbar v-model="active" @change="onChange" active-color="#39be77">
      <van-tabbar-item icon="notes-o" @click="link('/home')"
        >明细</van-tabbar-item
      >
      <van-tabbar-item icon="bar-chart-o" @click="link('/statistics')"
        >统计</van-tabbar-item
      >
      <van-tabbar-item icon="user-o" @click="link('/user')"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted, watchEffect, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  name: "BottomNavBar",
  setup() {
    const active = ref(0);
    const router = useRouter();
    const route = useRoute();
    const onChange = (index) => {};
    watchEffect(() => {
      if (route.path === "/home") {
        active.value = 0;
      }
      if (route.path === "/statistics") {
        active.value = 1;
      }
      if (route.path === "/user") {
        active.value = 2;
      }
    });
    const link = (path) => {
      router.push({ path });
    };
    return {
      onChange,
      active,
      link,
    };
  },
};
</script>

<style lang="scss" scoped></style>
