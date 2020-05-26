export function saveNewTodos ({ dispatch }, stacks) {
  stacks.forEach(stack => {
    if (stack.newTodoTitle) {
      dispatch('createTodo', stack)
    }
  })
}

export function saveNewItem ({ state, dispatch }, stacks) {
  const {
    type,
    item
  } = state.pageState.inputData

  switch (type) {
    case 'stack':
      dispatch('blurStack', item)
      break

    case 'todo':
      dispatch('blurTodo', item)
      break

    case 'new_todo':
      dispatch('createTodo', item)
      break
  }
}
