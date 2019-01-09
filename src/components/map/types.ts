export interface LatLng {
  lng: number,
  lat: number
}

export interface Duration {
  value: number,
  text: string
}

export interface Distance {
  value: number,
  text: string
}

export enum TravelMode {
  WALKING = 'WALKING',
  DRIVING = 'DRIVING',
  TRANSIT = 'TRANSIT'
}

export interface Vehicle {
  type: string
  name: string
  icon: string
}

export interface Line {
  vehicle: Vehicle
  text_color: string
  color: string
  short_name: string
}

export interface TransitDetails {
  num_stops: number
  line: Line
}

export interface Step {
  html_instructions: string
  polyline: Polyline
  travel_mode: TravelMode
  start_location: LatLng
  end_location: LatLng
  duration: Duration
  distance: Distance
  transit_details?: TransitDetails
}

export interface Leg {
  steps: Step[]
  duration: Duration
}

export interface Polyline {
  points: string
}

export interface RouteData {
  overview_polyline: Polyline
  legs: Leg[]
}

export interface DirectionsData {
  status: string
  routes: RouteData[]
}

export type Waypoint = [number, number]
