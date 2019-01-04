import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { RootState } from './types'
import { alert } from './alert'
import { authentication } from './authentication'
import { properties } from './properties'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  modules: {
    alert,
    authentication,
    properties
  }
}

export default new Vuex.Store<RootState>(store)
