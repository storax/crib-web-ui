<template>
  <div style="width: 100%; height: 100%">
    <slick
      class="mainCarousel"
      style="max-height: 100%"
      ref="mainCarousel"
      :options="mainOptions">
      <v-img v-for="(image, index) in images"
             :key="index"
             :src="image"
             :lazySrc="someImage"
             :aspect-ratio="656/437"
             max-height="100%"
             contain
             >
      </v-img>
    </slick>
    <slick
      class="thumbsCarousel"
      style="max-height: 20%"
      ref="thumbsCarousel"
      :options="thumbsOptions">
      <v-img v-for="(image, index) in images"
             :key="index"
             :src="image"
             :lazySrc="someImage"
             alt="Loading"
             :aspect-ratio="656/437"
             max-height="100%"
             contain
             >
      </v-img>
    </slick>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Slick from 'vue-slick'

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const placeholder = require('../../assets/placeholder.jpg');

@Component({ components: {
  Slick
}})
export default class Carousel extends Vue {
  @Prop(Array) images: string[]

  someImage = placeholder

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
    if this.$refs.mainCarousel {
      const mainCurrIndex = this.$refs.mainCarousel.currentSlide()
      const thumbsCurrIndex = this.$refs.thumbsCarousel.currentSlide()
      this.$refs.mainCarousel.destroy()
      this.$refs.thumbsCarousel.destroy()
      this.$nextTick(() => {
          this.$refs.mainCarousel.create()
          this.$refs.thumbsCarousel.create()
          this.$refs.mainCarousel.goTo(mainCurrIndex, true)
          this.$refs.thumbsCarousel.goTo(thumbsCurrIndex, true)
      })
    }
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
