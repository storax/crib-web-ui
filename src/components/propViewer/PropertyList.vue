<template>
    <v-data-iterator
      :items="properties"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      :value="[currentProperty]"
      content-tag="v-layout"
      disable-initial-sort
      column
    >
        <v-flex slot="item" slot-scope="props">
          <v-card v-bind:class="{ 'grey darken-1': props.selected}" @click="setCurrentProperty(props.item)">
            <v-card-title><h4>{{ props.item.propertyTypeFullDescription }} {{ props.item.displayAddress }}</h4></v-card-title>
            <v-img
              :src="props.item.propertyImages[0]"
              :aspect-ratio="656/437"
              ></v-img>
          </v-card>
        </v-flex>
    </v-data-iterator>
</template>

<script lang="ts">
  import { Component, Vue, Watch} from 'vue-property-decorator'
import { Property } from '../../store/properties/types'
import { Action, namespace } from 'vuex-class'

const propns = namespace('properties')

@Component
export default class PropertyList extends Vue {
  @propns.State properties
  @propns.State currentProperty
  @propns.State currentIndex
  @propns.Action setCurrentProperty
  
  rowsPerPageItems = [4, 8, 12]
  pagination = {
    rowsPerPage: 12,
    page: 1
  }
  
  @Watch('currentIndex')
  onChange (newVal) {
    const pag = this.pagination
    const oldpage = this.pagination.page
    pag.page = Math.ceil((this.currentIndex + 1) / pag.rowsPerPage)
    if (pag.page != oldpage) {
      this.pagination = pag
    }
  }
}
</script>
