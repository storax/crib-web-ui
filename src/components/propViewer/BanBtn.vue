<template>
  <v-btn @click="ban(property)" flat icon :color="property.banned ? 'pink' : 'white'">
    <v-icon>block</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator'
import { Property } from '../../store/properties/types'
import { Action, namespace } from 'vuex-class'

const propns = namespace('properties')

@Component
export default class BanBtn extends Vue {
  @Prop(Property) property: Property
  @propns.Action ban
}
</script>
