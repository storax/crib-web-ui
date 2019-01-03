import Vue from 'vue'
import Router from 'vue-router'

import LoginPage from '../components/login/LoginPage.vue'
import PropertyViewer from '../components/propViewer/PropertyViewer.vue'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/',
    component: PropertyViewer
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new Router({ routes })

export default router

// router.beforeEach((to, _from, next) => {
//   const publicPages: string[] = ['/login']
//   const authRequired: boolean = !publicPages.includes(to.path)
//   const user = localStorage.getItem('user')
//   if (authRequired && !user) {
//     return next('/login')
//   }

//   next()
// })
