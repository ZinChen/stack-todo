export default function () {
  return {
    loadingState: 'loading',
    authState: '',
    allTodos: [],
    allStacks: [],
    todos: [],
    stacks: [],
    editorHistory: [],
    fireState: {
      settings: 'init',
      stacks: 'init',
      todos: 'init'
    },
    pageState: {
      screen: 'stacks',
      mode: 'simple',
      inputData: {
        type: '',
        item: null
      }
    },
    toolbar: {
      aboutModal: false,
      pwaButton: false,
      pwaEvent: null,
    },
    user: {},
    settings: {},
  }
}
