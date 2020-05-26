export function setValue (state, { name, value }) {
  state[name] = { ...state[name], value }
}

export function setUser (state, { uid, email, photoURL }) {
  state.user = { uid, email, photoURL }
}

export function setAuthState (state, authState) {
  state.authState = authState
}

export function setLoadingState (state, loadingState) {
  state.loadingState = loadingState
}

export function setPageStateScreen (state, screen) {
  state.pageState.screen = screen
}

export function setPageStateMode (state, mode) {
  state.pageState.mode = mode
}

export function setPageStateInputData (state, { type, item }) {
  state.pageState.inputData.type = type
  state.pageState.inputData.item = item
}
