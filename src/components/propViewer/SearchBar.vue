<template>
  <v-toolbar dense>
    <v-toolbar-items>
      <v-combobox
        v-model="priceSelection"
        :items="prices"
        label="Price"
        type="number"
        hint="Set maximum pcm."
        return-object
        ></v-combobox>
    </v-toolbar-items>
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
  
  prices = [1000, 1200, 1300, 1350, 1400, 1421, 1450, 1500]
  get priceSelection () {
    return this.maxPrice
  }
  
  set priceSelection (value: number) {
    this.setMaxPrice(Number(value))
  }
}
</script>
