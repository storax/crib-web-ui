<template>
  <v-btn @click="getToWork(property)">
    Directions
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator'
import { Property } from '../../store/properties/types'
import { Action, namespace } from 'vuex-class'

const propns = namespace('properties')

@Component
export default class DirectionsBtn extends Vue {
  @Prop(Property) property: Property
  @propns.Action getToWork
}
</script>
