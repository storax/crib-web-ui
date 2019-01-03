import { Module } from 'vuex'
import { actions } from './actions'
import { mutations } from './mutations'
import { AuthState, User } from './types'
import { RootState } from '../types'

const userJson: string | null = localStorage.getItem('user')
const user: User = userJson ? JSON.parse(userJson) : {}

export const state: AuthState = user
  ? { status: { loggedIn: true }, user: user }
  : { status: {}, user: {} }

const namespaced: boolean = true

export const authentication: Module<AuthState, RootState> = {
  namespaced,
  state,
  actions,
  mutations
}
