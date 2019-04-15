import { Module } from 'vuex'
import { actions } from './actions'
import { mutations } from './mutations'
import { DirectionsState } from './types'
import { RootState } from '../types'

export const state: DirectionsState = {
  mapRaster: [],
  toWorkDurations: [],
  colormap: null,
  colormaps: [],
  maxDuration: 3000
}

const namespaced: boolean = true

export const directions: Module<DirectionsState, RootState> = {
  namespaced,
  state,
  actions,
  mutations
}
