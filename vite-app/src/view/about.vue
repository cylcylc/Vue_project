<template>
  <div class="about">
    <Header>
      <template v-slot:back
        ><span @click="back" class="backLogin"
          ><van-icon name="arrow-left" />返回</span
        >
      </template>
      <template v-slot:title>关于我们</template>
    </Header>
    <div class="content">
      <van-divider
        content-position="left"
        :style="{ color: 'rgb(57,190,119)', borderColor: 'rgb(57,190,119)' }"
      >
        关于作者</van-divider
      >
      <p>
        大家好，我是本次实验的作者儒雅的曹曹曹，目前学习前端一年，目前在河南科技学院就读大学三年级
      </p>
      <van-divider
        content-position="left"
        :style="{ color: 'rgb(57,190,119)', borderColor: 'rgb(57,190,119)' }"
        >关于课程</van-divider
      >
      <p>
        课程中使用到的技术包括Vite构建项目，flexible移动端适配，Vant3.x组件库，Vue-Router4.x路由插件。Ehcarts
        5.x图表等插件
      </p>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import Header from "../components/Header.vue";
import { useRouter } from "vue-router";

export default {
  components: {
    Header,
  },
  setup() {
    const state = reactive({
      count: 0,
    });
    const router = useRouter();
    const back = () => {
      router.push("/user");
    };
    return {
      ...toRefs(state),
      back,
    };
  },
};
</script>

<style lang="scss" scoped>
.about {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(255, 255, 255);
}
.backLogin {
  display: inline-block;
  padding-left: 10px;
}
.content {
  width: 90%;
  margin: 47px auto;
  padding-top: 10px;
  p {
    text-align: left;
    font-size: 14px;
    color: #969696;
  }
}
</style>
