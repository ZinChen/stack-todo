<template lang="pug">
  .stack-item(
    :class="{ 'active-stack': isMove }"
  )
    .stack-header
      .stack-info
        .stack-title {{ stack.title }}
        .stack-progress
          | {{ todos.length }} / {{ todosCount }}
      .stack-buttons
        q-btn(
          round
          @click="swapTodo"
          color="orange-4"
          icon="cached"
        )
    .stack-todos
      .stack-bg
        q-icon.stack-bg-icon(
          name="emoji_events"
        )
      transition-group(
        @enter="enterTodo"
        @leave="leaveTodo"
        :css="false"
      )
        .stack-todo-wrapper(
          v-for="todo in todosReversed"
          :key="todo.id"
        )
          .stack-todo-item(
            v-if="todo.title == currentTodo.title"
            :ref="'todoRef_' + todo.id"
            v-touch:swipe="handleSwipe"
            class="current-todo"
          )
            .stack-todo-item-content {{ todo.title }}
          .stack-todo-item(
            v-else
            :ref="'todoRef_' + todo.id"
          )
            .stack-todo-item-content {{ todo.title }}
      .stack-todo-item.stack-todo-item-ghost
        .stack-todo-item-content
          | {{ currentTodo.title }}
</template>

<style lang="sass">
  @import '../css/todo-stack-animation'
</style>

<script>
export default {
  name: 'todo-stack-css',
  props: [ 'stack', 'todos', 'todosCount' ],
  data: function () {
    return {
      isMove: false,
      directionSign: 1
    }
  },
  computed: {
    currentTodo () {
      return this.todos.length > 0 ? this.todos[0] : {}
    },
    todosReversed () {
      return this.todos.slice().reverse()
    },
    todoRef () {
      return (todo) => {
        return (this.$refs[`todoRef_${todo.id}`] || [ false ])[0]
      }
    }
  },
  methods: {
    handleSwipe (direction) {
      console.log('this is swipe')
      if (!this.isMove && ['left', 'right'].includes(direction)) {
        this.todoProps.directionSign = direction === 'right' ? 1 : -1
        // this.isMove = true
        this.todoIsDone()
      } else {}
    },
    enterTodo (el, done) {
      console.log('enter', el)
      done()
    },
    leaveTodo (el, done) {
      // add class
      // this.animateAway({ el, done })
    },
    swapTodo () {
      const todoRef = this.todoRef(this.currentTodo)
      const todoRefWrapper = (todoRef || {}).parentNode
      const nextTodoRef = ((this.$refs[`todoRef_${this.todos[1].id}`] || [])[0])

      // this.isMove = true

      this.$emit('swap-todo', this.stack)
    },
    todoIsDone () {
      const todo = this.currentTodo
      todo.done = true
      todo.doneDate = new Date()

      this.$emit('update-todo', todo)
    },
  }
}
</script>
