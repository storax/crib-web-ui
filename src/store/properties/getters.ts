import { GetterTree } from 'vuex'
import { PropertiesState, Property } from './types'
import { RootState } from '../types'

export const getters: GetterTree<PropertiesState, RootState> = {
  count (state) {
    return state.properties.length
  },
  isCurrentProperty (state) {
    return (property: Property) => {
      const { currentProperty } = state
      return currentProperty ? (currentProperty.id === property.id) : false
    }
  }
}
