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

        button.button.is-info(
          @click="resetStacks"
        ) Reset stacks

    .section
      .container
        | State: {{ state }}
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
              )
            .todo-list-items
              .todo-list-item(
                v-for="todo in stack.todos"
              )
                input.input.todo-list-item-content(
                  v-model="todo.title"
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
import TodoStack from '../components/TodoStack'

const defaultStacks = [
  {
    id: 1,
    title: 'Stack title',
    todos: [
      {
        title: 'This is todo'
      },
      {
        title: 'This is todo too'
      }
    ]
  },
  {
    id: 2,
    title: 'Stack 2 title',
    todos: [
      {
        title: 'This is todo 2'
      },
      {
        title: 'This is todo too 2'
      }
    ]
  }
]

const clone = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// let stacks = clone(defaultStacks)

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
      console.log('test here', state)
      console.log('stacksRef', stacksRef)
      this.state = state
      this.$bind('stacks', stacksRef)
      this.stacksRef = stacksRef
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
    },
    createStack () {
      const lastStackId = (this.stacks || []).length ? this.stacks[this.stacks.length - 1].id : 0
      this.stacks.push({
        id: lastStackId + 1,
        title: '',
        todos: []
      })
    },
    resetStacks () {
      this.stacks = clone(defaultStacks)
    },
    updateStacks () {
      // for test purposes only
      // this.stacks.forEach(stack => {
      //   this.stacksRef && this.stacksRef.add(stack)
      // })
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
        // if (localStorage) {
        //   localStorage.todoStacks = JSON.stringify(stacks)
        // }
      }
    }
  },
}
</script>
