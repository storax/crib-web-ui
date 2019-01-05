<template>
  <v-alert shrink
     class="ma-0"
     :value="alertmessage"
     :type="alerttype"
     transition="scale-transition">
     {{alertmessage}}
   </v-alert>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { VAlert } from 'vuetify/lib'

const alertns = namespace('alert')

@Component
export default class GlobalAlert extends Vue {
  @alertns.State('type') alerttype
  @alertns.State('message') alertmessage
}
</script>
