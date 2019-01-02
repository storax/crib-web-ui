import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './app.vue'
import router from './router'
import store from './store'

Vue.use(Vuetify)

const app = new Vue({
  router,
  store,
  render: h => h(App),
  el: 'app',
  components: {
    App
  }
})
