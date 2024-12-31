import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

// 创建Vue应用实例
const app = createApp(App)

// 配置axios默认值
axios.defaults.baseURL = 'http://192.168.1.5:3000'  // 修改为你的服务器IP
app.config.globalProperties.$http = axios

// 挂载应用
app.mount('#app') 