<template>
  <l-feature-group>
    <l-circle
      v-for="(duration, index) in toWorkDurations"
      :key="index"
      :lat-lng="duration.location"
      :radius="100"
      :stroke="false"
      :fillOpacity="0.5"
      :fillColor="duration.color">
      <l-tooltip>{{duration.duration}}</l-tooltip>
    </l-circle>
  </l-feature-group>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { LCircle, LFeatureGroup, LTooltip } from 'vue2-leaflet'

const dirns = namespace('directions')

@Component({components: {
  LCircle,
  LFeatureGroup,
  LTooltip
}})
export default class DurationsField extends Vue {
  @dirns.State toWorkDurations
  @dirns.Action getToWorkDurations

  beforeMount () {
    this.getToWorkDurations()
  }
}
</script>
