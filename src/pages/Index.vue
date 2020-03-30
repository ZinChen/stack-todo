<template lang="pug">
  q-layout.layout
    .section(
      key="editor"
      v-if="screen == 'editor'"
    )
      .container.todo-lists

        .todo-list(
          v-for="stack in stacks"
        )
          .todo-list-header
            input.input.todo-list-title(
              v-model="stack.title"
              placeholder="Stack title"
              @blur="updateStack(stack)"
            )
          .todo-list-items
            .todo-list-item(
              v-for="todo in stack.todos"
            )
              p(
                v-if="todo.done"
              ) Done
              input.input.todo-list-item-content(
                v-model="todo.title"
                @blur="updateStack(stack)"
              )
            .todo-list-item.create-todo-list-item
              input.input.todo-list-item-content(
                v-model="stack.newTodoTitle",
                placeholder="Type new todo"
                v-on:keyup.enter="createTodo(stack)"
              )

        .create-todo-list(
          @click="createStack"
        )
          i.fa.fa-plus-circle
    .section(
      key="stacks"
      v-if="screen == 'stacks'"
    )
      .container
        .todo-stack-list
          todo-stack(
            v-for="stack in stacks"
            v-on:update-stack="updateStack"
            :key="stack.id"
            :stack="stack"
          )

    q-page-sticky(
      position="bottom-right"
      :offset="[25,25]"
    )
      q-btn(
        fab
        @click="undoLastTodo"
        color="accent"
        icon="undo"
      )
      q-btn(
        fab
        @click="toggleView"
        color="accent"
        icon="edit"
      )
      //- q-fab(
      //-   icon="more_horiz"
      //-   direction="up"
      //-   persistent=true
      //-   color="amber"
      //- )
      //-   q-fab-action(
      //-     @click="toggleView"
      //-     color="accent"
      //-     icon="edit"
      //-   )
      //-   q-fab-action(
      //-     @click="undoLastTodo"
      //-     color="accent"
      //-     icon="undo"
      //-   )

</template>

<script>
import firebase from 'firebase'
import { fireApp } from 'boot/fire.js'
import TodoStack from '../components/TodoStack'

export default {
  name: 'PageIndex',
  components: { TodoStack },
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
      } else {
        this.unbind('stacks')
      }
    })
  },
  data () {
    return {
      stacks: [],
      screen: 'stacks',
    }
  },
  methods: {
    toggleView () {
      if (this.screen === 'stacks') {
        this.screen = 'editor'
      } else {
        this.screen = 'stacks'
      }
    },
    createTodo (stack) {
      stack.todos.push({
        title: stack.newTodoTitle,
      })

      stack.newTodoTitle = ''

      this.updateStack(stack)
    },
    createStack () {
      this.stacksRef.add({
        title: '',
        todos: []
      })
    },
    updateStack (stack) {
      // console.log('stack', stack)
      this.stacksRef.doc(stack.id).update(stack)
    },
    undoLastTodo (e) {
      let lastTodo = false
      let lastStack = false
      this.stacks.find(stack => {
        stack.todos.find(todo => {
          if (!lastTodo || todo.done && todo.doneDate > lastTodo.doneDate) {
            lastTodo = todo
            lastStack = stack
          }
        })
      })

      lastTodo.done = false
      lastTodo.doneDate = false
      this.updateStack(lastStack)
    }
  }
}
</script>
