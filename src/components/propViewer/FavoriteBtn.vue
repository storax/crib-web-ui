<template>
  <v-btn @click="favorite(property)" flat icon :color="property.favorite ? 'pink' : 'white'">
    <v-icon>favorite</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator'
import { Property } from '../../store/properties/types'
import { Action, namespace } from 'vuex-class'

const propns = namespace('properties')

@Component
export default class FavoriteBtn extends Vue {
  @Prop(Property) property: Property
  @propns.Action favorite
}
</script>
