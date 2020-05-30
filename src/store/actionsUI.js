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

export function refReceived ({ state, commit, dispatch }, ref) {
  commit('setRefFireState', { ref, status: 'loaded' })

  const fireState = state.fireState
  const settings = state.settings || {}
  const neededRefs = [
    'settings',
    'todos',
    'stacks'
  ]
  const isAllRefsLoaded = neededRefs.every(ref => fireState[ref] == 'loaded')

  if (isAllRefsLoaded && !settings.isSampleAdded) {
    dispatch('addSampleItems')
    console.log('addingSimpleTodos')
  }
}
