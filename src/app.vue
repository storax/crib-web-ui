<template>
  <v-app dark>
    <Toolbar :title="title"></Toolbar>
    <v-content>
      <GlobalAlert></GlobalAlert>
      <router-view></router-view>
    </v-content>
    <v-footer app>
      <span class="pa-2">Crib</span>
      <v-spacer></v-spacer>
      <span class="pa-2">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, namespace } from 'vuex-class'
import { VAlert } from 'vuetify/lib'

import Toolbar from './components/toolbar/Toolbar.vue'
import GlobalAlert from './components/alert/GlobalAlert.vue'
import eventHub from './events'

@Component({
  components: {
    Toolbar,
    GlobalAlert
  }
})
export default class App extends Vue {
  title: string = 'Crib'

  @Watch('$route', { immediate: true, deep: true })
  onUrlChange (newVal: any) {
    this.$store.dispatch('alert/clear')
  }

  created () {
    console.log('Event listener added')
    window.addEventListener('keyup', this.onKey)
  }

  beforeDestroy () {
    console.log('Event listener removed')
    window.removeEventListener('keyup', this.onKey)
  }

  onKey (event) {
    eventHub.$emit('keyup', event)
  }
}
</script>
