import { ActionTree } from 'vuex'
import { AlertState } from './types'
import { RootState } from '../types'

export const actions: ActionTree<AlertState, RootState> = {
  success ({ commit }, message: string) {
    commit('success', message)
  },
  error ({ commit }, message: string) {
    commit('error', message)
  },
  clear ({ commit }) {
    commit('clear')
  }
}
