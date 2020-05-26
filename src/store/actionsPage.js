
export function toggleView ({ state, commit }) {
  if (state.pageState.screen === 'stacks') {
    commit('setPageStateScreen', 'editor')
  } else {
    commit('setPageStateScreen', 'stacks')
  }
}

export function setInputMode ({ commit }, inputData) {
  commit('setPageStateMode', 'input_editing')
  commit('setInputData', inputData)
}
