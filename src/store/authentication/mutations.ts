import { MutationTree } from 'vuex'
import { AuthState, User } from './types'

export const mutations: MutationTree<AuthState> = {
  loginRequest (state, user: User) {
    state.status = { loggingIn: true }
    state.user = user
  },
  loginSuccess (state, user: User) {
    state.status = { loggedIn: true }
    state.user = user
  },
  loginFailure (state) {
    state.status = {}
    state.user = {}
  },
  logout (state) {
    state.status = {}
    state.user = {}
  }
}
