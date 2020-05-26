export default function () {
  return {
    loadingState: 'loading',
    authState: '',
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
