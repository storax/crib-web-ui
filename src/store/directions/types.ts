import { Location } from '../properties/types'

export interface ToWorkDuration {
  location: Location,
  duration: string,
  color: string,
  durationValue: number,
}

export interface DirectionsState {
  mapRaster: Location[],
  toWorkDurations: ToWorkDuration[],
  colormap: string | null,
  colormaps: string[],
  maxDuration: number,
}
