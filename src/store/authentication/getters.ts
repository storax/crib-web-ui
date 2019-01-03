import { GetterTree } from 'vuex'
import { AuthState } from './types'
import { RootState } from '../types'

export const getters: GetterTree<AuthState, RootState> = {
  username (state): string {
    const { user } = state
    return user.username ? user.username : ''
  },
  loggedIn (state): boolean {
    const { status } = state
    return !!status.loggedIn
  },
  loggingIn (state): boolean {
    const { status } = state
    return !!status.loggingIn
  }
}
