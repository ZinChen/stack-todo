<template lang="pug">
  q-toolbar.bg-white
    q-avatar.bg-grey.cursor-pointer
      img.toolbar-avatar(
        v-if="user.photoURL"
        :src="user.photoURL"
      )
      toolbar-menu

    q-toolbar-title
      | {{ user.email }}

    q-btn(
      v-if="toolbar.pwaButton"
      @click="onPWAInstall"
      color="purple"
      label="Install as App"
    )

    about-modal
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ToolbarMenu from './ToolbarMenu'
import AboutModal from './AboutModal'

export default {
  name: 'toolbar',
  components: { ToolbarMenu, AboutModal },
  computed: mapState([
    'user',
    'toolbar'
  ]),
  methods: mapActions([
    'onPWAInstall',
  ])
}
</script>
