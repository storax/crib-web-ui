import { MutationTree } from 'vuex'
import { DirectionsState, ToWorkDuration } from './types'
import { Location } from '../properties/types'

export const mutations: MutationTree<DirectionsState> = {
  setRaster (state, raster: Location[]) {
    state.mapRaster = raster
  },
  setDurations (state, durations: ToWorkDuration[]) {
    state.toWorkDurations = durations
  },
  setColormaps (state, colormaps: string[]) {
    state.colormaps = colormaps
  },
  setColormap (state, colormap: string | null) {
    state.colormap = colormap
  },
  setMaxDuration (state, dur: number) {
    state.maxDuration = dur
  },
  setArea (state, area: any) {
    state.area = area
  }
}
