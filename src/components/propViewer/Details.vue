<template>
<v-layout justify-center align-center column>
  <v-flex>
    <Carousel :images="propertyImages" style="max-width: 1000px"></Carousel>
  </v-flex>
  <v-flex>
    <Carousel :images="floorplanImages" style="max-width: 1000px"></Carousel>
  </v-flex>
  <v-flex>
    <div v-html="propertyToView.summary"></div>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Property } from '../../store/properties/types'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import Carousel from './Carousel'

@Component({ components: {
  Carousel
}})
export default class PropertyDetails extends Vue {
  @Prop(Property) propertyToView: Property

  get propertyImages () {
    return this.propertyToView.propertyImages
  }

  get floorplanImages () {
    return this.propertyToView.floorplanImages
  }

}
</script>
