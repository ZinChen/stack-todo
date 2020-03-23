<template lang="pug">
  .todo-stack-item(
    :class="{ 'perspective': isMove }"
  )
    .stack-header
      .stack-title {{ stack.title }}
      .stack-progress
        | {{ doneCount }} of {{ todosCount }} is done
      //- @click="todoClick(currentTodo)"
    .stack-todo-item(
      @touchstart="todoMoveTouchStart"
      @mousedown="todoMoveStart"
      v-bind:style="todoStyle"
      :class="{ 'no-transition': isMoveDelay, 'fast-transition': isMove }"
    )
      | todo {{ currentTodo.done }}
      .stack-todo-item-content {{ currentTodo.title }}
      //- finish - swipe, double-click, hold
</template>

<script>
import clamp from 'lodash/clamp'

export default {
  name: 'todo-stack',
  props: [ 'stack' ],
  data: function() {
    return {
      isMove: false,
      isMoveDelay: false,
      moveCoords: {
        dx: 0,
        dy: 0,
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
      if ( !this.isMove ) {
        return {}
      }

      const {
        dx,
        dy
      } = this.moveCoords
      let rotateX = dy * Math.abs(dy / 2) / this.initialMove.el.height
      rotateX *= -1 // in another direction
      rotateX = clamp(rotateX, -20 , 20)

      let rotateY = dx * Math.abs(dx / 2) / this.initialMove.el.width
      rotateY = clamp(rotateY, -25, 25)

      let dz = this.isMove ? 30 : 0

      return {
        transform: `
          translate3d( ${dx}px, ${dy}px, ${dz}px )
          rotateY( ${rotateY}deg )
          rotateX( ${rotateX}deg )
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
      this.isMove = true
      setTimeout(() => {
        this.isMoveDelay = true
      }, 100)
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
      document.addEventListener('mouseup', this.todoMoveEnd, false)
      // document.addEventListener('mouseout', this.todoMoveEnd, false)
    },
    // TODO: only on long touch
    todoMoveTouchStart (e) {
      const touch = e.touches[0]
      const target = (e.targetTouches[0] || {}).target

      e.preventDefault()

      this.isMove = true
      setTimeout(() => {
        this.isMoveDelay = true
      }, 100)
      this.initialMove = {
        x: touch.pageX,
        y: touch.pageY,
        el: {
          width: target.offsetWidth,
          height: target.offsetHeight,
        }
      }

      document.addEventListener('touchmove', this.todoMoveTouch)
      document.addEventListener('touchend', this.todoMoveEnd, false)
    },
    todoMove (e) {
      this.moveCoords.dx = e.pageX - this.initialMove.x
      this.moveCoords.dy = e.pageY - this.initialMove.y
    },
    todoMoveTouch (e) {
      const touch = e.touches[0]
      this.moveCoords.dx = touch.pageX - this.initialMove.x
      this.moveCoords.dy = touch.pageY - this.initialMove.y
    },
    todoMoveEnd (e) {
      this.moveCoords.dx = 0
      this.moveCoords.dy = 0
      this.isMove = false
      this.isMoveDelay = false
      document.removeEventListener('mousemove', this.todoMove)
      document.removeEventListener('touchmove', this.todoMoveTouch)
    }
  }
}
</script>
