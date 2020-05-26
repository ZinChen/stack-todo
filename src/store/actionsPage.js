
export function toggleView ({ state, commit }) {
  if (state.pageState.screen === 'stacks') {
    commit('setPageStateScreen', 'editor')
  } else {
    commit('setPageStateScreen', 'stacks')
  }
}

export function setInputMode ({ commit }) {
  commit('setPageStateMode', 'input_editing')
}

export function setSimpleMode ({ commit }) {
  commit('setPageStateMode', 'simple')
}
