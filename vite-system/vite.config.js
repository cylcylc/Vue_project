import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
function _resolve(dir){
  return path.resolve(__dirname,dir);
  }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css:{
    preprocessorOptions: {
      scss: {
          // 引入 variables.scss 这样就可以在全局中使用 variables.scss中预定义的变量了
        additionalData: '@import "./src/assets/css/variables.scss";',
      }
    }
},
alias:{
  '@':_resolve('src')
},
server: {
  //解决跨域问题
  proxy: {
    '/manage-api': {
      target: 'http://backend-api-02.newbee.ltd',
      changeOrigin: true,
      pathRewrite: {
        '^/manage-api': 'manage-api'
      }
    }
  }
},
})
