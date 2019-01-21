import { MutationTree } from 'vuex'
import { DirectionsState, ToWorkData } from './types'
import { Location } from '../properties/types'

export const mutations: MutationTree<DirectionsState> = {
  setRaster (state, raster: Location[]) {
    state.mapRaster = raster
  },
  setDurations (state, durations: ToWorkData) {
    state.toWorkDurations = durations
  }
}
