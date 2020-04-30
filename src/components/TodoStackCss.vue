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
        q-icon.stack-bg-icon(
          name="emoji_events"
        )
        .stack-todo-item(
          v-for="todo in todosReversed"
          :key="todo.id"
          :class="todoClass(todo)"
          v-touch-swipe.mouse="(event) => handleSwipe(todo, event)"
        )
          .stack-todo-item-content {{ todo.title }}

      .stack-todo-item.stack-todo-item-ghost
        .stack-todo-item-content
          | {{ currentTodo.title }}
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
    console.log('created')
    this.currentTodo = this.todos.length > 0 ? this.todos[0] : {}
    this.todos.forEach((todo, index) => {
      this.$set(this.todoProps, todo.id, { class: ['invisible'] })
      // TODO:
      // better intro animation
      // create test page for animation
      // create loader with little animated icons: todos falling in stacks and scroll down, preloader slides up
      // clicking on todo opens "modal" with full todo title
      setTimeout(() => this.$set(this.todoProps[todo.id], 'class', ['appear']), 100 * (this.todos.length - index))
    })

    this.$watch('todos', (newItems, oldItems) => {
      const oldIds = oldItems.map(todo => todo.id)
      const newIds = newItems.map(todo => todo.id)
      const deleted = oldItems.filter(todo => !newIds.includes(todo.id))
      const added = newItems.filter(todo => !oldIds.includes(todo.id))

      if (deleted.length || added.length) {
        console.log('deleted', deleted)
        console.log('added', added)
      }

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
    handleSwipe (todo, { direction = false } = {}) {
      if (['left', 'right'].includes(direction)) {
        // this.todoProps.directionSign = direction === 'right' ? 1 : -1
        this.todoIsDone(todo)
      } else if (['top', 'down'].includes(direction)) {
        this.swapTodo()
      }
    },
    swapTodo () {
      const todo = this.todos[0]
      const nextTodo = this.todos[1]
      let nextTodoClass = this.todoProps[nextTodo.id].class

      if (this.todos.length == 2) {
        nextTodoClass = ['active']
      } else {
        nextTodoClass = nextTodoClass.filter(classy => classy == 'swap')
      }

      this.$set(this.todoProps[todo.id], 'class', ['swap'])
      this.$set(this.todoProps[nextTodo.id], 'class', nextTodoClass)

      this.$emit('swap-todo', this.stack)
    },
    todoIsDone (todo) {
      this.$set(this.todoProps[todo.id], 'class', ['done'])
      setTimeout(() => {
        todo.done = true
        todo.doneDate = new Date()
        this.$emit('update-todo', todo)
      }, 500)
    },
  }
}
</script>
