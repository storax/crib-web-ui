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
  },
  searchArea (state) {
    const area = state.searchAreas.find(i => i.name === state.searchAreaName)
    return area ? area : {name: state.searchAreaName, geojson: { type: 'FeatureCollection', features: [] } }
  }
}
