<template>
  <v-layout row>
    <v-flex>
      <DirectionsBtn :property="property"></DirectionsBtn>
    </v-flex>
    <v-flex>
      <FavoriteBtn :property="property"></BanBtn>
    </v-flex>
    <v-flex>
      <BanBtn :property="property"></BanBtn>
    </v-flex>
    <v-flex>
      <ViewBtn :property="property"></ViewBtn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Property } from '../../store/properties/types'

import FavoriteBtn from './FavoriteBtn'
import BanBtn from './BanBtn'
import ViewBtn from './ViewBtn'
import DirectionsBtn from './DirectionsBtn'

@Component({ components: {
  FavoriteBtn,
  BanBtn,
  ViewBtn,
  DirectionsBtn
}})
export default class PropertyActions extends Vue {
  @Prop(Property) property: Property
}
</script>
