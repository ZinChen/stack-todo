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
              v-for="todo in stackTodos(stack.id)"
            )
              p(
                v-if="todo.done"
              ) Done
              .field.has-addons
                .control
                  input.input.todo-list-item-content(
                    v-model="todo.title"
                    @blur="updateTodo(todo)"
                  )
                .control
                  .button.is-error(
                    @click="deleteTodo(todo)"
                  ) X
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
            v-on:update-todo="updateTodo"
            v-on:swap-todo="swapTodo"
            :key="stack.id"
            :stack="stack"
            :todos="stackTodos(stack.id)"
          )

    q-page-sticky(
      position="bottom-right"
      :offset="[25,25]"
    )
      q-btn(
        fab
        @click="undoLastTodo"
        :disable="!lastUndone"
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
import orderBy from 'lodash/orderBy'
import TodoStack from '../components/TodoStack'

export default {
  name: 'PageIndex',
  components: { TodoStack },
  beforeCreate: function() {
    this.$root.$on('state_update', (state) => {
      if (state === 'logged_in') {
        // Todo: track, when collections received
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
  data () {
    return {
      todos: [],
      stacks: [],
      screen: 'stacks',
    }
  },
  computed: {
    stackTodos() {
      return stackId => orderBy(this.todos.filter(todo => todo.stackId === stackId ), 'order', 'asc')
    },
    lastUndone () {
      let lastTodo = { doneDate: 0 }
      this.todos.find(todo => {
        if (todo.done && todo.doneDate > lastTodo.doneDate) {
          lastTodo = todo
        }
      })
      return lastTodo.done && lastTodo
    }
  },
  methods: {
    lastTodoOfStack (stackId) {
      const stackTodos = this.todos.filter(todo => todo.stackId === stackId)
      return stackTodos.length && orderBy(stackTodos, 'order', 'desc')[0]
    },
    toggleView () {
      if (this.screen === 'stacks') {
        this.screen = 'editor'
      } else {
        this.screen = 'stacks'
      }
    },
    createTodo (stack) {
      const lastTodo = this.lastTodoOfStack(stack.id)
      const order = lastTodo && lastTodo.order + 1
      const todo = {
        stackId: stack.id,
        title: stack.newTodoTitle,
        createdAt: new Date(),
        order
      }


      stack.newTodoTitle = ''

      this.todosRef.add(todo)
    },
    updateTodo (todo) {
      this.todosRef.doc(todo.id).update(todo)
    },
    deleteTodo (todo) {
      this.todosRef.doc(todo.id).delete()
    },
    createStack () {
      this.stacksRef.add({
        title: ''
      })
    },
    updateStack (stack) {
      // console.log('stack', stack)
      this.stacksRef.doc(stack.id).update(stack)
    },
    undoLastTodo (e) {
      const lastTodo = this.lastUndone

      if (lastTodo) {
        lastTodo.done = false
        lastTodo.doneDate = firebase.firestore.FieldValue.delete()
        this.updateTodo(lastTodo)
      }
    },
    swapTodo (stack) {
      const stackTodos = orderBy(this.todos.filter(todo => todo.stackId === stack.id ), 'order', 'asc')
      const currentTodo = stackTodos[0]

      const batch = fireApp.firestore().batch()

      stackTodos.forEach((todo) => {
        const isCurrentTodo = todo.order == currentTodo.order
        if (isCurrentTodo) {
          batch.update(this.todosRef.doc(currentTodo.id), { order: 0 })
        } else {
          batch.update(this.todosRef.doc(currentTodo.id), { order: todo.order + 1})
        }
      })

      batch.commit()
    }
  }
}
</script>
