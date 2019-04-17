<template>
  <v-btn :href="property.propertyUrl" target="_blank" class="green">
    View
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator'
import { Property } from '../../store/properties/types'

@Component
export default class ViewBtn extends Vue {
  @Prop(Property) property: Property
}
</script>
