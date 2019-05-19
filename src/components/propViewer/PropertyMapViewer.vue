<template>
<v-container fluid fill-height pa-0>
    <v-layout column>
      <v-flex shrink>
        <SearchBar></SearchBar>
      </v-flex>
      <v-layout>
        <v-flex v-if="showMap" style="max-width: 60%; width: 60%">
          <Map ref="map" @propertyClicked="showProperty($event)"></Map>
        </v-flex>
        <v-flex v-if="showList">
          <PropertyList></PropertyList>
        </v-flex>
        <v-flex v-if="showDetails">
          <PropertyDetails
            ref="details"
            v-if="currentProperty"
            :propertyToView="currentProperty"
            ></PropertyDetails>
        </v-flex>
      </v-layout>
      <v-flex shrink>
        <v-progress-linear
          class="ma-0"
          v-if="gettingProperties"
          color="accent"
          :indeterminate="true">
        </v-progress-linear>
      </v-flex>
    </v-layout>
</v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
import { State, Action, namespace } from 'vuex-class'

import Map from '../map/Map'
import PropertyDetails from './Details'
import eventHub from '../../events'
import SearchBar from './SearchBar'
import PropertyList from './PropertyList'

const propns = namespace('properties')

@Component({components: {
  Map,
  PropertyDetails,
  SearchBar,
  PropertyList
}})
export default class PropertyMapViewer extends Vue {
  @propns.Action getProperties
  @propns.Action('setCurrentProperty') showProperty
  @propns.Action toggleMap
  @propns.Action ban
  @propns.Action getToWork
  @propns.Action setMaxPrice
  @propns.Action favorite
  @propns.Action nextProperty
  @propns.Action prevProperty
  @propns.State gettingProperties
  @propns.State currentProperty
  @propns.State properties
  @propns.State showMap
  @propns.State showDetails
  @propns.State showList
  @propns.State maxPrice
  
  $refs!: {
    details: PropertyDetails,
    map: Map
  }
  
  get propertiesJSON () {
    return JSON.stringify(this.properties, undefined, 2)
  }
  
  created () {
    eventHub.$on('keyup', this.onKey)
  }
  
  beforeMount () {
    this.getProperties()
  }
  
  beforeDestroy () {
    eventHub.$off('keyup', this.onKey)
  }
  
  onKey (event) {
    switch (event.keyCode) {
      case 77: { // m
        this.toggleMap()
        break
      }
      case 72: { // h
        this.$refs.details.prevImage()
        break
      }
      case 76: { // l
        this.$refs.details.nextImage()
        break
      }
      case 73: { // i
        this.$refs.details.toggleFullscreenImages()
        break
      }
      case 66: { // b
        this.ban(this.currentProperty)
        break
      }
      case 68: { // d
        this.getToWork(this.currentProperty)
        break
      }
      case 70: { // f
        this.favorite(this.currentProperty)
        break
      }
      case 78: { // n
        this.nextProperty()
        break
      }
      case 80: { // p
        this.prevProperty()
        break
      }
      case 90: { // z
        this.$refs.map.centerProperty()
        break
      }
      case 48: { // 0
        this.$refs.map.centerMap()
        break
      }
    }
  }
}
</script>
