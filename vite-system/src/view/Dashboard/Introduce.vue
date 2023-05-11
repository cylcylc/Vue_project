<script setup></script>
<template>
  <div class="introduce">
    <div class="system">
      <div class="title">系统简介</div>
      <p>
        vue3-admin 是一套企业级后台管理系统，基于 Spring Boot 、Vue 3.0
        相关技术栈开发，供各位开发者们体验和学习，一定给你最好的学习体验。
      </p>
      <div class="img"><img src="../../assets/img/WechatIMG40038.png" /></div>
    </div>
    <div class="text">
      <div class="title">开发及部署文档</div>
      <div class="img">
        <img src="../../assets/img/419241616938196_.pic.jpg" />
      </div>
    </div>
    <div>
      <div class="title">技术选型</div>
      <ul>
        <li>Vue 3.x</li>
        <li>Vite 2.x</li>
        <li>Vue-Router 4.x</li>
        <li>Element-Plus（适配全新 Vue 3.x 的 PC 端组件库）</li>
        <li>Echarts 5.0</li>
        <li>axios</li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.introduce {
  padding: 20px;
  ul li {
    text-align: left;
    font-weight: 600;
  }
}
.title {
  text-align: left;
  font-weight: 650;
  margin-top: 20px;
  font-size: 20px;
}
p {
  text-align: left;
}
img {
  width: 935px;
  height: auto;
}
</style>
