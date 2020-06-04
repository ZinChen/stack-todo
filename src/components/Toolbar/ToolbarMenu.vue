<template lang="pug">
  q-menu
    q-list
      q-item(clickable)
        q-item-section(
          @click="logout"
        ) Logout
      q-item(clickable)
        q-item-section(
          @click="toggleAbout"
        ) About
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'toolbar-menu',
  methods: {
    ...mapMutations([
      'toggleAbout',
    ]),
    ...mapActions([
      'logout',
    ])
  }
}
</script>
