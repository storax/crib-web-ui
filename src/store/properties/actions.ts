import { ActionTree } from 'vuex'
import { PropertiesState, Property, RouteData, SearchArea } from './types'
import { RootState } from '../types'
import { propertiesService } from '../../services'

export const actions: ActionTree<PropertiesState, RootState> = {
  getProperties ({ state, dispatch, commit, getters, rootState }) {
    commit('propertyRequest')

    propertiesService.find(state.maxPrice, rootState.directions.maxDuration, state.onlyFavorite, getters.searchArea.geojson)
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
  toggleDetails ({ state, commit }) {
    commit('setShowDetails', !state.showDetails)
  },
  toggleList ({ state, commit }) {
    commit('setShowList', !state.showList)
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
  },
  getSearchAreas ({ dispatch, commit }) {
    propertiesService.searchAreas()
      .then(
        (searchAreas: SearchArea[]) => {
          commit('setSearchAreas', searchAreas || [])
        },
        error => {
          dispatch('alert/error', error.message, { root: true })
        })
  },
  setSearchArea ({ dispatch, commit }, searcharea) {
    commit('setSearchArea', searcharea)
    dispatch('getProperties')
    propertiesService.saveSearchArea(searcharea.name, searcharea.geojson)
      .then(
        () => {},
        error => {
          dispatch('alert/error', error.message, { root: true })
        })
  }
}
