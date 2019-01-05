<template>
  <v-app dark id="crib">
    <Toolbar :title="title"></Toolbar>
    <v-content class="maxheight">
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
import { Component, Vue, Watch} from 'vue-property-decorator'
import { State, namespace } from 'vuex-class'
import { VAlert } from 'vuetify/lib'

import Toolbar from './components/toolbar/Toolbar.vue'
import GlobalAlert from './components/alert/GlobalAlert.vue'

@Component({components: {Toolbar, GlobalAlert}})
export default class App extends Vue {
  title: string = 'Crib'

  @Watch('$route', { immediate: true, deep: true })
  onUrlChange (newVal: any) {
    this.$store.dispatch('alert/clear')
  }
}
</script>
<style scoped>
#crib {
  max-height: 100vh;
}
.maxheight {
max-height: 100vh;
}
</style>
