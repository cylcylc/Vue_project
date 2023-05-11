<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 300px; overflow-y: hidden; text-align: left"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
      />
    </div>
  </div>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css";
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  reactive,
  toRefs,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default {
  components: { Editor, Toolbar },
  props: ["goodsDetailContent"],
  setup(props) {
    // 编辑器实例，必须用 shallowRef，重要！
    const editorRef = shallowRef();

    // 内容 HTML
    const state = reactive({
      valueHtml: "",
    });
    const toolbarConfig = {};
    const editorConfig = { placeholder: "请输入内容..." };
    // 组件销毁时，也及时销毁编辑器，重要！
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    // 编辑器回调函数
    const handleCreated = (editor) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
      setTimeout(() => {
        //测试handleCreated执行快于props.goodsDetailContent得到值，所有加个定时器，保证执行时能获取到值
        editor.setHtml(props.goodsDetailContent);
      }, 150);
    };
    const handleChange = (editor) => {};
    const handleDestroyed = (editor) => {};
    return {
      editorRef,
      mode: "default",
      ...toRefs(state),
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChange,
      handleDestroyed,
    };
  },
};
</script>
