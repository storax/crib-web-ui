<template>
<l-polyline v-if="route && !detailed"
  :lat-lngs="overview_polyline"
  :fill="false"
  :weight="weight">
  <l-tooltip :options="tooltipOpt" class="crib-route-tooltip">
    <b>{{duration}}</b></br>
    <b>{{distance}}</b>
  </l-tooltip>
</l-polyline>
<div v-else-if="route">
<l-polyline v-for="(step, index) in steps"
  :dashArray="stepDash(step)"
  :key="'pl' + index"
  :lat-lngs="decodePoly(step.polyline.points)"
  :color="stepColor(step)"
  :fill="false"
  :weight="weight">
  <l-tooltip :options="tooltipOptDetails" class="crib-route-tooltip">
      <table>
        <tr>
          <th><b>Total: </b></th>
          <th><b>{{duration}}</b></th>
          <th><b>{{distance}}</b></th>
        </tr>
      </table>
      <span v-html="stepHTML(step)"></span>
  </l-tooltip>
</l-polyline>
<l-circle-marker
      :lat-lng="step.start_location"
      :radius="5"
      color="black"
      :fill="true"
      fillColor="white"
      :fillOpacity="1"
      v-for="(step, index) in steps"
      :key="'cm-s' + index"></l-circle-marker>
<l-circle-marker
      :lat-lng="step.end_location"
      :radius="5"
      color="black"
      :fill="true"
      fillColor="white"
      :fillOpacity="1"
      v-for="(step, index) in steps"
      :key="'cm-e' + index"></l-circle-marker>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { LCircleMarker, LTooltip, LPolyline } from 'vue2-leaflet'
import * as polyline from '@mapbox/polyline'

import { RouteData, Step, TravelMode, Waypoint } from '../../store/properties/types'

@Component({components: {
  LPolyline,
  LTooltip,
  LCircleMarker
}})
export default class Route extends Vue {
  @Prop() route: RouteData
  detailed = true
  weight = 6
  tooltipOpt = {
    permanent: true
  }
  tooltipOptDetails = {
    sticky: true
  }

  decodePoly (encoded: string): Waypoint[] {
    return polyline.decode(encoded)
  }

  stepColor (step: Step): string {
    let color: string = "#3388ff"
    if step.travel_mode === TravelMode.TRANSIT {
      color = step.transit_details.line.color
    }
    return color
  }

  stepDash (step: Step): string | null {
    if step.travel_mode === TravelMode.WALKING {
      return "1 10"
    }
  }

  stepHTML (step: Step): string {
    let html: string
    let defaulthtml = `
      ${step.html_instructions}
      <table>
        <tr>
          <th><b>${step.duration.text}</b></th>
          <th><b>${step.distance.text}</b></th>
        </tr>
      </table>
    `
    if step.travel_mode === TravelMode.TRANSIT {
      const details = step.transit_details
      html = `
        <div class="transit-details">
          <div>
            <b style="color: ${details.line.color}">
              ${details.line.short_name}
            </b></br>
            ${defaulthtml}
          </div>
          <img src="${details.line.vehicle.icon}"></img>
        </div>
      `
    } else {
      html = defaulthtml
    }
    return html
  }

  get steps (): Step[] {
    return this.route.steps
  }

  get overview_polyline (): Waypoint[] {
    const encoded: string = this.route.overview_polyline.points
    const waypoints: Waypoint[] = this.decodePoly(encoded)
    return waypoints
  }

  get duration (): string {
    return this.route.duration.text
  }

  get distance (): string {
    return this.route.distance.text
  }

}
</script>
<style>
.crib-route-tooltip .transit-details {
    display: flex
}
.crib-route-tooltip .transit-details img {
  height: 100%;
  margin: 0.4em
}
.crib-route-tooltip table {
  width: 100%
}
</style>
