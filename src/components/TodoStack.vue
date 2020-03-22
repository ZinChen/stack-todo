<template lang="pug">
  .todo-stack-item
    .stack-header
      .stack-title {{ stack.title }}
      .stack-progress
        | {{ doneCount }} of {{ todosCount }} is done
      //- @click="todoClick(currentTodo)"
    .stack-todo-item(
      @touchstart="todoMoveStart"
      @mousedown="todoMoveStart"
      v-bind:style="todoStyle"
      :class="{ 'no-transition': move }"
    )
      | todo {{ currentTodo.done }}
      .stack-todo-item-content {{ currentTodo.title }}
      //- finish - swipe, double-click, hold
</template>

<script>
export default {
  name: 'todo-stack',
  props: [ 'stack' ],
  data: function() {
    return {
      move: false,
      moveCoords: {
        x: 0,
        y: 0,
      },
      initialMove: {
        el: {
          width: 0
        }
      }
    }
  },
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
    },
    todoStyle () {
      return {
        transform: `
          translate( ${this.moveCoords.x}px, ${ this.moveCoords.y}px )
          rotateX( ${this.moveCoords.x / this.initialMove.el.width * 50}deg )
          rotateY( ${this.moveCoords.y / this.initialMove.el.height * 50}deg )
        `
      }
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
    },
    todoMoveStart (e) {
      this.move = true
      this.initialMove = {
        x: e.pageX,
        y: e.pageY,
        el: {
          width: e.target.offsetWidth,
          height: e.target.offsetHeight,
        }
      }
      console.log('start', e)

      document.addEventListener('mousemove', this.todoMove)
      document.addEventListener('touchmove', this.todoMove)
      document.addEventListener('mouseup', this.todoMoveEnd, false)
      document.addEventListener('touchend', this.todoMoveEnd, false)
      // document.addEventListener('mouseout', this.todoMoveEnd, false)
    },
    todoMove (e) {
      this.moveCoords.x = e.pageX - this.initialMove.x
      this.moveCoords.y = e.pageY - this.initialMove.y
    },
    todoMoveEnd (e) {
      this.moveCoords.x = 0
      this.moveCoords.y = 0
      this.move = false
      document.removeEventListener('mousemove', this.todoMove)
      document.removeEventListener('touchmove', this.todoMove)
    }
  }
}
</script>
