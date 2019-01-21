<template>
  <l-layer-group layerType="overlay" :name="infoType">
    <l-rectangle v-for="(division, index) in divisions"
                 :key="index"
                 :bounds="division.bounds"
                 :stroke="false"
                 :fillOpacity="0.5"
                 :fillColor="division.data.color"
                 :color="division.data.color">
      <l-tooltip>{{division.data.text}}</l-tooltip>
    </l-rectangle>
  </l-layer-group>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { LRectangle, LLayerGroup, LTooltip } from 'vue2-leaflet'
import { PropertyQuadTree, Division, DivistionData } from './quadtree'
import { Property } from '../../store/properties/types'

enum Information {
  averagePrices = 'Average Prices',
  averageDurationToWork = 'Average Duration To Work'
}

@Component({components: {
  LRectangle,
  LLayerGroup,
  LTooltip
}})
export default class PropQuadTree extends Vue {
  @Prop() props: Property[]
  infoType: Information = Information.averageDurationToWork
  quadtree = new PropertyQuadTree(2, 6)

  get divisions (): Division<DivisionData>[] {
    let divisions = []
    switch (this.infoType) {
      case Information.averagePrices:
        divisions = this.quadtree.getAveragePrices()
        break
      case Information.averageDurationToWork:
        divisions = this.quadtree.getAverageDurToWork()
        break
    }
    return divisions
  }

  @Watch('props')
  onPropsChange (newVal: Property[]) {
    this.quadtree.clear()
    for (let p of this.props) {
      this.quadtree.addProperty(p)
    }
  }

}
</script>
