<template lang="pug">
  .container.todo-lists
    .todo-list(
      v-for="stack in stacks"
      :key="stack.id"
    )
      .todo-list-header
        input.input.todo-list-title(
          :value="stack.title"
          placeholder="Stack title"
          @input="setInputMode"
          @blur="e => onBlurStack(e, stack)"
          @keyup.enter="e => onBlurStack(e, stack)"
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
                :value="todo.title"
                :disabled="todo.done"
                @input="setInputMode"
                @blur="e => onBlurTodo(e, todo)"
                @keyup.enter="e => onBlurTodo(e, todo)"
              )
          todo-item-menu(
            :todo="todo"
          )
        .todo-list-item.create-todo-list-item
          input.input.todo-list-item-content(
            placeholder="Type new todo"
            @input="setInputMode"
            @blur="e => onCreateTodo(e, stack)"
            @keyup.enter="e => onCreateTodo(e, stack)"
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TodoItemMenu from './TodoItemMenu'

export default {
  name: 'todo-editor',
  components: { TodoItemMenu },
  computed: {
    ...mapState([
      'stacks'
    ]),
    ...mapGetters([
      'stackTodos',
      'pageMode'
    ]),
  },
  methods: {
    onCreateTodo (e, stack) {
      const newTodoTitle = e.target.value
      e.target.value = ''
      this.setSimpleMode()
      if (newTodoTitle.length > 0) {
        this.createTodo({ stack, newTodoTitle })
      }
    },
    onBlurTodo (e, todo) {
      this.setSimpleMode()
      if (todo.title != e.target.value) {
        this.updateTodo({ todo, update: { title: e.target.value } })
      }
    },
    onBlurStack (e, stack) {
      this.setSimpleMode()
      if (stack.title != e.target.value) {
        this.updateStack({ stack, update: { title: e.target.value } })
      }
    },
    onDeleteStack (stack) {
      this.pushStackToHistory(stack)
      this.deleteStack(stack)
    },
    ...mapActions([
      'setInputMode',
      'setSimpleMode',

      'createTodo',
      'updateTodo',

      'createStack',
      'updateStack',
      'pushStackToHistory',
      'deleteStack',

    ])
  }
}
</script>
