<template>
  <v-container class="pa-0" fluid fill-height>
        <v-layout column>
          <v-flex shrink>
            <v-progress-linear
              class="ma-0"
              v-if="gettingProperties"
              color="secondary"
              :indeterminate="true">
            </v-progress-linear>
          </v-flex>
          <v-layout row>
            <v-flex md4 d-flex>
              <v-card class="scroll" max-height="100vh">
              <pre>{{ propertiesJSON }}</pre>
              </v-card>
            </v-flex>
            <v-flex grow d-flex>
              <l-map ref="map" v-resize="onResize" :zoom="zoom" :center="center">
                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                <l-marker
                  v-for="item in properties"
                  :lat-lng="[item.location.latitude, item.location.longitude]"
                  :key="item.id">
                  <l-popup > {{ item.price.amount }} {{ item.price.frequency}}</l-popup>
                  <l-tooltip >£{{ item.price.amount }} {{ item.price.frequency}}</l-tooltip>
                </l-marker>
              </l-map>
            </v-flex>
          </v-layout>
        </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet'

import { State, Action, namespace } from 'vuex-class'

const propns = namespace('properties')

@Component({components: {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip
}})
export default class PropertyViewer extends Vue {
  url: string = 'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png' +
    '?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  attribution: string = 'Map data &copy; ' +
    '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  zoom: number = 12,
  center: [number, number] = [51.505, -0.09]
  
  @propns.Action('getProperties') getProperties
  @propns.State('gettingProperties') gettingProperties
  @propns.State('properties') properties

  $refs!: {
    map: LMap
  }

  get propertiesJSON () {
    return JSON.stringify(this.properties, undefined, 2)
  }
  
  onResize() {
    this.$refs.map.mapObject.invalidateSize()
  }

  beforeMount () {
    this.getProperties()
  }
}
</script>
<style scoped>
.scroll {
  overflow: auto;
}
</style>
