<template>
<v-data-iterator
  :items="properties"
  :rows-per-page-items="rowsPerPageItems"
  :pagination.sync="pagination"
  :value="[currentProperty]"
  content-tag="v-layout"
  disable-initial-sort
  row wrap
  >
  <v-flex slot="item" slot-scope="props" lg4>
    <v-card
      class="ma-1"
      @click="setCurrentProperty(props.item)"
      :id="'listentry' + props.index">
      <v-card-title
        v-bind:class="{ 'teal darken-2': props.selected, 'pa-2': true, 'text-truncate': true}">
        <h4>
          {{ props.item.propertyTypeFullDescription }}
          {{ props.item.displayAddress }}
        </h4>
      </v-card-title>
      <v-layout row wrap>
        <v-flex class="pr-1">
          <v-img
            :src="props.item.propertyImages[0]"
            :aspect-ratio="656/437"
            >
            <v-card class="images-info">
              <v-layout row style="align-items: center">
                <v-icon v-if="props.item.floorplanImages.length">view_quilt</v-icon>
                <v-icon>camera_alt</v-icon>
                <v-flex>{{ props.item.propertyImages.length }}</v-flex>
              </v-layout>
            </v-card>
          </v-img>
        </v-flex>
        <v-flex>
          <v-img
            :src="props.item.propertyImages[1]"
            :aspect-ratio="656/437"
            ></v-img>
        </v-flex>
      </v-layout>
      <v-divider light></v-divider>
      <v-card-actions v-bind:class="{ 'teal darken-2': props.selected, 'pa-1': true}">
        <b>£{{ props.item.price.amount}} pcm</b>
        <v-spacer></v-spacer>
        <b>{{props.item.toWork ? props.item.toWork.duration.text : ""}}</b>
        <v-spacer></v-spacer>
        <FavoriteBtn :property="props.item"></FavoriteBtn>
        <BanBtn :property="props.item"></BanBtn>
      </v-card-actions>
    </v-card>
  </v-flex>
</v-data-iterator>
</template>

<script lang="ts">
import { Component, Vue, Watch} from 'vue-property-decorator'
import { Property } from '../../store/properties/types'
import { Action, namespace } from 'vuex-class'

import FavoriteBtn from './FavoriteBtn'
import BanBtn from './BanBtn'

const propns = namespace('properties')

@Component({ components: {
  FavoriteBtn,
  BanBtn
}})
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
    this.adjustPage()
    // this.$vuetify.goTo('#listentry' + this.currentIndex % this.pagination.rowsPerPage, {offset: -100})
  }
  
  adjustPage () {
    const pag = this.pagination
    const oldpage = this.pagination.page
    pag.page = Math.ceil((this.currentIndex + 1) / pag.rowsPerPage)
    if (pag.page != oldpage) {
      this.pagination = pag
    }
  }
}
</script>

<style scoped>
.images-info {
  position: absolute;
  left: 4px;
  top: 4px;
  z-index: 1;
}
</style>
