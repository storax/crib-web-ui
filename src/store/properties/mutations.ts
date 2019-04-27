import Vue from 'vue'
import { MutationTree } from 'vuex'
import { PropertiesState, Property } from './types'

export const mutations: MutationTree<PropertiesState> = {
  propertyRequest (state) {
    state.gettingProperties = true
  },
  setProperties (state, properties: Property[]) {
    state.gettingProperties = false
    state.properties = properties
  },
  propertiesError (state) {
    state.gettingProperties = false
  },
  setCurrentProperty (state, property: Property) {
    state.currentProperty = property
    state.currentIndex = state.properties.indexOf(property)
  },
  nextProperty (state) {
    if (state.currentProperty) {
      const index = (state.currentIndex + 1) % state.properties.length
      const newProp = state.properties[index]
      state.currentProperty = newProp
      state.currentIndex = index
    }
  },
  prevProperty (state) {
    if (state.currentProperty) {
      const l = state.properties.length
      const index = ((((state.currentIndex - 1) % l) + l) % l)
      const newProp = state.properties[index]
      state.currentProperty = newProp
      state.currentIndex = index
    }
  },
  setShowMap (state, show: boolean) {
    state.showMap = show
  },
  setRoute (state, { property, routedata }) {
    Vue.set(property, 'toWork', routedata)
  },
  favorite (state, { property }) {
    Vue.set(property, 'favorite', !property.favorite)
  },
  ban (state, { property }) {
    Vue.set(property, 'banned', !property.banned)
  }
}
