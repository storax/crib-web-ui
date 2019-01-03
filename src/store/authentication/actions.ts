import { ActionTree } from 'vuex'
import { AuthState, User } from './types'
import { RootState } from '../types'
import { userService } from '../../services'
import router from '../../router'

export const actions: ActionTree<AuthState, RootState> = {
  login ({ dispatch, commit }, { username, password }) {
    commit('loginRequest', { username })

    userService.login(username, password)
      .then(
        (user: User) => {
          commit('loginSuccess', user)
          router.push('/')
        },
        (error) => {
          commit('loginFailure')
          dispatch('alert/error', error.message, { root: true })
        })
  },
  logout ({ commit }) {
    userService.logout()
    commit('logout')
  }
}
