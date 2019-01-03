<template>
  <v-toolbar dark color="primary">
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
import { State } from 'vuex-class'

@Component
export default class Toolbar extends Vue {
  @Prop(String) title!: string
  
  @State('authentication.status.loggedIn') isAuthenticated
  @State('authentication.user') user

  get logbtnText() {
    return (this.isAuthenticated ? 'Logout' : 'Login')
  }

  get username() {
    return this.user ? this.user.username : ''
  }
}

</script>
