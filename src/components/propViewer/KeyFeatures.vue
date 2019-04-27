<template>
  <v-card>
    <v-card-title class="pb-1">
      <h3>Key Features</h3>
    </v-card-title>
  <v-layout row wrap class="pr-3 pl-3 pb-3">
    <v-flex
      v-for="(feature, index) in property.keyFeatures"
      :key="index"
      xs6>
      <v-card tile class="ma-1 grey darken-2">
        <v-card-text class="pa-1">
        <b>• {{ feature }}</b>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator'
import { Property } from '../../store/properties/types'

@Component
export default class KeyFeatures extends Vue {
  @Prop(Property) property: Property
}
</script>
