<template>
<v-toolbar dense>
  <v-toolbar-items>
    <v-btn class="teal darken-2" flat @click="getProperties">
      <v-icon>search</v-icon>
    </v-btn>
    <v-combobox
      class="mr-4 ml-4"
      style="width: 7em"
      v-model="priceSelection"
      :items="prices"
      label="Max. Price"
      type="number"
      hint="Set maximum pcm."
      prefix="£"
      ></v-combobox>
    <v-flex>
      <v-label class="v-input">Max. Duration</v-label>
      <v-slider class="mr-2"
                v-model="maxDuration"
                thumb-label
                :thumb-size="16"
                ></v-slider>
    </v-flex>
    <v-btn
      flat
      icon
      :input-value="onlyFavorite"
      @click="toggleOnlyFavorite()"
      :color="onlyFavorite ? 'pink' : 'white'">
      <v-icon>favorite</v-icon>
    </v-btn>
    <v-combobox
      class="mr-4 ml-4"
      style="width: 7em"
      :items="searchAreas"
      v-model="searchArea"
      label="Search Areas"
      ></v-combobox>
  </v-toolbar-items>
  <v-spacer></v-spacer>
  <v-toolbar-items>
    <v-btn flat :input-value="showMap" @click="toggleMap()">
      <v-icon>map</v-icon>
    </v-btn>
    <v-btn flat :input-value="showDetails" @click="toggleDetails()">
      <v-icon>description</v-icon>
    </v-btn>
    <v-btn flat :input-value="showList" @click="toggleList()">
      <v-icon>list</v-icon>
    </v-btn>
  </v-toolbar-items>
  <v-spacer></v-spacer>
  <v-flex shrink>
    <v-text-field
      v-model="propertyIndex"
      :rules="[indexRule]"
      type="number"
      :suffix="'/ ' + count"
      class="text-lg-right"
      style="width: 7em"
      ></v-text-field>
  </v-flex>
</v-toolbar>
</template>

<script lang="ts">
  import { Component, Vue, Prop} from 'vue-property-decorator'
import { State, Action, namespace } from 'vuex-class'

const propns = namespace('properties')
const dirns = namespace('directions')

@Component
export default class SearchBar extends Vue {
  @propns.State maxPrice
  @propns.Action setMaxPrice
  @propns.Action getProperties
  @propns.Getter count
  @propns.State currentIndex
  @propns.State properties
  @propns.State showMap
  @propns.State showDetails
  @propns.State showList
  @propns.State onlyFavorite
  @propns.Getter('searchArea') _searchArea
  @propns.State('searchAreas') _searchAreas
  @propns.Action getSearchAreas
  @propns.Action setSearchArea
  @propns.Mutation setOnlyFavorite
  @propns.Action setCurrentProperty
  @propns.Action toggleMap
  @propns.Action toggleDetails
  @propns.Action toggleList
  @dirns.State('maxDuration') _maxDuration
  @dirns.Mutation setMaxDuration
  
  prices = [1000, 1200, 1300, 1350, 1400, 1421, 1450, 1500]
  get priceSelection () {
    return this.maxPrice
  }
  
  set priceSelection (value: number) {
    this.setMaxPrice(Number(value))
  }
  
  get propertyIndex () {
    return this.currentIndex + 1
  }
  
  get searchAreas () {
    const areas = []
    for (let i of this._searchAreas) {
      areas.push(i.name)
    }
    return areas
  }
  
  get searchArea () {
    return this.searchAreaName || "default"
  }
  
  set searchArea (value) {
    const existing = this._searchAreas.find(i => i.name === value)
    const geojson = existing ? existing.geojson : this._searchArea.geojson
    this.setSearchArea({name: value, geojson: geojson})
  }

  set propertyIndex (index) {
    if (this.indexRule(index) === true) {
      const prop = this.properties[index - 1]
      this.setCurrentProperty(prop)
    }
  }
  
  indexRule (index) {
    return (index > 0 && index <= this.properties.length) || 'Invalid index.'
  }
  
  set maxDuration (maxDuration: number) {
    const dur = maxDuration * 60
    this.setMaxDuration(dur)
  }
  
  get maxDuration () {
    return this._maxDuration / 60
  }
  
  toggleOnlyFavorite () {
    this.setOnlyFavorite(!this.onlyFavorite)
  }
  
  created () {
    this.getSearchAreas()
  }
}
</script>
