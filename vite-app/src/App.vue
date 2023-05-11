<script setup>
import BottomNavBar from "./components/BottomNavBar.vue";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const state = reactive({
  menu: ["/home", "/statistics", "/user"],
  show: false,
});
router.afterEach(() => {
  state.show = state.menu.includes(router.currentRoute.value.path);
});
</script>
<template>
  <div class="app">
    <router-view></router-view>
    <BottomNavBar v-if="state.show"></BottomNavBar>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgb(245, 245, 245);
  overflow: auto;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
