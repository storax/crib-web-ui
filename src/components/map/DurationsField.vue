<template>
  <l-layer-group layerType="overlay" :name="infoType">
    <l-circle v-for="(duration, index) in durations"
                 :key="index"
                 :lat-lng="duration.location"
                 :radius="100"
                 :stroke="false"
                 :fillOpacity="1.0"
                 :fillColor="duration.color">
      <l-tooltip>{{duration.text}}</l-tooltip>
    </l-circle>
  </l-layer-group>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { LCircle, LLayerGroup, LTooltip } from 'vue2-leaflet'
import { Division, DivisionData, normalize } from './quadtree'
import { ToWorkDuration } from '../../store/directions/types'
import tinygradient from 'tinygradient'
import * as moment from 'moment'
import 'moment-duration-format'

const dirns = namespace('directions')

@Component({components: {
  LCircle,
  LLayerGroup,
  LTooltip
}})
export default class DurationsField extends Vue {
  @dirns.State toWorkDurations
  @dirns.Action getToWorkDurations
  infoType = 'Average Duration To Work'
  gradient = tinygradient(
    '#3FFBE0',
    '#40D1E0',
    '#64A5CA',
    '#777BA4',
    '#755474',
    '#603546'
  )

  get durations (): Division<DivisionData>[] {
    const durs = this.toWorkDurations.durations
    if (!durs) {
        return []
    }
    const minDur = this.toWorkDurations.minDuration
    const maxDur = this.toWorkDurations.maxDuration
    console.log(minDur, maxDur)
    const n = normalize(minDur, maxDur)
    const fmt = 'm [min]'
    const unit = 'seconds'
    const gradient = this.gradient
    const divs = durs.map((d: ToWorkDuration) => ({
      location: [d.location.latitude, d.location.longitude],
      color: gradient.rgbAt(n(d.duration)).toHexString(),
      text: moment.duration(d.duration, unit).format(fmt)
    }))
    return divs
  }

  beforeMount () {
    this.getToWorkDurations()
  }

}
</script>
