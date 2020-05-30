import { firestoreAction } from 'vuexfire'
import { todosRefGetter, stacksRefGetter, settingsRefGetter } from 'boot/fire.js'

export const bindFirestoreSettingsRef = firestoreAction(({
  bindFirestoreRef,
  dispatch,
}) => {
  const settingsRef = settingsRefGetter()

  return bindFirestoreRef(
    'settings',
    settingsRef
  )
    .then(data => {
      dispatch('refReceived', 'settings')
    })
})

export const bindFirestoreTodosRef = firestoreAction(({
  bindFirestoreRef,
  dispatch,
}) => {
  const todosRef = todosRefGetter()

  return bindFirestoreRef(
    'todos',
    todosRef
      .where('deleted', "==", false)
      .orderBy('order')
  )
    .then(data => {
      dispatch('refReceived', 'todos')
    })
})

export const bindFirestoreStacksRef = firestoreAction(({
  bindFirestoreRef,
  dispatch,
}) => {
  const stacksRef = stacksRefGetter()

  return bindFirestoreRef(
    'stacks',
    stacksRef
      .where('deleted', "==", false)
      .orderBy('createdAt')
  )
    .then(data => {
      dispatch('refReceived', 'stacks')
    })
})

export const bindFirestoreAllTodosRef = firestoreAction(({
  bindFirestoreRef,
}) => {
  const todosRef = todosRefGetter()

  return bindFirestoreRef(
    'allTodos',
    todosRef
      .orderBy('createdAt', 'desc')
      .limit(1000)
  )
    .then(data => {
    })
})

export const bindFirestoreAllStacksRef = firestoreAction(({
  bindFirestoreRef,
}) => {
  const stacksRef = stacksRefGetter()

  return bindFirestoreRef(
    'allStacks',
    stacksRef
      .orderBy('createdAt', 'desc')
      .limit(1000)
  )
    .then(data => {
    })
})

export const unbindFirestoreRefs = firestoreAction(({
  unbindFirestoreRef
}) => {
  unbindFirestoreRef('todos')
  unbindFirestoreRef('stacls')
})
