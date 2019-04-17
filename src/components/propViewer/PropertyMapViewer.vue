<template>
  <v-container fluid fill-height pa-0>
    <v-layout column>
      <v-layout style="max-height: 100%">
        <v-flex v-if="showMap" style="min-width: 60%">
          <Map @propertyClicked="showProperty($event)"></Map>
        </v-flex>
        <v-flex class="scroll">
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

const propns = namespace('properties')

@Component({components: {
  Map,
  PropertyDetails
}})
export default class PropertyViewer extends Vue {
  @propns.Action getProperties
  @propns.Action('setCurrentProperty') showProperty
  @propns.Action toggleMap
  @propns.Action ban
  @propns.Action getToWork
  @propns.Action favorite
  @propns.Action nextProperty
  @propns.Action prevProperty
  @propns.State gettingProperties
  @propns.State currentProperty
  @propns.State properties
  @propns.State showMap
  
  $refs!: {
    details: PropertyDetails,
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
    if (event.keyCode === 77) { // m
      this.toggleMap()
    } else if (event.keyCode === 72) { // h
      this.$refs.details.prevImage()
    } else if (event.keyCode === 76) { // l
      this.$refs.details.nextImage()
    } else if (event.keyCode === 73) { // i
      this.$refs.details.toggleFullscreenImages()
    } else if (event.keyCode === 66) { // b
      this.ban(this.currentProperty)
    } else if (event.keyCode === 68) { // d
      this.getToWork(this.currentProperty)
    } else if (event.keyCode === 70) { // f
      this.favorite(this.currentProperty)
    } else if (event.keyCode === 78) { // n
      this.nextProperty()
    } else if (event.keyCode === 80) { // p
      this.prevProperty()
    }
}
}
</script>
<style scoped>
.scroll {
  overflow: auto;
}
</style>
