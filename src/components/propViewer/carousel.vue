<template>
  <div style="width: 100%; height: 100%">
    <swiper
      :options="swiperOptionTop"
      class="gallery-top"
      ref="swiperTop"
      v-if="images">
      <swiper-slide v-for="(image, index) in images" :key="index">
        <v-img :src="image" contain max-height="100%">
      </swiper-slide>
      <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
      <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
    </swiper>
    <swiper
      :options="swiperOptionThumbs"
      class="gallery-thumbs"
      ref="swiperThumbs"
      v-if="images">
      <swiper-slide v-for="(image, index) in images" :key="index">
        <v-img :src="image" class="thumb-image" height="100%">
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

@Component({ components: {
  swiper, swiperSlide
}})
export default class Carousel extends Vue {
  @Prop(Array) images: string[]

  $refs!: {
    swiperTop: swiper,
    swiperThumbs: swiper
  }

  swiperOptionTop = {
    loop: true;
    loopedSlides: this.images.length,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  }
  get swiperOptionThumbs () {
    return {
      loop: true,
      loopedSlides: this.images.length,
      spaceBetween: 10,
      touchRatio: 0.2,
      slidesPerView: "auto",
      slideToClickedSlide: true
    }
  } 

  mounted() {
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.swiper
      const swiperThumbs = this.$refs.swiperThumbs.swiper
      swiperTop.controller.control = swiperThumbs
      swiperThumbs.controller.control = swiperTop
    })
  }
}
</script>

<style scoped>
  .gallery-top {
    height: 80%!important;
    width: 100%;
  }
  .gallery-thumbs {
    height: 20%!important;
    box-sizing: border-box;
    padding: 10px 0;
  }
  .gallery-thumbs .swiper-slide {
    width: 20%;
    height: 100%;
    opacity: 0.4;
  }
  .gallery-thumbs .swiper-slide-active {
    opacity: 1;
  }
  .thumg-image {
    width: inherit;
    height: inherit;
  }
</style>
