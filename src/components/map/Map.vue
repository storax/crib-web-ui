<template>
<l-map ref="map" v-resize="onResize" :zoom="zoom" :center="center" style="z-index: 0" class="maxheight" :options="{ drawControl: false }">
  <l-control-layers position="topright" :hideSingleBase="true"></l-control-layers>
  <l-tile-layer :url="url" :attribution="attribution" layerType="base" name="Map"></l-tile-layer>
  <l-control class="leaflet-control-layers" position="topright">
    <a class="leaflet-control-layers-toggle" href="#" title="Colormaps" v-if="!controlHover" @click="controlHover = true"></a>
    <v-card v-else class="pa-2">
      <v-combobox
        v-model="colormap"
        :items="colormaps"
        label="Time to work colormap"
        persistent-hint
        attach=".boxhere">
      </v-combobox>
      <div class="boxhere"></div>
      <v-btn @click="loadToWork()">Load</v-btn>
      <v-btn @click="controlHover = false">Close</v-btn>
    </v-card>
  </l-control>
  <l-layer-group ref="durfieldlayer" layerType="overlay" name="Time to Work">
    <DurationsField></DurationsField>
  </l-layer-group>
  <l-layer-group layerType="overlay" name="Properties">
    <l-marker
      v-for="item in properties"
      :lat-lng="[item.location.latitude, item.location.longitude]"
      :key="item.id"
      :icon="propIcon(item)"
      :zIndexOffset="markerOffset(item)"
      v-on:click="selectMarker(item)">
      <l-tooltip >£{{ item.price.amount }} {{ item.price.frequency}}</l-tooltip>
    </l-marker>
  </l-layer-group>
  <l-layer-group layerType="overlay" name="Routes">
    <Route :route="route"></Route>
  </l-layer-group>
  <l-layer-group ref="routearealayer" layerType="overlay" name="Route Area">
    <l-geo-json
      :geojson="routearea"
      :options-style="routeareastyle"
      ></l-geo-json>
  </l-layer-group>
  <EditableArea/>
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
  LPolyline,
  LGeoJson,
  LControl,
  LFeatureGroup
} from 'vue2-leaflet'
import { State, Action, namespace } from 'vuex-class'
import * as polyline from '@mapbox/polyline'

import { Property, RouteData } from '../../store/properties/types'
import Route from './Route'
import DurationsField from './DurationsField'
import EditableArea from './EditableArea'
import { redIcon, greenIcon, greyIcon } from './icons'

const propns = namespace('properties')
const dirns = namespace('directions')

@Component({components: {
  LLayerGroup,
  LControlLayers,
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LControl,
  LGeoJson,
  LFeatureGroup,
  Route,
  DurationsField,
  EditableArea
}})
export default class Map extends Vue {
  url: string = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}' +
    '?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  attribution: string = 'Map data &copy; ' +
    '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  zoom: number = 12,
  center: [number, number] = [51.505, -0.09]
  defaultIcon = new L.Icon.Default()
  favIcon = greenIcon
  selectedIcon = redIcon
  bannedIcon = greyIcon
  controlHover = false
  routeareastyle = {
    weight: 2,
    color: "cyan",
    opacity: 0.7,
    fillColor: "cyan",
    fillOpacity: 0.2
  }
  
  @propns.State properties
  @propns.State currentProperty
  @propns.Getter isCurrentProperty
  @propns.Mutation setSearchArea
  @propns.Action getProperties
  @dirns.State mapRaster
  @dirns.State('colormap') _colormap
  @dirns.State colormaps
  @dirns.State('maxDuration') _maxDuration
  @dirns.State('area') routearea
  @dirns.Mutation setColormap
  @dirns.Mutation setMaxDuration
  @dirns.Action getMapRaster
  @dirns.Action getColormaps
  @dirns.Action getToWorkDurations
  @dirns.Action getArea
  
  $refs!: {
    map: LMap,
    durfieldlayer: LLayerGroup,
    routearealayer: LLayerGroup,
  }
  
  onResize () {
    this.$refs.map.mapObject.invalidateSize()
  }
  
  beforeMount () {
    this.getColormaps()
  }
  
  disableShit (e) {
    L.DomEvent.stopPropagation(e)
  }
  
  get colormap () {
    return this._colormap
  }
  
  set colormap (colormap: string) {
    if this._colormap !== colormap {
      this.setColormap(colormap)
    }
  }
  
  get maxDuration () {
    return this._maxDuration / 60
  }
  
  loadToWork () {
    this.getArea()
    this.getToWorkDurations()
  }
  
  set maxDuration (maxDuration: number) {
    const dur = maxDuration * 60
    this.setMaxDuration(dur)
  }
  
  propIcon (prop: Property) {
    if this.isCurrentProperty(prop) {
      return this.selectedIcon
    } else if (prop.banned) {
      return this.bannedIcon
    } else if (prop.favorite) {
      return this.favIcon
    } else {
      return this.defaultIcon
    }
  }
  
  markerOffset (prop: Property) {
    if this.isCurrentProperty(prop) {
      return 9000
    } else if (prop.banned) {
      return -1000
    } else if (prop.favorite) {
      return 1000
    } else {
      return 0
    }
  }

  get route (): RouteData | null {
    return this.currentProperty ? this.currentProperty.toWork : null
  }

  @Emit('propertyClicked')
  selectMarker (property) {
    return property
  }

  get getProps (): Property[] {
    return this.properties
  }

  centerProperty () {
    const latLng = L.latLng(this.currentProperty.location.latitude, this.currentProperty.location.longitude)
    this.$refs.map.mapObject.setView(latLng, 14)
  }

  centerMap () {
    this.$refs.map.mapObject.setView([51.505, -0.09], 12)
  }

  mounted() {
    this.$nextTick(() => {
      const map = this.$refs.map.mapObject
      const durfieldlayer = this.$refs.durfieldlayer.mapObject
      const routearealayer = this.$refs.routearealayer.mapObject
      durfieldlayer.remove()
      routearealayer.remove()
    })
  }
}
</script>
<style scoped>
.v-menu__content {
    position: inherit
}
.maxheight {
    position: fixed;
    width: inherit;
    max-height: calc(100vh - 13em);
}
</style>
