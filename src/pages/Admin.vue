<template lang="pug">
  .layout
    .section
      .container
        q-btn(
          color="amber"
          @click="addOrders"
        ) Add orders
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
import orderBy from 'lodash/orderBy'

export default {
  name: 'PageAdmin',
  data: function () {
    return {
      stacks: [],
      todos: []
    }
  },
  beforeCreate: function () {
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
  methods: {
    addOrders () {
      this.stacks.forEach(stack => {
        orderBy(this.todos.filter(todo => todo.stackId === stack.id), 'createdAt', 'asc').reduce((order, todo) => {
          this.todosRef.doc(todo.id).update({ order })
          return ++order
        }, 0)
      })
    },
    addDeleted () {
      this.stacks.forEach(stack => {
        this.stacksRef.doc(stack.id).update({ deleted: false })
        this.todos.forEach(todo => {
          this.todosRef.doc(todo.id).update({ deleted: false })
        })
      })
    },
    addCreatedAtToStacks () {
      this.stacks.forEach((stack, index) => {
        if (!stack.createdAt) {
          let date = new Date()
          date.setDate(date.getDate() - index)
          console.log('date', date)
          this.stacksRef.doc(stack.id).update({ createdAt: date })
        }
      })
    }
  }
}
</script>
