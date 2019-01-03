import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { RootState } from './types'
import { alert } from './alert'
import { authentication } from './authentication'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  modules: {
    alert,
    authentication
  }
}

export default new Vuex.Store<RootState>(store)
