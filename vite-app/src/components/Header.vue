<template>
  <div class="header">
    <div class="back"><slot name="back"></slot></div>
    <div class="title"><slot name="title"></slot></div>
    <div class="more"><i class="iconfont icon-gengduo1"></i></div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Header",
  setup() {
    const state = reactive({
      count: 0,
    });
    const router = useRouter();

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  // prettier-ignore
  height: 45PX;
  position: fixed;
  display: flex;
  top: 0px;
  left: 0px;
  justify-content: space-between;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}
.header div {
  width: 33%;
  text-align: center;
  line-height: 45px;
  font-size: 16px;
}
.header .back {
  text-align: left;
  font-size: 14px;
  color: rgb(25, 137, 250);
}
.header .more {
  text-align: right;
}
.icon-gengduo1 {
  padding-right: 17px;
  font-size: 25px;
}
.van-icon-arrow-left {
  padding-left: 17px;
}
</style>
