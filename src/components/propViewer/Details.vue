<template>
  <v-card>
    <v-card >
      <Carousel :images="propertyImages"></Carousel>
    </v-card>
    <div v-html="propertyToView.summary"></div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Property } from '../../store/properties/types'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import Carousel from './carousel'

@Component({ components: {
  Carousel
}})
export default class PropertyDetails extends Vue {
  @Prop(Property) propertyToView: Property

  get propertyImages () {
     return this.propertyToView.propertyImages
  }

}
</script>
