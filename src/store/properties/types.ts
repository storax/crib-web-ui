export interface PropertiesState {
  gettingProperties: boolean
  properties: Property[]
  currentProperty: Property | null
  currentIndex: number
  showMap: boolean
  maxPrice: number
}

export interface Price {
  amount: number
  frequency: string
  currencyCode: string
}

export interface Location {
  latitude: number
  longitude: number
}

export interface Property {
  id: string
  price: Price
  location: Location
  toWork: RouteData | null
  banned: boolean
  favorite: boolean
}

export interface LatLng {
  lng: number
  lat: number
}

export interface Duration {
  value: number
  text: string
}

export interface Distance {
  value: number
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

export interface Polyline {
  points: string
}

export interface RouteData {
  overview_polyline: Polyline
  steps: Step[]
  duration: Duration
}

export type Waypoint = [number, number]
