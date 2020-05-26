<template lang="pug">
.fab-editor
  transition(
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  )
    q-page-sticky.fab-container(
      v-show="isEditorSimpleView"
      position="bottom-right"
      :offset="[25,25]"
    )
      transition(
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
      )
        q-btn.second-fab(
          @click="deleteAllDoneTodos"
          v-show="isDoneTodos"
          fab
          color="accent"
          icon="delete_sweep"
        )
      transition(
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
      )
        q-btn.second-fab(
          v-show="isEditorHistory"
          @click="restoreByHistory"
          fab
          color="accent"
          icon="undo"
        )
      q-btn(
        @click="toggleView"
        fab
        color="accent"
        icon="dynamic_feed"
      )
        //- icon="remove_red_eye"

  transition(
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  )
    q-page-sticky.fab-container(
      v-show="isEditorInputEditing"
      position="bottom-right"
      :offset="[25,25]"
    )
      q-btn(
        @click="saveNewItem"
        fab
        color="accent"
        icon="save"
      )

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'fab-menu-editor',
  computed: mapGetters([
    'isEditorSimpleView',
    'isDoneTodos',
    'isEditorHistory',
    'isEditorInputEditing'
  ]),
  methods: mapActions([
    'toggleView',
    'deleteAllDoneTodos',
    'restoreByHistory',
    'saveNewItem'
  ])
}
</script>
