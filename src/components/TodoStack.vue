<template lang="pug">
  .stack-item(
    :class="{ 'perspective': isMove }"
  )
    .stack-header
      .stack-title {{ stack.title }}
      .stack-progress
        | {{ notDoneCount }} / {{ todosCount }} left
    .stack-todos
      .stack-todo-wrapper(
        v-for="todo in notDoneTodos"
        :key="todo.id"
      )
        .stack-todo-item(
          v-if="todo.title == currentTodo.title"
          ref="todoRef"
          v-touch:touchhold="todoMoveTouchStart"
          v-bind:style="todoStyle"
          class="current-todo"
          :class="{ 'no-transition': isMove }"
        )
          .stack-todo-item-content {{ todo.title }}
        .stack-todo-item(
          v-else
        )
          .stack-todo-item-content {{ todo.title }}
      .stack-todo-item.stack-todo-item-ghost
        .stack-todo-item-content
          | {{ currentTodo.title }}
</template>

<script>
import clamp from 'lodash/clamp'
import findLast from 'lodash/findLast'
import { gsap } from 'gsap'

export default {
  name: 'todo-stack',
  props: [ 'stack', 'todos' ],
  data: function() {
    return {
      isMove: false,
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
      const currentTodo = this.todos.find(todo => !todo.done) || {}
      return currentTodo
    },
    currentTodoIndex () {
      return this.todos.findIndex(todo => !todo.done)
    },
    notDoneTodos () {
      return this.todos.filter(todo => !todo.done).slice().reverse()
    },
    todosCount () {
      return this.todos.length
    },
    doneCount () {
      return this.todos.filter(todo => todo.done).length
    },
    notDoneCount () {
      return this.todos.filter(todo => !todo.done).length
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
      const lastDone = findLast(this.todos, todo => todo.done)
      if (lastDone) {
        lastDone.done = false
      }
    },
    todoMoveTouchStart (e) {
      const evt = e.touches ? e.touches[0] : e

      this.initTodoMove(evt)

      if (!e.touches) {
        console.log('mouse down')
        document.addEventListener('mousemove', this.todoMove)
        document.addEventListener('mouseup', this.todoMoveEnd, { once: true })
      } else {
        console.log('long touch happened')
        document.addEventListener('touchend', this.todoMoveEnd, { once: true })
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
      console.log('long touch end')
      document.removeEventListener('touchend', this.todoMoveEnd)

      this.isMove = false
      this.applyMoveAction()
      this.moveCoords.dx = 0
      this.moveCoords.dy = 0
    },
    applyMoveAction () {
      const movedEnoughByX = Math.abs(this.moveCoords.dx) > this.initialMove.el.width / 3

      if (movedEnoughByX) {
        const { todoRef } = this.$refs

        // moved lef
        const directionSign = this.moveCoords.dx > 0 ? 1 : -1
        const targetX = directionSign * this.initialMove.el.width - this.moveCoords.dx

        const todo =  this.currentTodo
        todo.done = true
        todo.doneDate = new Date()

        this.$emit('update-todo', todo)

        console.log('currentTodo', this.currentTodo)


        // gsap.to(todoRef, { rotationY: 90, x: targetX, onComplete: () => {

        //   // gsap.set(todoRef, { rotationY: 0, x: 0,  })
        // }})
      }
    }
  }
}
</script>
