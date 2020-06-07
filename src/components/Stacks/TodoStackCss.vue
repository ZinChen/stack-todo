<template lang="pug">
  .stack-item(
    :style="{ zIndex }"
  )
    .stack-header
      .stack-info
        .stack-title {{ stack.title }}
        .stack-progress
          | {{ todos.length }} / {{ allTodos.length }}
      .stack-buttons
        q-btn(
          v-if="todos.length > 1"
          @click="swapTodo"
          round
          color="orange-4"
          icon="cached"
        )
    .stack-todos
      .stack-bg
        //- TODO: show only when last todo finished, add some animations
        q-icon.stack-bg-icon(
          name="emoji_events"
        )
      .stack-todo-item(
        v-for="todo in todos.slice().reverse()"
        :key="todo.id"
        :ref="`todoRef${todo.id}`"
        :class="todoClass(todo)"
        :style="todoStyle(todo)"
        @click="todoClick(todo)"
        v-touch-swipe.mouse="(event) => handleSwipe(todo, event)"
      )
        .stack-todo-item-content {{ todo.title }}

    .stack-todo-item.stack-todo-item-ghost
</template>

<style lang="sass">
  @import '../../css/todo-stack-css'
  @import '../../css/todo-stack-animation'
</style>

<script>
import { mapGetters } from 'vuex'
import pull from 'lodash/pull'
import isEmpty from 'lodash/isEmpty'

const animationTime = 1000
const preloaderLeaving = 0

export default {
  name: 'todo-stack-css',
  props: [ 'stack', 'allTodos', 'todos', 'zIndex' ],
  data: function () {
    return {
      directionSign: 1,
      todoProps: {}, // id: { class, style }
    }
  },
  created () {
    // TODO: create another array to show todos <--
    // TODO: clicking on todo opens "modal" with full todo title
    this.currentTodo = this.todos.length > 0 ? this.todos[0] : {}
    this.todos.forEach((todo, index) => {
      const delay = this.todos.length - index
      const animationDelay = delay / 10 + 's'
      this.$set(this.todoProps, todo.id, { class: ['appear'], style: { animationDelay } })
      this.setTodoAnimationCallback(todo, () => {
        this.$set(this.todoProps[todo.id], 'class', ['dummy'])
      })
    })

    this.$watch('todos', (newItems, oldItems) => {
      const oldIds = oldItems.map(todo => todo.id)
      const newIds = newItems.map(todo => todo.id)
      const deleted = oldItems.filter(todo => !newIds.includes(todo.id))
      const added = newItems.filter(todo => !oldIds.includes(todo.id))

      // TODO: Track order changing
      if (deleted.length) {
        deleted.forEach(todo => {
          if ((this.todoProps[todo.id] || {}).class == 'done') {
            this.$set(this.todoProps, todo.id, {})
          } else {
            this.showDeletion(todo)
          }
        })
      }

      if (added.length) {
        added.forEach(todo => {
          this.$set(this.todoProps, todo.id, {})

          const todoClass = todo.doneDate ? 'undone' : 'appear'
          this.$set(this.todoProps[todo.id], 'class', [todoClass])

          this.setTodoAnimationCallback(todo, () => {
            this.$set(this.todoProps[todo.id], 'class', ['dummy'])
          })
        })
      }
    })
  },
  mounted () {
    this.todos.forEach((todo, index) => {
      this.setTodoAnimationCallback(todo, () => {
        this.$set(this.todoProps, todo.id, { class: [], style: {} })
      })
    })
  },
  methods: {
    setTodoAnimationCallback (todo, callback) {
      const todoRef = (this.$refs[`todoRef${todo.id}`] || [ false ])[0]
      todoRef && todoRef.addEventListener('animationend', () => {
        callback()
      }, { once: true })
    },
    showDeletion (todo) {
      this.todos.unshift(todo)
      this.$set(this.todoProps[todo.id], 'class', [ 'done' ])
      this.setTodoAnimationCallback(todo, () => {
        const todoIndex = this.todos.findIndex(t => t.id == todo.id)
        this.todos.splice(todoIndex, 1)
        this.$set(this.todoProps, todo.id, {})
      })
    },
    todoClass (todo) {
      return this.todoProps[todo.id].class
    },
    todoStyle (todo) {
      return this.todoProps[todo.id].style
    },
    todoClick (todo) {
      console.log('clicked')
    },
    handleSwipe (todo, { direction = false } = {}) {
      if (todo.id != this.todos[0].id) {
        return
      }

      if (['left', 'right'].includes(direction)) {
        // this.todoProps.directionSign = direction === 'right' ? 1 : -1
        this.todoIsDone(todo)
      } else if (direction == 'down') {
        this.swapTodo()
      } else if (direction == 'up') {
        this.swapTodoBack()
      }
    },
    swapTodo () {
      const todo = this.todos[0]
      const nextTodo = this.todos[1]

      this.$set(this.todoProps[todo.id], 'class', ['swap'])
      // workaround for list with 2 items
      if (this.todos.length == 2) {
        this.$set(this.todoProps[nextTodo.id], 'class', ['dummy'])
      }

      this.$store.dispatch('swapTodo', this.stack)
    },
    swapTodoBack () {
      const todo = this.todos[0]
      const prevTodo = this.todos[this.todos.length - 1]

      this.$set(this.todoProps[prevTodo.id], 'class', ['swap-up'])

      // workaround for list with 2 items
      if (this.todos.length == 2) {
        this.$set(this.todoProps[todo.id], 'class', ['dummy'])
      }

      this.$store.dispatch('swapTodoBack', this.stack)
    },
    todoIsDone (todo) {
      this.$set(this.todoProps[todo.id], 'class', ['done'])

      this.setTodoAnimationCallback(todo, () => {
        const update = {
          done: true,
          doneDate: new Date()
        }

        this.$store.dispatch('updateTodo', { todo, update })
      })
    },
  }
}
</script>
