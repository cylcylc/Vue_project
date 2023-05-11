<template>
  <div class="Dialog">
    <van-overlay :show="show" @click="fade">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="content">
            <div class="title"><slot name="title"></slot></div>
            <div><slot name="detail-content"></slot></div>
          </div>
          <div class="oper">
            <span class="cancel"><slot name="cancel">取消</slot></span>
            <span class="confirm"><slot name="confirm">确定</slot></span>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { reactive, toRefs, ref } from "vue";

export default {
  setup() {
    const state = reactive({
      count: 0,
      show: false,
    });
    const fade = () => {
      state.show = false;
    };
    const showDialog = () => {
      state.show = true;
    };
    return {
      ...toRefs(state),
      fade,
      showDialog,
    };
  },
};
</script>

<style lang="scss" scoped>
.Dialog {
  position: absolute;
  z-index: 1000;
}
.wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.block {
  position: relative;
  width: 320px;
  border-radius: 20px;
  background-color: #fff;
  overflow: hidden;
}
.content {
  width: 90%;
  margin: auto;
  margin-bottom: 60px;
  overflow: hidden;
  .title {
    margin-top: 25px;
    margin-bottom: 10px;
    font-size: 16px;
  }
}
.oper {
  position: absolute;
  width: 100%;
  height: 47px;
  bottom: 0px;
  display: flex;
  line-height: 47px;
  border-top: 1px solid #f1f4f7;
  span {
    display: inline-block;
    width: 50%;
    height: 100%;
    font-size: 16px;
  }
  .cancel {
    border-right: 1px solid #f1f4f7;
  }
  .confirm {
    color: #39be77;
  }
}
</style>
