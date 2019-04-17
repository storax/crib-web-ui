<template>
<v-layout column justify-center align-center>
  <v-card style="padding: 1em; margin-left: 2em; margin-right: 2em; width: 50em">
    <v-layout row>
      <v-flex >
        <h3>{{propertyToView.propertyTypeFullDescription}} {{propertyToView.displayAddress}}</h3>
      </v-flex>
      <v-flex class="text-lg-right">
        <b>{{price}}</b>
      </v-flex>
      <v-flex class="text-lg-right">
        <b>{{propertyToView.toWork.duration ? propertyToView.toWork.duration.text : ""}}</b>
      </v-flex>
    </v-layout>
  </v-card>
  <v-flex>
    <Carousel ref="carousel" :images="allImages" style="width: 50em"></Carousel>
  </v-flex>
  <v-flex>
    <PropertyActions :property="propertyToView"></PropertiesActions>
  </v-flex>
  <v-flex>
    <div v-html="propertyToView.summary" style="width: 50em"></div>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Property } from '../../store/properties/types'

import Carousel from './Carousel'
import PropertyActions from './PropertyActions'

@Component({ components: {
  Carousel,
  PropertyActions
}})
export default class PropertyDetails extends Vue {
  @Prop(Property) propertyToView: Property

  $refs!: {
    carousel: Carousel
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

}
</script>
