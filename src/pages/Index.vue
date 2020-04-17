<template lang="pug">
  q-layout.layout
    .section(
      key="editor"
      v-if="screen == 'editor'"
    )
      .container.todo-lists

        .todo-list(
          v-for="stack in stacks"
          :key="stack.id"
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
              .field.has-addons
                p.control
                  .button(
                    @click="toggleTodoDone(todo)"
                  )
                    q-icon(
                      v-if="todo.done"
                      name="done"
                    )
                    q-icon(
                      v-else
                    )
                p.control.todo-input
                  input.input.todo-list-item-content(
                    name="todo"
                    v-model="todo.title"
                    @blur="updateTodo(todo)"
                  )
                p.control
                  .button.is-error(
                    @click="deleteTodo(todo)"
                  )
                    q-icon(
                      name="close"
                    )
            .todo-list-item.create-todo-list-item
              input.input.todo-list-item-content(
                v-model="stack.newTodoTitle",
                placeholder="Type new todo"
                v-on:keyup.enter="createTodo(stack)"
              )
          .todo-list-buttons
            q-btn(
              round
              icon="delete"
              v-if="!stackTodos(stack.id).length"
              color="deep-orange-9"
              @click="deleteStack(stack)"
            )

        .create-todo-list
          q-btn(
            fab
            @click="createStack"
            icon="fas fa-plus"
            color="white"
            text-color="grey-5"
          )
    .section(
      key="stacks"
      v-if="screen == 'stacks'"
    )
      .container
        .todo-stack-list
          todo-stack(
            v-for="stack in filteredStacks"
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
        v-show="screen == 'stacks'"
        transition="fade"
        fab
        @click="undoLastTodo"
        :disable="!lastUndone"
        color="accent"
        icon="undo"
      )
      q-btn(
        v-show="screen == 'editor'"
        fab
        @click="restoreByHistory"
        color="accent"
        icon="undo"
      )
      q-btn(
        v-show="screen == 'editor'"
        fab
        @click="deleteAllDoneTodos"
        color="accent"
        icon="delete"
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

const bindFirebase = function (context) {
  // Todo: track, when collections received
  const user = firebase.auth().currentUser
  const stacksRef = fireApp.firestore()
    .collection('users')
    .doc(user.uid)
    .collection('stacks')

  context.stacksRef = stacksRef
  context.$bind('stacks', stacksRef.where('deleted', "==", false)
    .orderBy('createdAt')
    // .then(() => {
    //   // TODO: check when all will be loaded
    // })
  )

  const todosRef = fireApp.firestore()
    .collection('users')
    .doc(user.uid)
    .collection('todos')

  context.todosRef = todosRef
  context.$bind('todos', todosRef.where('deleted', "==", false)
    .orderBy('order')
    // .then(() => {
    //   // TODO: check when all will be loaded
    // })
  )
}

export default {
  name: 'PageIndex',
  components: { TodoStack },
  data () {
    return {
      todos: [],
      stacks: [],
      editorHistory: [],
      screen: 'editor', // 'stacks',
    }
  },
  computed: {
    stackTodos () {
      return stackId => orderBy(this.todos.filter(todo => todo.stackId === stackId), 'order', 'asc')
    },
    filteredStacks () {
      const nonEmptyStackIds = [...new Set(this.todos.map(todo => todo.stackId))]
      return this.stacks.filter(stack => nonEmptyStackIds.includes(stack.id))
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
  beforeCreate: function () {
    // weird workaround for hotreload
    firebase.auth().currentUser && setTimeout(() => bindFirebase(this), 100)

    this.$root.$on('state_update', (state) => {
      if (state === 'logged_in') {
        bindFirebase(this)
      } else {
        this.$unbind('stacks')
        this.$unbind('todos')
      }
    })
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
        this.saveNewTodos()
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
        deleted: false,
        order
      }

      stack.newTodoTitle = ''

      this.todosRef.add(todo)
    },
    updateTodo (todo) {
      this.todosRef.doc(todo.id).update(todo)
    },
    deleteTodo (todo) {
      this.editorHistory.push({
        type: 'todo',
        id: todo.id
      })
      this.todosRef.doc(todo.id).update({
        deleted: true,
        deletedAt: new Date(),
      })
    },
    createStack () {
      this.stacksRef.add({
        createdAt: new Date(),
        title: '',
        deleted: false,
      })
    },
    updateStack (stack) {
      this.stacksRef.doc(stack.id).update(stack)
    },
    deleteStack (stack) {
      this.editorHistory.push({
        type: 'stack',
        id: stack.id
      })
      this.stacksRef.doc(stack.id).update({
        deleted: true,
        deletedAt: new Date(),
      })
    },
    saveNewTodos () {
      this.stacks.forEach(stack => {
        if (stack.newTodoTitle) {
          this.createTodo(stack)
        }
      })
    },
    deleteAllDoneTodos () {
      let doneTodoIds = this.todos.filter(todo => todo.done).map(todo => todo.id)
      this.editorHistory.push({
        type: 'todo_batch',
        ids: doneTodoIds
      })

      const batch = fireApp.firestore().batch()

      doneTodoIds.forEach(todoId => {
        this.todosRef.doc(todoId).update({
          deleted: true,
          deletedAt: new Date()
        })
      })

      batch.commit()
    },
    restoreByHistory () {
      const {
        editorHistory: history
      } = this

      if (!history.length) {
        return false
      }

      const historyItem = history.splice(history.length - 1, 1)[0]

      const newValue = {
        deleted: false,
        deletedAt: firebase.firestore.FieldValue.delete(),
      }

      switch (historyItem.type) {
        case 'todo':
          this.todosRef.doc(historyItem.id).update(newValue)
          break

        case 'stack':
          this.stacksRef.doc(historyItem.id).update(newValue)
          break

        case 'todo_batch':
          const batch = fireApp.firestore().batch()

          historyItem.ids.forEach(id => {
            this.todosRef.doc(id).update(newValue)
          })

          batch.commit()
          break

        default:
          break
      }
    },
    toggleTodoDone (todo) {
      if (todo.done) {
        todo.done = false
        todo.doneDate = firebase.firestore.FieldValue.delete()
      } else {
        todo.done = true
        todo.doneDate = new Date()
      }
      this.updateTodo(todo)
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
      const stackTodos = orderBy(this.todos.filter(todo => todo.stackId === stack.id && !todo.done), 'order', 'asc')
      const currentTodo = stackTodos[0]

      const batch = fireApp.firestore().batch()

      stackTodos.forEach((todo) => {
        const isCurrentTodo = todo.order == currentTodo.order
        if (isCurrentTodo) {
          batch.update(this.todosRef.doc(currentTodo.id), { order: 0 })
        } else {
          batch.update(this.todosRef.doc(currentTodo.id), { order: todo.order + 1 })
        }
      })

      batch.commit()
    }
  }
}
</script>
