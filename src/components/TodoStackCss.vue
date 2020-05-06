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

export default {
  name: 'todo-stack-css',
  props: [ 'stack', 'todos', 'todosCount', 'zIndex' ],
  data: function () {
    return {
      directionSign: 1,
      todoProps: {}, // id: { class }
    }
  },
  computed: {
    todosReversed () {
      return this.todos.slice().reverse()
    },
  },
  created () {
    this.currentTodo = this.todos.length > 0 ? this.todos[0] : {}
    this.todos.forEach((todo, index) => {
      const animationDelay = (this.todos.length - index) / 10 + 's'
      this.$set(this.todoProps, todo.id, { class: ['appear'], style: { animationDelay } })
      // TODO:
      // clicking on todo opens "modal" with full todo title
    })

    this.$watch('todos', (newItems, oldItems) => {
      const oldIds = oldItems.map(todo => todo.id)
      const newIds = newItems.map(todo => todo.id)
      const deleted = oldItems.filter(todo => !newIds.includes(todo.id))
      const added = newItems.filter(todo => !oldIds.includes(todo.id))

      if (deleted.length) {
        deleted.forEach(todo => this.$set(this.todoProps, todo.id, {}))
      }

      if (added.length) {
        added.forEach(todo => {
          this.$set(this.todoProps, todo.id, {})
          const todoClass = todo.doneDate ? 'undone' : 'appear'
          this.$set(this.todoProps[todo.id], 'class', [todoClass])
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

      const nextTodoClass = this.todos.length > 2
        ? this.todoProps[nextTodo.id].class.filter(classy => classy == 'swap')
        : ['active']

      this.$emit('swap-todo', this.stack)

      this.$set(this.todoProps[nextTodo.id], 'class', nextTodoClass)
      this.$set(this.todoProps[nextTodo.id], 'style', {})

      setTimeout(() => {
        // Trying to reduce glitch
        this.$set(this.todoProps[todo.id], 'class', ['swap'])
        this.$set(this.todoProps[todo.id], 'style', {})
      }, 5)
    },
    swapTodoBack () {
      const todo = this.todos[0]
      const prevTodo = this.todos[this.todos.length - 1]

      const todoClass = this.todos.length > 2
        ? this.todoProps[todo.id].class.filter(classy => classy == 'swap')
        : ['active']

      this.$emit('swap-todo-back', this.stack)

      this.$set(this.todoProps[todo.id], 'class', [todoClass])
      this.$set(this.todoProps[todo.id], 'style', {})

      setTimeout(() => {
        // Trying to reduce glitch
        this.$set(this.todoProps[prevTodo.id], 'class', ['swap-up'])
        this.$set(this.todoProps[prevTodo.id], 'style', {})
      }, 5)
    },
    todoIsDone (todo) {
      this.$set(this.todoProps[todo.id], 'class', ['done'])
      this.$set(this.todoProps[todo.id], 'style', {})
      // wait for animation ends
      setTimeout(() => {
        todo.done = true
        todo.doneDate = new Date()
        this.$emit('update-todo', todo)
      }, 700)
    },
  }
}
</script>
