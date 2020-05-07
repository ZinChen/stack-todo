<template lang="pug">
  .stack-item(
    :style="{ zIndex }"
  )
    .stack-header
      .stack-info
        .stack-title {{ stack.title }}
        .stack-progress
          | {{ todos.length }} / {{ todosCount }}
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
      transition-group(
        leave-active-class="done"
      )
        .stack-todo-item(
          v-for="todo in todosReversed"
          :key="todo.id"
          :class="todoClass(todo)"
          :style="todoStyle(todo)"
          @click="todoClick(todo)"
          v-touch-swipe.mouse="(event) => handleSwipe(todo, event)"
        )
          .stack-todo-item-content {{ todo.title }}

    .stack-todo-item.stack-todo-item-ghost
</template>

<style lang="sass">
  @import '../css/todo-stack-css'
  @import '../css/todo-stack-animation'
</style>

<script>
import pull from 'lodash/pull'

const animationTime = 1000
const preloaderLeaving = 1000

export default {
  name: 'todo-stack-css',
  props: [ 'stack', 'todos', 'todosCount', 'zIndex' ],
  data: function () {
    return {
      directionSign: 1,
      todoProps: {}, // id: { class, style }
    }
  },
  computed: {
    todosReversed () {
      return this.todos.slice().reverse()
    },
  },
  created () {
    // TODO: create another array to show todos
    // TODO: clicking on todo opens "modal" with full todo title
    this.currentTodo = this.todos.length > 0 ? this.todos[0] : {}
    this.todos.forEach((todo, index) => {
      const delay = this.todos.length - index
      const animationDelay = delay / 10 + 's'
      this.$set(this.todoProps, todo.id, { class: ['appear'], style: { animationDelay } })

      setTimeout(() => {
        this.$set(this.todoProps, todo.id, { class: [], style: {} })
      }, delay * 100 + animationTime + preloaderLeaving)
    })

    this.$watch('todos', (newItems, oldItems) => {
      const oldIds = oldItems.map(todo => todo.id)
      const newIds = newItems.map(todo => todo.id)
      const deleted = oldItems.filter(todo => !newIds.includes(todo.id))
      const added = newItems.filter(todo => !oldIds.includes(todo.id))

      // TODO: Track order changing
      if (deleted.length) {
        deleted.forEach(todo => this.$set(this.todoProps, todo.id, {}))
      }

      if (added.length) {
        added.forEach(todo => {
          this.$set(this.todoProps, todo.id, {})

          const todoClass = todo.doneDate ? 'undone' : 'appear'
          this.$set(this.todoProps[todo.id], 'class', [todoClass])

          setTimeout(() => {
            this.$set(this.todoProps[todo.id], 'class', [])
          }, animationTime)
        })
      }
    })
  },
  methods: {
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
        this.$set(this.todoProps[nextTodo.id], 'class', ['something'])
      }

      this.$emit('swap-todo', this.stack)
    },
    swapTodoBack () {
      const todo = this.todos[0]
      const prevTodo = this.todos[this.todos.length - 1]

      this.$set(this.todoProps[prevTodo.id], 'class', ['swap-up'])
      // workaround for list with 2 items
      if (this.todos.length == 2) {
        this.$set(this.todoProps[todo.id], 'class', ['something'])
      }

      this.$emit('swap-todo-back', this.stack)
    },
    todoIsDone (todo) {
      todo.done = true
      todo.doneDate = new Date()
      this.$emit('update-todo', todo)
    },
  }
}
</script>
