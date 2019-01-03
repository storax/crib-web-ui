<template>
<v-container>
  <v-layout justify-center align-center column>
    <v-flex>
      <h2>Login</h2>
    </v-flex>
    <v-flex>
      <v-form @submit="authenticate">
        <v-text-field
          v-validate="'required'"
          v-model="username"
          :disabled="loggingIn"
          :error-messages="errors.collect('username')"
          label="Username"
          data-vv-name="username"
          required
          ></v-text-field>
        <v-text-field
          type="password"
          v-validate="'required'"
          v-model="password"
          :disabled="loggingIn"
          :error-messages="errors.collect('password')"
          label="Password"
          data-vv-name="password"
          required
          ></v-text-field>
        <v-btn type="submit" :disabled="loggingIn">Login</v-btn>
        <v-progress-circular v-if="loggingIn"
                             indeterminate
    color="primary"
  ></v-progress-circular>
  </v-form>
</v-flex>
</v-layout>
</v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate);

const authns = namespace('authentication')
const alertns = namespace('alert')

@Component
export default class LoginPage extends Vue {
  username: string = ''
  password: string = ''
  
  @authns.Getter('loggingIn') loggingIn
  @authns.Action('logout') logout
  @authns.Action('login') login
  @alertns.Action('clear') clearAlert

  created () {
    this.logout()
  }

  authenticate () {
    const { username, password } = this
    if (username && password) {
      this.clearAlert()
      this.login({ username, password })
    }
  }
}

</script>
