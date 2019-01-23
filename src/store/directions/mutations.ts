import { MutationTree } from 'vuex'
import { DirectionsState, ToWorkDuration } from './types'
import { Location } from '../properties/types'

export const mutations: MutationTree<DirectionsState> = {
  setRaster (state, raster: Location[]) {
    state.mapRaster = raster
  },
  setDurations (state, durations: ToWorkDuration[]) {
    state.toWorkDurations = durations
  }
}
