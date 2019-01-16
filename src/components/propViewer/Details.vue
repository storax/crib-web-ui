<template>
<v-layout column justify-center align-center>
  <v-flex>
    <v-btn @click="getToWork(propertyToView)">Directions</v-btn>
  </v-fles>
  <v-flex>
    <Carousel ref="carousel" :images="allImages" style="width: 50em"></Carousel>
  </v-flex>
  <v-flex>
    <div v-html="propertyToView.summary" style="width: 50em"></div>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Property } from '../../store/properties/types'
import { Action, namespace } from 'vuex-class'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import Carousel from './Carousel'

const propns = namespace('properties')

@Component({ components: {
  Carousel
}})
export default class PropertyDetails extends Vue {
  @Prop(Property) propertyToView: Property
  @propns.Action('getToWork') getToWork

  $refs!: {
    carousel: Carousel
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
