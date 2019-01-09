<template v-if="ok">
<l-polyline v-if="!detailed"
  :lat-lngs="overview_polyline"
  :fill="false"
  :weight="weight">
  <l-tooltip :options="tooltipOpt" class="crib-route-tooltip">
    <b>{{duration}}</b></br>
    <b>{{distance}}</b>
  </l-tooltip>
</l-polyline>
<div v-else>
<l-polyline v-for="(step, index) in steps"
  :dashArray="stepDash(step)"
  :key="'pl' + index"
  :lat-lngs="decodePoly(step.polyline.points)"
  :color="stepColor(step)"
  :fill="false"
  :weight="weight">
  <l-tooltip :options="tooltipOptDetails" class="crib-route-tooltip">
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

import { DirectionsData, RouteData, Leg, Step, TravelMode, Waypoint } from './types'

@Component({components: {
  LPolyline,
  LTooltip,
  LCircleMarker
}})
export default class Route extends Vue {
  @Prop() data: DirectionsData
  detailed = false
  weight = 6
  tooltipOpt = {
    permanent: true
  }
  tooltipOptDetails = {
    sticky: true
  }

  get route (): RouteData {
    return this.data.routes[0]
  }

  get leg (): Leg {
    return this.route.legs[0]
  }

  get ok (): boolean {
    return this.data.status === 'OK'
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
    return this.leg.steps
  }

  get overview_polyline (): Waypoint[] {
    const encoded: string = this.route.overview_polyline.points
    const waypoints: Waypoint[] = this.decodePoly(encoded)
    return waypoints
  }

  get duration (): string {
    return this.leg.duration.text
  }

  get distance (): string {
    return this.leg.distance.text
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
