<template lang="pug">
q-btn(
  flat
  round
  dense
  icon="more_vert"
  color="white"
)
  q-menu
    q-list.todo-item-menu
      q-item(
        @click="toggleTodoDone(todo)"
        clickable
        v-close-popup
      )
        q-item-section(
          v-if="todo.done"
        )
          q-icon(
            name="radio_button_unchecked"
          )
          span Set undone
        q-item-section(
          v-else
        )
          q-icon(
            name="check_circle_outline"
          )
          span Set done
      q-separator
      q-item(
        @click="onDeleteTodo(todo)"
        clickable
        v-close-popup
      )
        q-item-section
          q-icon(
            name="delete"
          )
          | Delete
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'todo-item-menu',
  props: ['todo'],
  methods: {
    onDeleteTodo (todo) {
      this.pushTodoToHistory(todo)
      this.deleteTodo(todo)
    },
    ...mapActions([
      'toggleTodoDone',

      'pushTodoToHistory',
      'deleteTodo',
    ]),
  }
}
</script>
