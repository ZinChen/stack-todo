<template lang="pug">
  .stack-item(
    :class="{ 'active-stack': isTouch || isMove }"
  )
    .stack-header
      .stack-info
        .stack-title {{ stack.title }}
        .stack-progress
          | {{ todos.length }} / {{ todosCount }}
      .stack-buttons
        q-btn(
          round
          @click="animateSwapTodo"
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
            v-touch:start="touchStarted"
            v-touch:end="touchEnded"
            v-touch:swipe="handleSwipe"
            v-touch:touchhold="todoMoveTouchStart"
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

<script>
import clamp from 'lodash/clamp'
import { gsap } from 'gsap'

export default {
  name: 'todo-stack',
  props: [ 'stack', 'todos', 'todosCount' ],
  data: function () {
    return {
      isMove: false,
      isTouch: false,
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
  computed: {
    currentTodo () {
      return this.todos.length > 0 ? this.todos[0] : {}
    },
    currentTodoRef () {
      return (this.$refs[`todoRef_${this.currentTodo.id}`] || [ false ])[0]
    },
    todosReversed () {
      return this.todos.slice().reverse()
    }
  },
  watch: {
    todos (olds, news) {
      // console.log('olds[0]', olds[0])
      // console.log('news[0]', news[0])
    }
  },
  created: function () {
    document.addEventListener('touchmove', this.todoMoveTouch, { passive: false, capture: true })
  },
  beforeDestroy: function () {
    document.removeEventListener('touchmove', this.todoMoveTouch)
  },
  methods: {
    touchStarted () {
      console.log('touch started')
      this.isTouch = true
      // const { todoRef } = this.$refs
      // gsap.to(todoRef, {
      //   z: 30,
      //   ease: 'power1.out',
      //   duration: 0.1,
      // })
    },
    touchEnded () {
      this.isTouch = false

      // const { todoRef } = this.$refs
      // !this.isMove && gsap.to(todoRef, {
      //   z: 0,
      //   ease: 'power1.out',
      //   duration: 0.1,
      // })

      console.log('touch ended')
    },
    handleSwipe (direction) {
      console.log('this is swipe')
      if (!this.isMove && ['left', 'right'].includes(direction)) {
        this.todoProps.directionSign = direction === 'right' ? 1 : -1
        this.isMove = true
        this.todoIsDone()
      }
    },
    enterTodo (el, done) {
      console.log('enter', el)
      done()
    },
    leaveTodo (el, done) {
      this.animateAway({ el, done })
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
        window.navigator.vibrate(30)
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

      this.computeTodoStyle({ dx: 0, dy: 0 })
      this.setDefaultStyle()
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

      this.computeTodoStyle({ dx, dy })
      this.animateTodoStyle()
    },
    todoMoveEnd (e) {
      console.log('long touch end')
      document.removeEventListener('touchend', this.todoMoveEnd)
      document.removeEventListener('mousemove', this.todoMove)
      const movedEnoughByX = Math.abs(this.todoProps.dx) > this.initialMove.el.width / 3
      const movedEnoughByY = Math.abs(this.todoProps.dy) > this.initialMove.el.height / 1.5

      if (movedEnoughByX) {
        this.todoProps.directionSign = this.todoProps.dx > 0 ? 1 : -1
        this.todoIsDone()
      } else if (movedEnoughByY) {
        this.animateSwapTodo()
      } else {
        this.computeTodoStyle({ dx: 0, dy: 0 })
        this.animateTodoStyle({ callback: this.turnoffMove })
      }
    },
    todoIsDone () {
      const todo = this.currentTodo
      todo.done = true
      todo.doneDate = new Date()

      this.$emit('update-todo', todo)
    },
    computeTodoStyle ({ dx, dy }) {
      const isMoving = dx != 0 || dy != 0
      let rotateX = 0
      let rotateY = 0
      let dz = 0
      let shadow = 1

      if (isMoving) {
        // multiply 'dy' just to rid of linear values
        rotateX = dy * Math.abs(dy / 2) / this.initialMove.el.height
        // rotateX *= -1 // in another direction
        rotateX = clamp(rotateX, -20, 20)

        rotateY = dx * Math.abs(dx / 2) / this.initialMove.el.width
        rotateY = clamp(rotateY, -25, 25)

        dz = 20
        shadow = 15
      }

      // TODO: if direction - right, transform origin - left and vice-versa
      const transform = `
        translate3d( ${dx}px, ${dy}px, ${0}px )
        rotateY( ${rotateY}deg )
        rotateX( ${rotateX}deg )
      `
      const background = `
        linear-gradient(135deg, #f6d365 ${-rotateY * 1.2}%, #fda085 ${100 - rotateY * 1.2}%)
      `
      const boxShadow = this.boxShadow(shadow)

      this.todoProps = {
        ...this.todoProps,
        dx,
        dy,
        dz,
        rotateX,
        rotateY,
        transform,
        background,
        boxShadow
      }
    },
    setDefaultStyle () {
      const todoRef = this.currentTodoRef
      gsap.set(todoRef, {
        background: this.todoProps.background
      })
    },
    animateTodoStyle ({ callback } = {}) {
      const todoRef = this.currentTodoRef

      const {
        dx,
        dy,
        dz,
        rotateX,
        rotateY,
        boxShadow,
        background
      } = this.todoProps

      gsap.to(todoRef.parentNode, {
        rotationY: rotateY,
        rotationX: rotateX,
        x: dx,
        y: dy,
        z: dz,
        duration: 0.5,
        onComplete: () => {
          callback && callback()
        }
      })

      gsap.to(todoRef, {
        boxShadow,
        background,
        duration: 0.5,
      })
    },
    animateAway ({ el, done }) {
      const todoRef = this.currentTodoRef
      const sign = this.todoProps.directionSign
      console.log('el', el)

      this.animateNextTodo(this.currentTodoRef)

      gsap.to(el, {
        rotationY: sign * 70,
        x: sign * el.offsetWidth * 0.7,
        opacity: 0,
        boxShadow: this.boxShadow(15),
        ease: 'power1.in',
        duration: 0.5,
        onComplete: () => {
          this.turnoffMove()
          done()
        },
      })
    },
    animateNextTodo (nextTodoRef) {
      nextTodoRef && gsap.fromTo(nextTodoRef,
        {
          scale: 0.99,
          y: 5,
        }, {
          scale: 1,
          y: 0,
          duration: 0.5
        }
      )
    },
    animateSwapTodo () {
      if (this.isSwap || this.todos.length < 2) {
        console.log('TODO: prevent swap if one or less todo')
        return
      }

      const todoRef = this.currentTodoRef
      const todoRefWrapper = (todoRef || {}).parentNode
      const nextTodoRef = ((this.$refs[`todoRef_${this.todos[1].id}`] || [])[0])

      this.isMove = true
      this.isSwap = true

      gsap.timeline()
        .to(todoRef, {
          duration: 0.4,
          ease: 'power2.in',
          boxShadow: this.boxShadow(15),
          onComplete: () => {
            this.animateNextTodo(nextTodoRef)
            this.$emit('swap-todo', this.stack)
          }
        })
        .to(todoRef, {
          duration: 0.4,
          ease: 'power2.out',
          scale: 0.99,
          y: 5,
          boxShadow: this.boxShadow(1),
          onComplete: () => {
            this.isMove = false
            this.isSwap = false
          }
        })

      gsap.timeline()
        .to(todoRefWrapper, {
          duration: 0.4,
          ease: 'power2.in',
          x: 0,
          y: todoRefWrapper.offsetHeight + 30,
          z: 20,
          rotationX: 10,
        })
        .to(todoRefWrapper, {
          duration: 0.4,
          ease: 'power2.out',
          x: 0,
          y: 0,
          z: 0,
          rotationX: 0,
        })
    },
    boxShadow (value) {
      return `rgba(0, 0, 0, 0.15) 0px ${value}px ${value * 2}px 0px`
    },
    turnoffMove () {
      this.computeTodoStyle({ dx: 0, dy: 0 })
      this.isMove = false
    }
  }
}
</script>
