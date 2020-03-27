<template lang="pug">
  .stack-item(
    :class="{ 'perspective': isMove }"
  )
    .stack-header
      .stack-title {{ stack.title }}
      .stack-progress
        | {{ notDoneCount }} / {{ todosCount }} left
    .stack-todo-wrapper
      .stack-todo-item(
        v-touch:touchhold="todoMoveTouchStart"
        @click="todoClick"
        v-bind:style="todoStyle"
        :class="{ 'no-transition': isMove }"
      )
        .stack-todo-item-content
          | {{ currentTodo.title }}
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
      isClick: false,
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
  created: function() {
      document.addEventListener('touchmove', this.todoMoveTouch, { passive: false, capture: true })
  },
  beforeDestroy: function() {
      document.removeEventListener('touchmove', this.todoMoveTouch)
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
      if (!this.isMove) {
        return {}
      }

      const {
        dx,
        dy
      } = this.moveCoords

      // multiply 'dy' just to rid of linear values
      let rotateX = dy * Math.abs(dy / 2) / this.initialMove.el.height
      // rotateX *= -1 // in another direction
      rotateX = clamp(rotateX, -20 , 20)

      let rotateY = dx * Math.abs(dx / 2) / this.initialMove.el.width
      rotateY = clamp(rotateY, -25, 25)

      let dz = this.isMove ? 30 : 0

      const transform = `
        translate3d( ${dx}px, ${dy}px, ${dz}px )
        rotateY( ${rotateY}deg )
        rotateX( ${rotateX}deg )
      `
      const background = `
        linear-gradient(135deg, #f6d365 ${-rotateY * 1.2}%, #fda085 ${100 - rotateY * 1.2}%)
      `

      return {
        transform,
        background
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
    todoMoveTouchStart (e) {
      const evt = e.touches ? e.touches[0] : e

      this.initTodoMove(evt)

      if (!e.touches) {
        document.addEventListener('mousemove', this.todoMove)
        document.addEventListener('mouseup', this.todoMoveEnd, false)
      } else {
        console.log('long touch happened')
        document.addEventListener('touchend', this.todoMoveEnd, false)
        window.navigator.vibrate(100)
      }

      this.waitLongTouch = false
    },
    initTodoMove (e) {
      this.isMove = true

      this.initialMove = {
        x: e.pageX,
        y: e.pageY,
        el: {
          width: e.target.parentNode.offsetWidth,
          height: e.target.parentNode.offsetHeight,
        }
      }

      // console.log('start', e)
    },
    todoMove (e) {
      this.calcMoveCoords(e)
    },
    todoMoveTouch (e) {
      if (this.isMove && e.cancelable) {
        const evt = e.touches ? e.touches[0] : e
        e.preventDefault()
        this.calcMoveCoords(evt)
      }

    },
    calcMoveCoords (e) {
      const limitX = this.initialMove.el.width / 2.3
      const limitY = this.initialMove.el.height
      this.moveCoords.dx = clamp(e.pageX - this.initialMove.x, -limitX, limitX)
      this.moveCoords.dy = clamp(e.pageY - this.initialMove.y, -limitY, limitY)
    },
    todoMoveEnd (e) {
      if (!this.moveCoords.dx && !this.moveCoords.dy && !this.isMoveDelay) {
        this.todoClick()
      }

      console.log('long touch end')

      this.applyMoveAction()
      this.moveCoords.dx = 0
      this.moveCoords.dy = 0
      this.isMove = false
      this.isClick = false

      document.removeEventListener('touchend', this.todoMoveEnd)
    },
    applyMoveAction () {
      const movedEnoughByX = Math.abs(this.moveCoords.dx) > this.initialMove.el.width / 3
      if (movedEnoughByX) {
        this.$set(this.currentTodo, 'done', true)
        // Because this is will not work
        // this.currentTodo.done = true
      }
    }
  }
}
</script>
