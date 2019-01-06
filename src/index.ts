import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { L } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

import App from './app.vue'
import router from './router'
import store from './store'

Vue.use(Vuetify)

// this part resolve an issue where the markers would not appear
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})


const app = new Vue({
  router,
  store,
  render: h => h(App),
  el: 'app',
  components: {
    App
  }
})
