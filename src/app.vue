<template>
  <v-app class="fullheight">
    <v-container fluid class="ma-0 pa-0">
    <Toolbar :title="title"></Toolbar>
    <v-container fluid class="ma-0 pa-0">
      <v-alert shrink
        class="ma-0"
        :value="alertmessage"
        :type="alerttype"
        transition="scale-transition">
        {{alertmessage}}
      </v-alert>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch} from 'vue-property-decorator'
import { State, namespace } from 'vuex-class'
import { VAlert } from 'vuetify/lib'

import Toolbar from './components/toolbar/Toolbar.vue'

const alertns = namespace('alert')

@Component({components: {Toolbar}})
export default class App extends Vue {
  title: string = 'Crib'

  @alertns.State('type') alerttype
  @alertns.State('message') alertmessage

  @Watch('$route', { immediate: true, deep: true })
  onUrlChange (newVal: any) {
    this.$store.dispatch('alert/clear')
  }
}

</script>

<style scoped>
  .fullheight {
  max-height: 100vh
  }
</style>
