<template>
  <v-card>
    <v-card-title class="pb-1">
      <h3>Letting Information</h3>
    </v-card-title>
    <v-card-text class="pt-0">
      <table>
        <tbody>
        <tr
          v-for="(info, name) in property.lettingInformation"
          :key="name">
          <td><b>{{name}}:</b></td>
          <td>{{info}}</td>
        </tr>
        </tbody>
      </table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator'
import { Property } from '../../store/properties/types'

@Component
export default class LettingInformation extends Vue {
  @Prop(Property) property: Property
}
</script>

<style scoped>
table {
  border-spacing: 0.5em; 
}
</style>
