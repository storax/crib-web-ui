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
  getToWorkDurations ({ dispatch, commit, state }) {
    if (state.colormap) {
      propertiesService.toWorkDurations(state.colormap, state.maxDuration)
        .then(
          (durations: ToWorkDuration[]) => {
            commit('setDurations', durations)
          },
          error => {
            dispatch('alert/error', error.message, { root: true })
          }
        )
    }
  },
  getColormaps ({ dispatch, commit }) {
    propertiesService.colormaps()
      .then(
        (colormaps: string[]) => {
          commit('setColormaps', colormaps)
          commit('setColormap', colormaps[0])
        },
        error => {
          dispatch('alert/error', error.message, { root: true })
        }
      )
  },
  getArea ({ dispatch, commit, state }) {
    propertiesService.get_area(state.maxDuration)
      .then(
        (data: any) => {commit('setArea', data)},
        error => {
          dispatch('alert/error', error.message, { root: true })
        }
      )
  }
}
