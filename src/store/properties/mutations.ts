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
  },
  setShowMap (state, show: boolean) {
    state.showMap = show
  }
}