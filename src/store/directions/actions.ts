import { ActionTree } from 'vuex'
import { DirectionsState, ToWorkData } from './types'
import { Location } from '../properties/types'
import { RootState } from '../types'
import { propertiesService } from '../../services'

export const actions: ActionTree<DirectionsState, RootState> = {
  getMapRaster ({ dispatch, commit }) {
    propertiesService.rasterMap()
      .then(
        (raster: Location[]) => {
          commit('setRaster', raster)
        },
        error => {
          dispatch('alert/error', error.message, { root: true })
        })
  },
  getToWorkDurations ({ dispatch, commit }) {
    propertiesService.toWorkDurations()
      .then(
        (durations: ToWorkData) => {
          commit('setDurations', durations)
        },
        error => {
          dispatch('alert/error', error.message, { root: true })
        }
      )
  }
}
