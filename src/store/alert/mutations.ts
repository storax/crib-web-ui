import { MutationTree } from 'vuex'
import { AlertState, AlertType } from './types'

export const mutations: MutationTree<AlertState> = {
  success (state, message: string) {
    state.type = AlertType.success
    state.message = message
  },
  error (state, message: string) {
    state.type = AlertType.error
    state.message = message
  },
  clear (state) {
    state.type = null
    state.message = ''
  }
}
