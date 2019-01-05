<template>
  <v-toolbar app>
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title class="white--text">{{title}}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat to="/">Home</v-btn>
      <v-btn flat to="/login">{{ logbtnText }}</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class'

const authns = namespace('authentication')

@Component
export default class Toolbar extends Vue {
  @Prop(String) title!: string
  
  @authns.Getter('loggedIn') isAuthenticated
  @authns.Getter('username') username

  get logbtnText() {
    return (this.isAuthenticated ? 'Logout ' + this.username : 'Login')
  }
}
</script>
