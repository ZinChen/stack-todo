export default function () {
  return {
    loadingState: 'loading',
    authState: '',
    allTodos: [],
    allStacks: [],
    todos: [],
    stacks: [],
    editorHistory: [],
    pageState: {
      screen: 'stacks',
      mode: 'simple',
      inputData: {
        type: '',
        item: null
      }
    },
    user: {},
  }
}
