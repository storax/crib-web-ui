<template>
  <l-layer-group>
    <l-rectangle v-for="(division, index) in divisions"
                 :key="index"
                 :bounds="division.bounds"
                 :stroke="false"
                 :fillOpacity="0.3"
                 :fillColor="division.data.color"
                 :color="division.data.color">
      <l-tooltip>{{division.data.avg}}</l-tooltip>
    </l-rectangle>
  </l-layer-group>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { LRectangle, LLayerGroup, LTooltip } from 'vue2-leaflet'
import { QuadTree, propertyQuadTree, Division } from './quadtree'
import { Property } from '../../store/properties/types'
import tinygradient from 'tinygradient'

function normalize(min: number, max: number): (v: number) => number {
    var delta = max - min;
    return function (val: number): number {
        return (val - min) / delta;
    };
}

@Component({components: {
  LRectangle,
  LLayerGroup,
  LTooltip
}})
export default class PropQuadTree extends Vue {
  @Prop() props: Property[]
  maxObjectsPerLevel: number = 2
  maxLevels: number = 6
  gradient = tinygradient('red', 'green', 'blue')
  
  get divisions (): Division[] {
    const quadtree = propertyQuadTree(this.maxObjectsPerLevel, this.maxLevels)
    let maxVal = 0
    let minVal = Number.MAX_SAFE_INTEGER
    for (let prop of this.props) {
      maxVal = Math.max(maxVal, prop.price.amount)
      minVal = Math.min(minVal, prop.price.amount)
      quadtree.add(prop)
    }
    const n = normalize(minVal, maxVal)
    const divisions = quadtree.getDivisions((properties: Property[]) => {
      let sum = 0
      let avg = 0
      let color = "#000000"
      if (properties.length) {
        sum = properties.reduce((total, prop) => total + prop.price.amount, 0)
        avg = sum / properties.length
        color = this.gradient.rgbAt(n(avg)).toHexString()
      }
      return {color: color, avg: avg}
    })
    return divisions.filter((div: Division) => div.data.avg)
  }
}
</script>
