<template lang="pug">
  .layout
    .section
      .container
        q-btn(
          color="amber"
          @click="addOrders"
        ) Add orders

        q-btn(
          color="amber"
          @click="restoreTodayTodos"
        ) Restore today
    .section
      .container
        div loadingState:
          p {{loadingState}}

        div All Stacks:
          p {{allStacks}}

        div All Todos:
          p {{allTodos}}

        .stacks Stacks:
          p {{stacks}}

        .todos Todos:
          p {{todos}}
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'
import { fireApp, todosRefGetter, stacksRefGetter } from 'boot/fire.js'
import orderBy from 'lodash/orderBy'

export default {
  name: 'PageAdmin',
  computed: {
    todayDoneTodos () {
      const dayBeforeDate = new Date(new Date().setDate(new Date().getDate() - 1))
      return this.allTodos.filter(todo => todo.deletedAt && todo.deletedAt.toDate() > dayBeforeDate)
    },
    ...mapState([
      'loadingState',
      'authState',
      'stacks',
      'todos',
      'allTodos',
      'allStacks'
    ]),
  },
  watch: {
    authState (value) {
      if (value == 'logged_in') {
        const user = firebase.auth().currentUser
        this.stacksRef = stacksRefGetter(user)
        this.todosRef = todosRefGetter(user)

        this.$store.dispatch('bindFirestoreAllTodosRef')
        this.$store.dispatch('bindFirestoreAllStacksRef')
      }
    }
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
    },
    restoreTodayTodos () {
      this.todayDoneTodos.forEach(todo => {
        this.$store.dispatch('updateTodo', {
          ...todo,
          id: todo.id,
          deleted: false
        })
      })
    }
  }
}
</script>
