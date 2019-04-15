<template>
  <l-feature-group ref="layer">
  </l-feature-group>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { LCircle, LFeatureGroup, LTooltip, L } from 'vue2-leaflet'

const dirns = namespace('directions')

@Component({components: {
  LCircle,
  LFeatureGroup,
  LTooltip
}})
export default class DurationsField extends Vue {
  @dirns.State toWorkDurations
  layerOpject = null
  renderer = L.canvas({ padding: 0.5 })
  circles = []
  
  $refs!: {
    layer: LFeatureGroup
  }
  
  mounted () {
    this.$nextTick(() => {
      this.layerObject = this.$refs.layer.mapObject
      this.draw()
    })
  }
  
  draw () {
    if (this.layerObject) {
      this.layerObject.clearLayers()
      for (let duration of this.toWorkDurations) {
        const circle = L.circle(duration.location, {
          renderer: this.renderer,
          fillColor: duration.color,
          stroke: false,
          fillOpacity: 0.5,
          radius: 100
        }).bindTooltip(duration.duration).addTo(this.layerObject)
      }
    }
  }

  @Watch('toWorkDurations')
  onChange (newVal) {
    this.draw()
  }
}
</script>
