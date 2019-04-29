<template>
  <v-toolbar dense>
    <v-toolbar-items>
      <v-combobox
        v-model="priceSelection"
        :items="prices"
        label="Max. Price"
        type="number"
        hint="Set maximum pcm."
        prefix="£"
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

@Component
export default class SearchBar extends Vue {
  @propns.State maxPrice
  @propns.Action setMaxPrice
  @propns.Getter count
  @propns.State currentIndex
  @propns.State properties
  @propns.State showMap
  @propns.State showDetails
  @propns.State showList
  @propns.Action setCurrentProperty
  @propns.Action toggleMap
  @propns.Action toggleDetails
  @propns.Action toggleList
  
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
  
  set propertyIndex (index) {
    if (this.indexRule(index) === true) {
      const prop = this.properties[index - 1]
      this.setCurrentProperty(prop)
    }
  }
  
  indexRule (index) {
    return (index > 0 && index <= this.properties.length) || 'Invalid index.'
  }
}
</script>