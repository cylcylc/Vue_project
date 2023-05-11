import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import postCssPxToRem from "postcss-pxtorem"
import path from "path"
function _resolve(dir){
return path.resolve(__dirname,dir);
}

export default {
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve:{
    alias:{
      '@':_resolve('src')
    }
  },
  css:{
    postcss:{
      plugins:[
        postCssPxToRem({
          rootValue:37.5,//1rem的大小
          propList:['*'],//需要转换的属性，这里选择全部换掉
          selectorBlackList:[".norem"],//过滤掉.norem-开头的css，不进行rem转换
        })
      ]
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/styles/variables.scss";',
      }
    }
  }
};

