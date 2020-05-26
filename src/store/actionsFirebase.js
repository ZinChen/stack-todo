import { firestoreAction } from 'vuexfire'
import { fireApp, todosRefGetter, stacksRefGetter } from 'boot/fire.js'

export const bindFirestoreTodosRef = firestoreAction(({
  bindFirestoreRef,
}, user) => {
  const todosRef = todosRefGetter(user)

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
}, user) => {
  const stacksRef = stacksRefGetter(user)

  return bindFirestoreRef(
    'stacks',
    stacksRef
      .where('deleted', "==", false)
      .orderBy('createdAt')
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
