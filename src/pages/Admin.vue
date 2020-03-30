<template lang="pug">
  .layout
    .section
      .container
        .stacks Stacks:
          p {{stacks}}

        .todos Todos:
          p {{todos}}
</template>

<script>
import firebase from 'firebase'
import { fireApp } from 'boot/fire.js'

export default {
  name: 'PageAdmin',
  beforeCreate: function() {
    this.$root.$on('state_update', (state) => {
      if (state === 'logged_in') {
        const user = firebase.auth().currentUser
        const stacksRef = fireApp.firestore()
          .collection('users')
          .doc(user.uid)
          .collection('stacks')

        this.stacksRef = stacksRef
        this.$bind('stacks', stacksRef)

        const todosRef = fireApp.firestore()
          .collection('users')
          .doc(user.uid)
          .collection('todos')

        this.todosRef = todosRef
        this.$bind('todos', todosRef)

      } else {
        this.unbind('stacks')
      }
    })
  },
  data: function() {
    return {
      stacks: [],
      todos: []
    }
  },
  methods: {
  }
}
</script>
