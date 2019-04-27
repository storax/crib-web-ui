<template>
<v-layout column justify-center align-center>
  <v-card class="pa-2 ml-4 mr-4" style="width: 50em">
    <v-layout row>
      <v-flex >
        <h3>{{propertyToView.propertyTypeFullDescription}} {{propertyToView.displayAddress}}</h3>
      </v-flex>
      <v-flex class="text-lg-right">
        <b>{{price}}</b>
      </v-flex>
      <v-flex class="text-lg-right">
        <b>{{propertyToView.toWork ? propertyToView.toWork.duration.text : ""}}</b>
      </v-flex>
      <v-flex class="text-lg-right">
        <b>{{currentIndex + 1}} / {{count}}</b>
      </v-flex>
    </v-layout>
  </v-card>
  <v-flex>
    <Carousel ref="carousel" :images="allImages" style="width: 50em"></Carousel>
  </v-flex>
  <v-flex class="ma-2">
    <PropertyActions :property="propertyToView"></PropertiesActions>
  </v-flex>
  <v-flex class="mb-2" style="width: 50em">
    <LettingInformation :property="propertyToView"></LettingInformation>
  </v-flex>
  <v-flex class="mb-2" style="width: 50em">
    <KeyFeatures :property="propertyToView"></KeyFeatures>
  </v-flex>
  <v-flex>
    <div v-html="propertyToView.summary" style="width: 50em"></div>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import { namespace } from 'vuex-class'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Property } from '../../store/properties/types'

import Carousel from './Carousel'
import PropertyActions from './PropertyActions'
import KeyFeatures from './KeyFeatures'
import LettingInformation from './LettingInformation'

const propns = namespace('properties')

@Component({ components: {
  Carousel,
  PropertyActions,
  KeyFeatures,
  LettingInformation
}})
export default class PropertyDetails extends Vue {
  @Prop(Property) propertyToView: Property
  @propns.Getter count
  @propns.State currentIndex
  
  $refs!: {
    carousel: Carousel
    streetview: null
  }
  
  get price () {
    return '£' + this.propertyToView.price.amount + ' pcm'
  }
  
  get allImages () {
    return [ ...this.propertyToView.propertyImages, ...this.floorplanImages ]
  }
  
  get floorplanImages () {
    return this.propertyToView.floorplanImages
  }
  
  nextImage (): void {
    this.$refs.carousel.next()
  }
  
  prevImage (): void {
    this.$refs.carousel.prev()
  }
  
  toggleFullscreenImages (): void {
    this.$refs.carousel.toggleFullscreen()
  }
  
  initialize (): void {
    this.$refs.streetview = new google.maps.StreetViewPanorama(
      document.getElementById('streetview'),
      {
        position: {lat: 37.869260, lng: -122.254811},
        pov: {heading: 165, pitch: 0},
        zoom: 1
      });
    
  }
  
}
</script>

<style scoped>
#street-view {
  height: 100%;
}
</style>
