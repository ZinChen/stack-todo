<template lang="pug">
  .devlayout
    h2
      | Appear animation
    .stack-todos
      .stack-todo-item(
        v-for="todo in appearTodos"
        :class="todo.class"
      ) {{ todo.title }}
    .section
      button.button(
        @click="setAppear()"
      ) appear
      button.button(
        @click="resetAppear()"
      ) reset class

    h2
      | Done animation
    .stack-todos
      .stack-todo-item(
        :class="doneClass"
        @click="doneClass = ['done']"
      ) What dishes and cleanup kitchen
    .section
      button.button(
        @click="doneClass = []"
      ) reset class

    h2
      | Undone animation
    .stack-todos
      .stack-todo-item(
        :class="undoneClass"
        @click="undoneClass = ['undone']"
      ) What dishes and cleanup kitchen
    .section
      button.button(
        @click="undoneClass = []"
      ) reset class
</template>

<style lang="sass">
  @import '../css/todo-stack-css'
  @import '../css/todo-stack-animation'
  @import '../css/testdev'
</style>

<script>
const appearTodos = [
  'Do something usefull',
  'Play tamborine',
  'Drink some tea',
  'Lay on the sofa',
  'Watch yotube',
  'Do something useless'
].map(title => ({ title, class: ['invisible'] }))

export default {
  name: 'test-dev',
  data () {
    return {
      appearTodos,
      doneClass: [],
      undoneClass: [],
    }
  },
  methods: {
    addClass () {
      this.todoClass = ['done']
    },
    resetClasses () {
      this.todoClass = []
    },
    setAppear () {
      this.appearTodos.forEach((todo, index) => {
        const delay = appearTodos.length - index
        setTimeout(() => {
          todo.class = ['appear']
        }, index * 150)
      })
    },
    resetAppear () {
      this.appearTodos.forEach(todo => (todo.class = ['invisible']))
    }
  }
}
</script>
