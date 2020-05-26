<template lang="pug">
  q-layout.layout
    .section.screen-section.editor-section(
      key="editor"
      :class="{'active-section': pageState.screen == 'editor'}"
    )
      todo-editor

    .section.screen-section.stacks-section(
      key="stacks"
      :class="{'active-section': pageState.screen == 'stacks'}"
    )
      todo-stacks

    fab-menu-editor
    fab-menu-stacks
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'
import TodoStacks from '../components/Stacks/TodoStacks'
import TodoEditor from '../components/Editor/TodoEditor'
import FabMenuEditor from '../components/FabMenu/FabMenuEditor'
import FabMenuStacks from '../components/FabMenu/FabMenuStacks'

export default {
  name: 'PageIndex',
  components: { TodoStacks, TodoEditor, FabMenuStacks, FabMenuEditor },
  computed: {
    ...mapState([
      'pageState'
    ])
  },
  created: function () {
    const user = firebase.auth().currentUser
    if (user) {
      this.$store.dispatch('bindFirestoreTodosRef', user)
      this.$store.dispatch('bindFirestoreStacksRef', user)
    }
  },
}
</script>
