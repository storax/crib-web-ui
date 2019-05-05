<template>
<l-map ref="map" v-resize="onResize" :zoom="zoom" :center="center" style="z-index: 0" class="maxheight">
  <l-control-layers position="topright" :hideSingleBase="true"></l-control-layers>
  <l-tile-layer :url="url" :attribution="attribution" layerType="base" name="Map"></l-tile-layer>
  <l-control class="leaflet-control-layers" position="topright" >
    <a class="leaflet-control-layers-toggle" href="#" title="Colormaps" v-if="!controlHover" @click="controlHover = true"></a>
    <v-card v-else class="pa-2">
      <v-subheader>Max time (m)</v-subheader>
      <v-layout row>
        <v-flex class="pr-3">
          <v-slider
            v-model="maxDurationSelection"
            v-on:start="startMaxDurationSelect"
            v-on:end="endMaxDurationSelect"
          ></v-slider>
        </v-flex>
        <v-flex shrink style="width: 60px">
          <v-text-field
            v-model="maxDurationSelection"
            class="mt-0"
            hide-details
            single-line
            readonly
            type="number"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-combobox
        v-model="colormap"
        :items="colormaps"
        label="Time to work colormap"
        persistent-hint
        attach=".boxhere">
      </v-combobox>
      <div class="boxhere"></div>
      <v-btn @click="controlHover = false">Close</v-btn>
    </v-card>
  </l-control>
  <l-layer-group layerType="overlay" name="Time to Work">
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
  <l-layer-group layerType="overlay" name="Route Area">
    <l-geo-json
      :geojson="routearea"
      :options-style="routeareastyle"
      ></l-geo-json>
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
  LPolyline,
  LGeoJson,
  LControl
} from 'vue2-leaflet'
import { State, Action, namespace } from 'vuex-class'
import * as polyline from '@mapbox/polyline'

import { Property, RouteData } from '../../store/properties/types'
import Route from './Route'
import DurationsField from './DurationsField'
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
  Route,
  DurationsField,
}})
export default class Map extends Vue {
  url: string = 'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png' +
    '?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  attribution: string = 'Map data &copy; ' +
    '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  zoom: number = 12,
  center: [number, number] = [51.417386, -0.1943391]
  defaultIcon = new L.Icon.Default()
  favIcon = greenIcon
  selectedIcon = redIcon
  bannedIcon = greyIcon
  controlHover = false
  maxDurationSliding = false
  routeareastyle = {
    weight: 2,
    color: "cyan",
    opacity: 0.7,
    fillColor: "cyan",
    fillOpacity: 0.5
  }
  
  @propns.State properties
  @propns.State currentProperty
  @propns.Getter isCurrentProperty
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
  }
  
  onResize () {
    this.$refs.map.mapObject.invalidateSize()
  }
  
  beforeMount () {
    this.getColormaps()
    this.getArea()
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
      this.getToWorkDurations()
    }
  }
  
  get maxDurationSelection () {
    return this._maxDuration / 60
  }
  
  set maxDurationSelection (maxDuration: number) {
    if (!this.maxDurationSliding) {
      const dur = maxDuration * 60
      if this._maxDuration !== dur {
        this.setMaxDuration(dur)
        this.getToWorkDurations()
      }
    }
  }
  
  startMaxDurationSelect (maxDuration: number) {
    this.maxDurationSliding = true
  }
  
  endMaxDurationSelect (maxDuration: number) {
    this.maxDurationSliding = false
    this.maxDurationSelection = maxDuration
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
