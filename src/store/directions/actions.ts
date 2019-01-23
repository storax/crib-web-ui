import { ActionTree } from 'vuex'
import { DirectionsState, ToWorkDuration } from './types'
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
        (durations: ToWorkDuration[]) => {
          commit('setDurations', durations)
        },
        error => {
          dispatch('alert/error', error.message, { root: true })
        }
      )
  }
}
