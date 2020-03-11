<template lang="pug">
  .layout
    .section
      .container
        p.title
         | my plan:
        ul.list
          li.list-item make stack todo
          li.list-item we have a page with ability to create and edit many todo lists
          li.list-item than we have another screen, where we can pick last todo from every list

    .section
      .container
          button.button.navigation(
            v-if="screen == 'editor'"
            @click="screen = 'stacks'"
          ) Go to Stacks

          button.button.navigation(
            v-if="screen == 'stacks'"
            @click="screen = 'editor'"
          ) Go to Editor

          button.button.navigation(
            @click="updateStacks"
          ) update stacks
    transition(
      :name="transitionName"
      mode="out-in"
    )
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
              :key="stack.id"
              :stack="stack"
            )
</template>

<script>
import firebase from 'firebase'
import { fireApp } from 'boot/fire.js'
// import { differenceWith, isEqual } from 'lodash'
import TodoStack from '../components/TodoStack'

// let stacks = []

// if (localStorage.todoStacks) {
//   // we are optimistic and don't use try/catch :D
//   stacks = JSON.parse(localStorage.todoStacks)
// }

export default {
  name: 'PageIndex',
  components: { TodoStack },
  beforeCreate: function() {
    this.$root.$on('state_update', (state) => {
      const user = firebase.auth().currentUser
      const stacksRef = fireApp.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('stacks')

      this.state = state
      this.stacksRef = stacksRef
      this.$bind('stacks', stacksRef)
    })
  },
  data () {
    return {
      stacks: [],
      screen: 'stacks',
      state: 'i'
    }
  },
  methods: {
    createTodo (stack) {
      stack.todos.push({
        title: stack.newTodoTitle
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
      console.log('stack', stack)
      this.stacksRef.doc(stack.id).update(stack)
    }
  },
  computed: {
    transitionName () {
      return this.screen === 'stacks' ? 'slide-left' : 'slide-right'
    }
  },
  watch: {
    stacks: {
      deep: true,
      handler (stacks) {
        // let differ = differenceWith(stacks, oldStacks, isEqual)
      }
    }
  },
}
</script>
