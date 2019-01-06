import { ActionTree } from 'vuex'
import { PropertiesState, Property } from './types'
import { RootState } from '../types'
import { propertiesService } from '../../services'

export const actions: ActionTree<PropertiesState, RootState> = {
  getProperties ({ state, dispatch, commit }) {
    commit('propertyRequest')

    propertiesService.find()
      .then(
        (properties: Property[]) => {
          commit('setProperties', properties)
          if (!state.currentProperty && properties) {
            commit('setCurrentProperty', properties[0])
          }
        },
        error => {
          commit('propertiesError', error)
          dispatch('alert/error', error.message, { root: true })
        })
  },
  toggleMap ({ state, commit }) {
    commit('setShowMap', !state.showMap)
  },
  setCurrentProperty ({ commit }, property: Property) {
    commit('setCurrentProperty', property)
  }
}
