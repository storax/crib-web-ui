<template>
  <l-layer-group layerType="overlay" :name="infoType">
    <l-rectangle v-for="(division, index) in divisions"
                 :key="index"
                 :bounds="division.bounds"
                 :stroke="false"
                 :fillOpacity="0.8"
                 :fillColor="division.data.color"
                 :color="division.data.color">
      <l-tooltip>{{division.data.text}}</l-tooltip>
    </l-rectangle>
  </l-layer-group>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Action, namespace } from 'vuex-class'
import { LRectangle, LLayerGroup, LTooltip } from 'vue2-leaflet'
import { ToWorkDurationsQuadTree, Division, DivistionData } from './quadtree'
import { ToWorkDurations } from '../../store/directions/types'

const dirns = namespace('directions')

@Component({components: {
  LRectangle,
  LLayerGroup,
  LTooltip
}})
export default class DurationsQuadTree extends Vue {
  @dirns.State toWorkDurations
  @dirns.Action getToWorkDurations
  infoType = 'Average Duration To Work'

  get divisions (): Division<DivisionData>[] {
    const durations = this.toWorkDurations
    console.log(durations.length)
    const quadtree = new ToWorkDurationsQuadTree(4, 6)
    for (let d of durations) {
      quadtree.addToWorkDuration(d)
    }
    const divs = quadtree.getAverageDurToWork()
    console.log(divs.length)
    return divs
  }

  beforeMount () {
    this.getToWorkDurations()
  }

}
</script>
