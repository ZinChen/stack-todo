import { firestoreAction } from 'vuexfire'
import { fireApp, todosRefGetter, stacksRefGetter } from 'boot/fire.js'

export const bindFirestoreTodosRef = firestoreAction(({
  bindFirestoreRef,
}) => {
  const todosRef = todosRefGetter()

  return bindFirestoreRef(
    'todos',
    todosRef
      .where('deleted', "==", false)
      .orderBy('order')
  )
    .then(data => {
    })
})

export const bindFirestoreStacksRef = firestoreAction(({
  bindFirestoreRef,
  commit,
}) => {
  const stacksRef = stacksRefGetter()

  return bindFirestoreRef(
    'stacks',
    stacksRef
      .where('deleted', "==", false)
      .orderBy('createdAt')
  )
    .then(data => {
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
