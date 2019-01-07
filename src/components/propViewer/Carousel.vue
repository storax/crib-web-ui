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
             :aspect-ratio="656/437"
             max-height="100%"
             contain
             >
      </v-img>
    </slick>
    <slick
      v-if="images.length > 1"
      class="thumbsCarousel"
      style="max-height: 20%"
      ref="thumbsCarousel"
      :options="thumbsOptions">
      <v-img v-for="(image, index) in images"
             :key="index"
             :src="image"
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
      infinite: true,
      asNavFor: (this.images.length > 1) ? '.thumbsCarousel' : null
    }
  }
  get thumbsOptions () {
    return {
      dots: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      centerMode: true,
      focusOnSelect: true,
      asNavFor: '.mainCarousel',
      infinite: true
    }
  }

  $refs!: {
    mainCarousel: Slick,
    thumbsCarousel: Slick
  }

  next(): void {
    this.$refs.mainCarousel.next()
  }

  prev(): void {
    this.$refs.mainCarousel.prev()
  }

  @Watch('images', { immediate: true, deep: false })
  onImagesChange(val: string[] oldval: string[]) {
    const carousels = [this.$refs.mainCarousel, this.$refs.thumbsCarousel]
    for (let carousel of carousels) {
      if carousel {
        carousel.destroy()
        this.$nextTick(() => {
            if carousel {
              carousel.create()
            }
        })
      }
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
