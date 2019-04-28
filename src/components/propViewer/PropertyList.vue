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
          <v-card v-bind:class="{ 'grey darken-1': props.selected}">
            <v-card-title><h4>{{ props.item.propertyTypeFullDescription }} {{ props.item.displayAddress }}</h4></v-card-title>
          </v-card>
        </v-flex>
    </v-data-iterator>
</template>

<script lang="ts">
  import { Component, Vue} from 'vue-property-decorator'
import { Property } from '../../store/properties/types'
import { Action, namespace } from 'vuex-class'

const propns = namespace('properties')

@Component
export default class PropertyList extends Vue {
  @propns.State properties
  @propns.State currentProperty

  rowsPerPageItems = [4, 8, 12]
  pagination = {
    rowsPerPage: 4
    page: 3
  }
}
</script>
