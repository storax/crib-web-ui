import Vue from 'vue'
import Router from 'vue-router'

import LoginPage from '../components/login/LoginPage.vue'
import PropertyMapViewer from '../components/propViewer/PropertyMapViewer.vue'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/map',
    component: PropertyMapViewer
  },
  {
    path: '*',
    redirect: '/map'
  }
]

const router = new Router({ routes })

export default router

router.beforeEach((to, _from, next) => {
  const publicPages: string[] = ['/login']
  const authRequired: boolean = !publicPages.includes(to.path)
  const user = localStorage.getItem('user')
  if (authRequired && !user) {
    return next('/login')
  }

  next()
})
