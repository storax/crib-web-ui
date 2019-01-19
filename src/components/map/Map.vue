<template>
<l-map ref="map" v-resize="onResize" :zoom="zoom" :center="center" style="z-index: 0">
  <l-control-layers position="topright" :hideSingleBase="true"></l-control-layers>
  <l-tile-layer :url="url" :attribution="attribution" layerType="base" name="Map"></l-tile-layer>
  <PropQuadTree :props="getProps"></PropQuadTree>
  <l-layer-group layerType="overlay" name="Routes">
    <Route :routes="routes"></Route>
  </l-layer-group>
  <l-layer-group layerType="overlay" name="Properties">
    <l-marker
      v-for="item in properties"
      :lat-lng="[item.location.latitude, item.location.longitude]"
      :key="item.id"
      :icon="propIcon(item)"
      v-on:click="selectMarker(item)">
      <l-tooltip >£{{ item.price.amount }} {{ item.price.frequency}}</l-tooltip>
    </l-marker>
  </l-layer-group>
</l-map>
</template>

<script lang="ts">
  import { Component, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  LLayerGroup,
  LControlLayers,
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LPolyline
} from 'vue2-leaflet'

import { State, Action, namespace } from 'vuex-class'
import * as polyline from '@mapbox/polyline'

import { Property, RouteData } from '../../store/properties/types'
import Route from './Route'
import PropQuadTree from './Quadtree'
import { redIcon, greenIcon } from './icons'

const propns = namespace('properties')

@Component({components: {
  LLayerGroup,
  LControlLayers,
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  Route,
  PropQuadTree
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
  fetchedIcon = greenIcon
  selectedIcon = redIcon

  @propns.State('properties') properties
  @propns.State('currentProperty') currentProperty
  @propns.Getter('isCurrentProperty') isCurrentProperty

  $refs!: {
    map: LMap
  }

  onResize () {
    this.$refs.map.mapObject.invalidateSize()
  }

  propIcon (prop: Property) {
    if this.isCurrentProperty(prop) {
      return this.selectedIcon
    } else if (prop.toWork.length) {
      return this.fetchedIcon
    } else {
      return this.defaultIcon
    }
  }

  get routes (): RouteData[] {
    if (this.currentProperty && this.currentProperty.toWork) {
      return this.currentProperty.toWork
    }
    return []
  }

  @Emit('propertyClicked')
  selectMarker (property) {
    return property
  }

  get getProps (): Property[] {
    return this.properties
  }
}
</script>
