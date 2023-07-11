import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 掛載路由導航守衛
router.beforeEach((to, from, next) => {
  // to 將要訪問的路徑
  // from 從哪個路徑跳轉而來
  // next 是一個函數,表示放行
  if (to.path === '/login') return next()
  // 獲取token
  const tokenSrt = window.sessionStorage.getItem('token')
  if (!tokenSrt) return next('/login')
  next()
})

export default router
