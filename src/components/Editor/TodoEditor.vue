<template lang="pug">
  .container.todo-lists
    .todo-list(
      v-for="stack in stacks"
      :key="stack.id"
    )
      .todo-list-header
        input.input.todo-list-title(
          v-model="stack.title"
          placeholder="Stack title"
          @input="setInputMode('stack', stack)"
          @blur="blurStack(stack)"
          v-on:keyup.enter="blurStack(stack)"
        )
      .todo-list-items
        .todo-list-item(
          v-for="todo in stackTodos(stack.id)"
        )
          q-icon.todo-item-icon(
            v-if="todo.done"
            name="done"
            size="xs"
            color="white"
          )
          .field.has-addons
            p.control.todo-input
              input.input.todo-list-item-content(
                name="todo"
                v-model="todo.title"
                :disabled="todo.done"
                @input="setInputMode('todo', todo)"
                @blur="blurTodo(todo)"
                v-on:keyup.enter="blurTodo(todo)"
              )
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
        .todo-list-item.create-todo-list-item
          input.input.todo-list-item-content(
            placeholder="Type new todo"
            v-model="stack.newTodoTitle",
            @input="setInputMode('new_todo', stack)"
            v-on:keyup.enter="onCreateTodo(stack)"
          )
      .todo-list-buttons
        q-btn(
          round
          icon="delete"
          v-if="!stackTodos(stack.id).length"
          color="deep-orange-9"
          @click="onDeleteStack(stack)"
        )

    .create-todo-list
      q-btn(
        fab
        @click="createStack"
        icon="fas fa-plus"
        color="white"
        text-color="grey-5"
      )
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'todo-editor',
  computed: {
    ...mapState([
      'stacks'
    ]),
    ...mapGetters([
      'stackTodos',
      'pageMode'
    ])
  },
  methods: {
    onCreateTodo (stack) {
      if (this.pageMode != 'input_editing') {
        return
      }

      this.setPageStateMode('simple')
      this.createTodo(stack)
    },
    onBlurTodo (todo) {
      if (this.pageMode == 'input_editing') {
        this.updateTodo(todo)
        this.setPageStateMode('simple')
      }
    },
    onDeleteTodo (todo) {
      this.pushTodoToHistory(todo)
      this.deleteTodo(todo)
    },
    onBlurStack (stack) {
      if (this.pageMode == 'input_editing') {
        this.updateStack(stack)
        this.setPageStateMode('simple')
      }
    },
    onDeleteStack (stack) {
      this.pushStackToHistory(stack)
      this.deleteStack(stack)
    },
    ...mapActions([
      'setInputMode',
      'setPageStateMode',

      'createTodo',
      'updateTodo',
      'pushTodoToHistory',
      'deleteTodo',

      'createStack',
      'updateStack',
      'pushStackToHistory',
      'deleteStack',

      'toggleTodoDone'
    ])
  }
}
</script>
