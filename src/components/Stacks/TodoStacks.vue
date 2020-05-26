<template lang="pug">
  .container
    .todo-stack-list
      todo-stack-css(
        v-show="isLoaded"
        v-for="(stack, index) in filteredStacks"
        :key="stack.id"
        :stack="stack"
        :allTodos="stackTodos(stack.id)"
        :todos="stackTodosNotDone(stack.id)"
        :z-index="filteredStacks.length - index"
      )
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import TodoStackCss from './TodoStackCss'

export default {
  name: 'todo-stacks',
  components: { TodoStackCss },
  computed: {
    ...mapState([
      'todos',
      'stacks',
    ]),
    ...mapGetters([
      'isLoaded',
      'filteredStacks',
      'stackTodosNotDone',
      'stackTodos',
    ]),
  }
}
</script>
