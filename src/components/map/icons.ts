import { L } from 'vue2-leaflet'

export const redIcon = new L.Icon({
  iconRetinaUrl: require('../../assets/marker-icon-2x-red.png'),
  iconUrl: require('../../assets/marker-icon-red.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})
export const greenIcon = new L.Icon({
  iconRetinaUrl: require('../../assets/marker-icon-2x-green.png'),
  iconUrl: require('../../assets/marker-icon-green.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export const greyIcon = new L.Icon({
  iconRetinaUrl: require('../../assets/marker-icon-2x-grey.png'),
  iconUrl: require('../../assets/marker-icon-grey.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})
