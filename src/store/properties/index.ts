import { Module } from 'vuex'
import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { PropertiesState } from './types'
import { RootState } from '../types'

export const state: PropertiesState = {
  gettingProperties: false,
  properties: [],
  currentProperty: null,
  currentIndex: 0,
  showMap: true
}

const namespaced: boolean = true

export const properties: Module<PropertiesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
