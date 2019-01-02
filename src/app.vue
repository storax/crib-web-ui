<template>
  <v-app>
    <v-container fluid class="ma-0 pa-0">
    <crib-toolbar :title="title"></crib-toolbar>
    <v-container fluid class="ma-0 pa-0">
      <v-alert shrink
        class="ma-0"
        :value="alert.message"
        :type="alert.type"
        transition="scale-transition">
        {{alert.message}}
      </v-alert>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  title: string = 'Crib'
  
  get alert() {
    return this.$store.state.alert
  }
  
  @Watch('$route', {immediate: true, deep: true})
  onUrlChange(newVal: any) {
    this.$store.dispatch('alert/clear')
  }
}
</script>
