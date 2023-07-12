import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import './assets/css/global.css'
import * as Icons from '@element-plus/icons-vue'
import axios from 'axios'

const app = createApp(App)
for (const i in Icons) {
  app.component(i, Icons[i])
}
app.use(router)
app.use(ElementPlus, {
  locale: zhTw
})
app.mount('#app')
// 配置請求的根路徑
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最後必須返回config
  return config
})
app.config.globalProperties.$http = axios
