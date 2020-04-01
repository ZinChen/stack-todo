<template lang="pug">
  .stack-item(
    :class="{ 'perspective': isMove }"
  )
    .stack-header
      .stack-title {{ stack.title }}
      .stack-progress
        | {{ notDoneCount }} / {{ todosCount }}
    .stack-todos
      transition-group(
        @enter="enterTodo"
        @leave="leaveTodo"
        :css="false"
      )
        .stack-todo-wrapper(
          v-for="todo in notDoneTodos"
          :key="todo.id"
        )
          .stack-todo-item(
            v-if="todo.title == currentTodo.title"
            ref="todoRef"
            v-touch:start="touchStarted"
            v-touch:end="touchEnded"
            v-touch:swipe="handleSwipe"
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
      todoProps: {
        dx: 0,
        dy: 0,
        dz: 0,
        rotateX: 0,
        rotateY: 0,
        directionSign: 1
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
      return this.todos.find(todo => !todo.done) || {}
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
      const {
        dx,
        dy,
        dz,
        rotateX,
        rotateY
      } = this.todoProps

      // TODO: if direction - right, transform origin - left and vice-versa

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
    touchStarted () {
      // console.log('touch started')
    },
    touchEnded () {
      // console.log('touch ended')
    },
    handleSwipe (direction) {
      if (!this.isMove && ['left', 'right'].includes(direction)) {
        this.todoProps.directionSign = direction === 'right' ? 1 : -1
        this.todoIsDone()
      }
    },
    enterTodo (el, done) {
      console.log('enter', el)
      done()
    },
    leaveTodo (el, done) {
      const { todoRef } = this.$refs
      const sign = this.todoProps.directionSign
      console.log('el', el)
      console.log('this.isMove', this.isMove)

      // const targetX = sign * this.initialMove.el.width - this.todoProps.dx

      gsap.to(todoRef, {
        rotationY: 90 * sign,
        x: this.initialMove.el.width * sign,
        ease: 'power1.out',
        duration: 0.7,
        onComplete: () => {
          console.log('leaved')
          console.log('this.isMove', this.isMove)
          done()
        },
      })
      console.log('leave', el)

    },
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
      this.computeTodoCoords(e)
    },
    todoMoveTouch (e) {
      if (this.isMove && e.cancelable) {
        const evt = e.touches ? e.touches[0] : e
        e.preventDefault()
        this.computeTodoCoords(evt)
      }
    },
    computeTodoCoords (e) {
      const limitX = this.initialMove.el.width / 1.5
      const limitY = this.initialMove.el.height

      const dx = clamp(e.pageX - this.initialMove.x, -limitX, limitX)
      const dy = clamp(e.pageY - this.initialMove.y, -limitY, limitY)

      this.setTodoStyle({ dx, dy })
    },
    setTodoStyle ({ dx, dy }) {
      const notMoving = dx == 0 && dy == 0
      if (notMoving) {
        this.todoProps = {
          ...this.todoProps,
          dx,
          dy,
          dz: 0,
          rotateX: 0,
          rotateY: 0,
        }
      }

      // multiply 'dy' just to rid of linear values
      let rotateX = dy * Math.abs(dy / 2) / this.initialMove.el.height
      // rotateX *= -1 // in another direction
      rotateX = clamp(rotateX, -20 , 20)

      let rotateY = dx * Math.abs(dx / 2) / this.initialMove.el.width
      rotateY = clamp(rotateY, -25, 25)


      this.todoProps = {
        ...this.todoProps,
        dx,
        dy,
        dz: 30,
        rotateX,
        rotateY
      }
    },
    todoMoveEnd (e) {
      console.log('long touch end')
      document.removeEventListener('touchend', this.todoMoveEnd)

      this.isMove = false
      this.applyMoveAction()
      this.setTodoStyle({ dx: 0, dy: 0})
    },
    applyMoveAction () {
      const movedEnoughByX = Math.abs(this.todoProps.dx) > this.initialMove.el.width / 3

      if (movedEnoughByX) {
        this.todoProps.directionSign = this.todoProps.dx > 0 ? 1 : -1
        this.todoIsDone()
      }
    },
    todoIsDone () {
      const todo =  this.currentTodo
      todo.done = true
      todo.doneDate = new Date()

      this.$emit('update-todo', todo)
    }
  }
}
</script>
