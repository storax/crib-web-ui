<template>
  <v-container fluid fill-height pa-0>
    <v-layout column>
      <v-layout style="max-height: 100%">
        <v-flex>
          <Map v-on:propertyClicked="showProperty($event)"></Map>
        </v-flex>
        <v-flex md4 class="scroll">
          <PropertyDetails
            v-if="propToDisplay"
            :propertyToView="propToDisplay"
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
import Map from './Map'
import PropertyDetails from './Details'
import { State, Action, namespace } from 'vuex-class'

const propns = namespace('properties')

@Component({components: {
  Map,
  PropertyDetails
}})
export default class PropertyViewer extends Vue {
  @propns.Action('getProperties') getProperties
  @propns.State('gettingProperties') gettingProperties
  @propns.State('properties') properties

  propToDisplay = this.properties ? this.properties[0] : null

  get propertiesJSON () {
    return JSON.stringify(this.properties, undefined, 2)
  }

  showProperty (prop) {
    this.propToDisplay = prop
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
