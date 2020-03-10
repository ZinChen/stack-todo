<template lang="pug">
  .todo-stack-item
    .stack-header
      .stack-title {{ stack.title }}
      .stack-progress
        | {{ doneCount }} of {{ todosCount }} is done
    .stack-todo-item(
      @click="todoClick(currentTodo)"
    )
      | todo {{ currentTodo.done }}
      .stack-todo-item-content {{ currentTodo.title }}
      //- finish - swipe, double-click, hold
</template>

<script>
export default {
  name: 'todo-stack',
  props: [ 'stack' ],
  computed: {
    currentTodo () {
      const currentTodo = this.stack.todos.find(todo => !todo.done) || {}
      return currentTodo
    },
    todosCount () {
      return this.stack.todos.length
    },
    doneCount () {
      return this.stack.todos.filter(todo => todo.done).length
    }
  },
  methods: {
    todoClick (currentTodo) {
      const todoIndex = this.stack.todos.findIndex(todo =>
        todo.title === currentTodo.title
      )
      if (todoIndex > -1) {
        this.$set(this.stack.todos[todoIndex], 'done', true)
      }
    }
  }
}
</script>
