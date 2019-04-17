<template>
<v-layout column>
  <v-card style="padding: 1em; margin-left: 2em; margin-right: 2em">
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
  <v-layout column justify-center align-center>
    <v-flex>
      <Carousel ref="carousel" :images="allImages" style="width: 50em"></Carousel>
    </v-flex>
    <v-layout row>
      <v-flex>
        <DirectionsBtn :property="propertyToView"></DirectionsBtn>
      </v-flex>
      <v-flex>
        <FavoriteBtn :property="propertyToView"></BanBtn>
      </v-flex>
      <v-flex>
        <BanBtn :property="propertyToView"></BanBtn>
      </v-flex>
      <v-flex>
        <ViewBtn :property="propertyToView"></ViewBtn>
      </v-flex>
    </v-layout>
  <v-flex>
    <div v-html="propertyToView.summary" style="width: 50em"></div>
  </v-flex>
  </v-layout>
</v-layout>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
import { Property } from '../../store/properties/types'
import { Action, namespace } from 'vuex-class'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import Carousel from './Carousel'
import FavoriteBtn from './FavoriteBtn'
import BanBtn from './BanBtn'
import ViewBtn from './ViewBtn'
import DirectionsBtn from './DirectionsBtn'

const propns = namespace('properties')

@Component({ components: {
  Carousel,
  FavoriteBtn,
  BanBtn,
  ViewBtn,
  DirectionsBtn
}})
export default class PropertyDetails extends Vue {
  @Prop(Property) propertyToView: Property
  @propns.Action getToWork
  @propns.Action favorite
  @propns.Action ban

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
