/*
export function someGetter (state) {
}
*/

export const isLoaded = (state) => {
  return state.loadingState == 'loaded'
}

export const isEditorInputEditing = (state) => {
  const {
    screen,
    mode
  } = state.pageState

  return screen == 'editor' && mode == 'input_editing'
}

export const isEditorSimpleView = (state) => {
  const {
    screen,
    mode
  } = state.pageState
  return screen == 'editor' && mode != 'input_editing'
}

export const isStacksScreen = (state) => {
  return state.pageState.screen == 'stacks'
}

export const isEditorHistory = (state) => {
  return state.editorHistory.length
}

export const pageMode = (state) => {
  return state.pageState.mode
}

export const isDoneTodos = (state) => {
  return state.todos.filter(todo => todo.done).length
}

export const stackTodos = (state) => (stackId) => {
  return state.todos.filter(todo => todo.stackId === stackId)
}

export const stackTodosNotDone = (state) => (stackId) => {
  return state.todos.filter(todo => todo.stackId === stackId && !todo.done) || []
}

export const doneTodos = (state) => {
  return state.todos.filter(todo => todo.done)
}

export const filteredStacks = (state) => {
  const nonEmptyStackIds = [...new Set(state.todos.map(todo => todo.stackId))]
  return state.stacks.filter(stack => nonEmptyStackIds.includes(stack.id))
}

export const lastDone = (state) => {
  let lastTodo = { doneDate: 0 }
  state.todos.find(todo => {
    if (todo.done && todo.doneDate > lastTodo.doneDate) {
      lastTodo = todo
    }
  })
  return lastTodo.done && lastTodo
}
