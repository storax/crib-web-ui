import { Location } from '../properties/types'

export interface ToWorkData {
  durations: ToWorkDuration[],
  minDuration: number,
  maxDuration: number
}
export interface ToWorkDuration {
  location: Location,
  duration: number,
}

export interface DirectionsState {
  mapRaster: Location[],
  toWorkDurations: ToWorkData
}
