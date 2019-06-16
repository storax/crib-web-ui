<template>
  <l-geo-json ref="drawnArea" :geojson="searchAreaGeoJson"/>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
import {
  L,
  LGeoJson
} from 'vue2-leaflet'
import { namespace } from 'vuex-class'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

const propns = namespace('properties')

@Component({components: {
  LGeoJson
}})
export default class EditableArea extends Vue {
  @propns.Action setSearchArea
  @propns.Action getProperties
  @propns.Getter searchArea
  @propns.State searchAreaName
  
  drawControl = null
  routeareastyle = {
    weight: 2,
    color: 'cyan',
    opacity: 0.7,
    fillColor: 'cyan',
    fillOpacity: 0.2
  }
  
  $refs!: {
    drawnArea: LGeoJson
  }
  
  get map () {
    return this.$refs.drawnArea.parentContainer.mapObject
  }
  
  get searchAreaGeoJson () {
    return this.searchArea.geojson || { type: 'FeatureCollection', features: [] }
  }
  
  mounted () {
    this.$nextTick(() => {
      
      this.drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true
          },
          polyline : false,
          rectangle : false,
          circle : false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: this.$refs.drawnArea.mapObject,
          poly: {
            allowIntersection: false
          }
        }
      })
      
      this.map.addControl(this.drawControl)
      
      this.map.on(L.Draw.Event.CREATED, this.onDrawCreated)
      this.map.on(L.Draw.Event.EDITED, this.onDrawEdited)
      this.map.on(L.Draw.Event.DELETED, this.onDrawDeleted)
    })
  }
  
  onDrawCreated (e) {
    const layer = e.layer
    this.$refs.drawnArea.mapObject.addLayer(layer)
    this.setSearchArea({name: this.searchAreaName, geojson: this.$refs.drawnArea.mapObject.toGeoJSON()})
    this.getProperties()
    
  }
  
  onDrawEdited (e) {
    const layer = e.layer
    this.setSearchArea({name: this.searchAreaName, geojson: this.$refs.drawnArea.mapObject.toGeoJSON()})
    this.getProperties()
  }
  
  onDrawDeleted (e) {
    const layer = e.layer
    this.setSearchArea({name: this.searchAreaName, geojson: this.$refs.drawnArea.mapObject.toGeoJSON()})
    this.getProperties()
  }

  beforeDestroy () {
    this.drawControl.remove()
    this.map.off(L.Draw.Event.CREATED, this.onDrawCreated)
    this.map.off(L.Draw.Event.EDITED, this.onDrawEdited)
    this.map.off(L.Draw.Event.DELETED, this.onDrawDeleted)
  }
</script>

<style scoped>
</style>
