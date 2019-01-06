<template>
<l-map ref="map" v-resize="onResize" :zoom="zoom" :center="center">
  <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
  <l-marker
    v-for="item in properties"
    :lat-lng="[item.location.latitude, item.location.longitude]"
    :key="item.id"
    :icon="item.markerIcon ? item.markerIcon : defaultIcon"
    v-on:click="selectMarker(item)"
    >
    <l-tooltip >£{{ item.price.amount }} {{ item.price.frequency}}</l-tooltip>
  </l-marker>
</l-map>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet'

import { State, Action, namespace } from 'vuex-class'

const propns = namespace('properties')

const redIcon = new L.Icon({
    iconRetinaUrl: require('../../assets/marker-icon-2x-red.png'),
    iconUrl: require('../../assets/marker-icon-red.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

@Component({components: {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip
}})
export default class Map extends Vue {
  url: string = 'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png' +
    '?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  attribution: string = 'Map data &copy; ' +
    '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  zoom: number = 12,
  center: [number, number] = [51.505, -0.09]
  defaultIcon = new L.Icon.Default()
  selectedIcon = redIcon

  @propns.State('properties') properties

  $refs!: {
    map: LMap
  }

  onResize() {
    this.$refs.map.mapObject.invalidateSize()
  }

  @Emit('propertyClicked')
  selectMarker(property) {
  	if (this.currentProperty) {
      Vue.delete(this.currentProperty, 'markerIcon')
    }
  	this.currentProperty = property
    Vue.set(this.currentProperty, 'markerIcon', this.selectedIcon)
    return property
  }
}
</script>
