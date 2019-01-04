import { ActionTree } from 'vuex'
import { PropertiesState, Property } from './types'
import { RootState } from '../types'
import { propertiesService } from '../../services'

export const actions: ActionTree<PropertiesState, RootState> = {
  getProperties ({ dispatch, commit }) {
    commit('propertyRequest')

    propertiesService.find()
      .then(
        (properties: Property[]) => {
          commit('setProperties', properties)
        },
        error => {
          commit('propertiesError', error)
          dispatch('alert/error', error.message, { root: true })
        }
      )
  }
}
