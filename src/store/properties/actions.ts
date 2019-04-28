import { ActionTree } from 'vuex'
import { PropertiesState, Property, RouteData } from './types'
import { RootState } from '../types'
import { propertiesService } from '../../services'

export const actions: ActionTree<PropertiesState, RootState> = {
  getProperties ({ state, dispatch, commit }) {
    commit('propertyRequest')

    propertiesService.find(state.maxPrice)
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
  setMaxPrice ({ state, dispatch, commit }, maxPrice: number) {
    if (state.maxPrice !== maxPrice) {
      commit('setMaxPrice', maxPrice)
      dispatch('getProperties')
    }
  },
  getToWork ({ dispatch, commit }, property: Property) {
    propertiesService.toWork(property)
      .then(
        (routedata: RouteData) => {
          commit('setRoute', { property: property, routedata: routedata })
        },
        error => {
          dispatch('alert/error', error.message, { root: true })
        })
  },
  toggleMap ({ state, commit }) {
    commit('setShowMap', !state.showMap)
  },
  setCurrentProperty ({ commit }, property: Property) {
    commit('setCurrentProperty', property)
  },
  nextProperty ({ commit }) {
    commit('nextProperty')
  },
  prevProperty ({ commit }) {
    commit('prevProperty')
  },
  favorite ({ dispatch, commit }, property: Property) {
    propertiesService.favorite(property)
      .then(
        () => {
          commit('favorite', { property: property })
        },
        error => {
          dispatch('alert/error', error.message, { root: true })
        })
  },
  ban ({ dispatch, commit }, property: Property) {
    propertiesService.ban(property)
      .then(
        () => {
          commit('ban', { property: property })
        },
        error => {
          dispatch('alert/error', error.message, { root: true })
        })
  }
}
