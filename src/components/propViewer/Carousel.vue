<template>
  <div style="width: 100%; height: 100%">
    <v-dialog
      @keydown.esc="fullscreen = false"
      attach="body"
      v-model="fullscreen"
      transition=false
      max-width="50%"
      >
      <v-card style="padding: 2em">
        <v-layout column align-center>
          <v-flex style="width: 100%">
            <v-card flat>
              <slick
                class="fsMainCarousel"
                style="max-height: 100%"
                ref="fsMainCarousel"
                :options="fsMainOptions">
                <v-img v-for="(image, index) in images"
                       :key="index"
                       :src="image"
                       :aspect-ratio="656/437"
                       max-height="100%"
                       contain
                       >
                </v-img>
              </slick>
            </v-card>
          </v-flex>
          <v-flex style="width: 100%">
            <v-card flat>
              <slick
                v-if="images.length > 1"
                class="fsThumbsCarousel"
                style="max-height: 20%"
                ref="fsThumbsCarousel"
                :options="fsThumbsOptions">
                <v-img v-for="(image, index) in images"
                       :key="index"
                       :src="image"
                       :aspect-ratio="656/437"
                       max-height="100%"
                       contain
                       >
                </v-img>
              </slick>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
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
  fullscreen = false

  get mainOptions () {
    return {
      fade: true,
      slidesToShow: 1,
      arrows: false,
      infinite: true,
      asNavFor: (this.images.length > 1) ? '.thumbsCarousel' : null
    }
  }

  get fsMainOptions () {
    return {
      fade: true,
      slidesToShow: 1,
      arrows: false,
      infinite: true,
      asNavFor: (this.images.length > 1) ? '.fsThumbsCarousel' : null
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

  get fsThumbsOptions () {
    return {
      dots: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      centerMode: true,
      focusOnSelect: true,
      asNavFor: '.fsMainCarousel',
      infinite: true
    }
  }

  $refs!: {
    mainCarousel: Slick,
    thumbsCarousel: Slick
    fsMainCarousel: Slick,
    fsThumbsCarousel: Slick
  }

  toggleFullscreen() {
    this.fullscreen = !this.fullscreen
  }

  next(): void {
    if this.fullscreen {
      this.$refs.fsMainCarousel.next()
    } else {
      this.$refs.mainCarousel.next()
    }
  }

  prev(): void {
    if this.fullscreen {
      this.$refs.fsMainCarousel.prev()
    } else {
      this.$refs.mainCarousel.prev()
    }
  }

  @Watch('images', { immediate: true, deep: false })
  onImagesChange(val: string[], oldval: string[]) {
    const carousels = [this.$refs.mainCarousel, this.$refs.thumbsCarousel, this.$refs.fsMainCarousel, this.$refs.fsThumbsCarousel]
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

  @Watch('fullscreen', { immediate: true, deep: false })
  onFullscreen(val: boolean, oldval: boolean) {
    if !val {
      return
    }
    const carousels = [this.$refs.fsMainCarousel, this.$refs.fsThumbsCarousel]
    for (let carousel of carousels) {
      if carousel {
        this.$nextTick(() => {
            if carousel {
              carousel.reSlick()
            }
        })
      }
    }
    if this.$refs.mainCarousel {
      const slide = this.$refs.mainCarousel.currentSlide()
      this.$nextTick(() => {
        this.$refs.fsMainCarousel.goTo(slide, true)
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
    right: 0px;
}
.slick-prev {
    left: 0px;
    z-index: 1
}
.slick-slide {
    opacity: 0.4
}
.slick-current {
    opacity: 1
}
.slick-dotted.slick-slider {
    margin-bottom: 0px
}
</style>
