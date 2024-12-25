import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { createPinia } from 'pinia'

import '@unocss/reset/tailwind.css'
import '~/static/styles/main.css'
import 'uno.css'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
})
app.use(router)
app.mount('#root')