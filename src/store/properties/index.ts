import { Module } from 'vuex'
import { actions } from './actions'
import { mutations } from './mutations'
import { PropertiesState } from './types'
import { RootState } from '../types'

export const state: PropertiesState = {
  gettingProperties: false,
  properties: []
}

const namespaced: boolean = true

export const properties: Module<PropertiesState, RootState> = {
  namespaced,
  state,
  actions,
  mutations
}
