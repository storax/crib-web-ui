import { Module } from 'vuex'
import { actions } from './actions'
import { mutations } from './mutations'
import { AlertState } from './types'
import { RootState } from '../types'

export const state: AlertState = {
  type: null,
  message: ''
}

const namespaced: boolean = true

export const alert: Module<AlertState, RootState> = {
  namespaced,
  state,
  actions,
  mutations
}
