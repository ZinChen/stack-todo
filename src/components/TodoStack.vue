<template lang="pug">
  .stack-item(
    :class="{ 'perspective': isMove }"
  )
    .stack-header
      .stack-title {{ stack.title }}
      .stack-progress
        | {{ notDoneCount }} / {{ todosCount }} left
      //- @click="todoClick(currentTodo)"
    .stack-todo-item(
      @touchstart="todoMoveTouchStart"
      @mousedown="todoMoveStart"
      v-bind:style="todoStyle"
      :class="{ 'no-transition': isMoveDelay, 'fast-transition': isMove }"
    )
      .stack-todo-item-content {{ currentTodo.title }}
      //- finish - swipe, double-click, hold
</template>

<script>
import clamp from 'lodash/clamp'
import findLast from 'lodash/findLast'

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
    currentTodoIndex () {
      return this.stack.todos.findIndex(todo => !todo.done)
    },
    todosCount () {
      return this.stack.todos.length
    },
    doneCount () {
      return this.stack.todos.filter(todo => todo.done).length
    },
    notDoneCount () {
      return this.stack.todos.filter(todo => !todo.done).length
    },
    todoStyle () {
      if ( !this.isMove ) {
        return {}
      }

      const {
        dx,
        dy
      } = this.moveCoords

      // multiply 'dy' just to rid of linear values
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
    todoClick () {
      const lastDone = findLast(this.stack.todos, todo => todo.done)
      if (lastDone) {
        lastDone.done = false
      }
    },
    todoMoveStart (e) {
      this.initTodoMove(e)

      document.addEventListener('mousemove', this.todoMove)
      document.addEventListener('mouseup', this.todoMoveEnd, false)
      // document.addEventListener('mouseout', this.todoMoveEnd, false)
    },
    // TODO: only on long touch
    todoMoveTouchStart (e) {
      const touche = e.targetTouches[0]
      this.initTodoMove(touche)
      e.preventDefault()

      document.addEventListener('touchmove', this.todoMoveTouch)
      document.addEventListener('touchend', this.todoMoveEnd, false)
    },
    initTodoMove (e) {
      this.isMove = true

      const timeOfTransition = 100
      setTimeout(() => {
        if (this.isMove) {
          this.isMoveDelay = true
        }
      }, timeOfTransition)

      this.initialMove = {
        x: e.pageX,
        y: e.pageY,
        el: {
          width: e.target.offsetWidth,
          height: e.target.offsetHeight,
        }
      }

      // console.log('start', e)
    },
    todoMove (e) {
      this.calcMoveCoords(e)
    },
    todoMoveTouch (e) {
      const touch = e.touches[0]
      this.calcMoveCoords(touch)
    },
    calcMoveCoords (e) {
      // TODO: limit dy and dx
      this.moveCoords.dx = e.pageX - this.initialMove.x
      this.moveCoords.dy = e.pageY - this.initialMove.y
    },
    todoMoveEnd (e) {
      if (!this.moveCoords.dx && !this.moveCoords.dy && !this.isMoveDelay) {
        this.todoClick()
      }

      this.applyMoveAction()
      this.moveCoords.dx = 0
      this.moveCoords.dy = 0
      this.isMove = false
      this.isMoveDelay = false

      document.removeEventListener('mousemove', this.todoMove)
      document.removeEventListener('touchmove', this.todoMoveTouch)
    },
    applyMoveAction () {
      const movedEnoughByX = Math.abs(this.moveCoords.dx) > this.initialMove.el.width / 2
      if (movedEnoughByX) {
        this.$set(this.currentTodo, 'done', true)
        // Because this is will not work
        // this.currentTodo.done = true
      }
    }
  }
}
</script>
