<template>
  <div style="width: 100%; height: 100%">
    <slick
      class="mainCarousel"
      style="max-height: 100%"
      ref="mainCarousel"
      :options="mainOptions">
      <v-img v-for="(image, index) in images" :key="index" :src="image" contain max-height="100%" :aspect-ratio="656/437">
    </slick>
    <slick
      class="thumbsCarousel"
      style="max-height: 20%"
      ref="thumbsCarousel"
      :options="thumbsOptions">
      <v-img v-for="(image, index) in images" :key="index" :src="image" contain max-height="100%" :aspect-ratio="656/437">
    </slick>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Slick from 'vue-slick'

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

@Component({ components: {
  Slick
}})
export default class Carousel extends Vue {
  @Prop(Array) images: string[]

  get mainOptions () {
    return {
      slidesToShow: 1,
      arrows: false,
      asNavFor: '.thumbsCarousel'
    }
  }
  get thumbsOptions () {
    return {
      dots: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: true,
      focusOnSelect: true,
      asNavFor: '.mainCarousel'
    }
  }

  $refs!: {
    mainCarousel: Slick,
    thumbsCarousel: Slick
  }

  @Watch('images', { immediate: true, deep: false })
  onImagesChange(val: string[] oldval: string[]) {
    this.$nextTick(() => {
      this.$refs.mainCarousel.reSlick()
      this.$refs.thumbsCarousel.reSlick()
    })
  }
}
</script>
<style>
  .slick-dots {
  bottom: 0px
  }
  .slick-next {
  right: 0px
  }
  .slick-prev {
  left: 0px;
  z-index: 2
  }
  .slick-slide {
    opacity: 0.4
  }
  .slick-current {
    opacity: 1
  }
</style>
