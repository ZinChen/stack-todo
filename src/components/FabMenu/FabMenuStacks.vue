<template lang="pug">
transition(
  appear
  enter-active-class="animated zoomIn"
  leave-active-class="animated zoomOut"
)
  q-page-sticky.fab-container(
    v-show="pageState.screen == 'stacks'"
    position="bottom-right"
    :offset="[25,25]"
  )
    transition(
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    )
      q-btn(
        v-show="lastDone"
        @click="undoLastTodo"
        transition="fade"
        fab
        color="accent"
        icon="undo"
      )
    q-btn(
      @click="toggleView"
      fab
      color="accent"
      icon="edit"
    )
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'fab-menu-stacks',
  computed: {
    ...mapState([
      'pageState'
    ]),
    ...mapGetters([
      'isStacksScreen',
      'lastDone',
    ]),
  },
  methods: mapActions([
    'toggleView',
    'undoLastTodo'
  ])
}
</script>
