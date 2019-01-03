<template>
  <v-app>
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
import { Route } from 'vue-router'
import { State } from 'vuex-class'
import { VAlert } from 'vuetify/lib'

import Toolbar from './components/toolbar/crib-toolbar.vue'

@Component({components: {Toolbar}})
export default class App extends Vue {
  title: string = 'Crib'
  
  @State('alert.type') alerttype
  @State('alert.message') alertmessage
  
}
</script>
