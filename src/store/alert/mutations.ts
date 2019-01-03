import { MutationTree } from 'vuex'
import { AlertState } from './types'

export const mutations: MutationTree<AlertState> = {
  success (state, message: string) {
    state.type = 'success'
    state.message = message
  },
  error (state, message: string) {
    state.type = 'error'
    state.message = message
  },
  clear (state) {
    state.type = ''
    state.message = ''
  }
}
