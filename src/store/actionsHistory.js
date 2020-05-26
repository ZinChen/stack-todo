import firebase from 'firebase'
import { fireApp, todosRefGetter, stacksRefGetter } from 'boot/fire.js'

export function pushTodoToHistory ({ commit }, todo) {
  commit('pushToHistory', {
    type: 'todo',
    id: todo.id
  })
}

export function pushStackToHistory ({ commit }, stack) {
  commit('pushToHistory', {
    type: 'stack',
    id: stack.id
  })
}

export function pushTodoBatchToHistory ({ commit }, todos) {
  const doneTodoIds = todos.filter(todo => todo.done).map(todo => todo.id)

  commit('pushToHistory', {
    type: 'todo_batch',
    ids: doneTodoIds
  })
}

export function restoreByHistory ({ state, commit }) {
  const {
    editorHistory: history
  } = state

  if (!history.length) {
    return false
  }

  const todosRef = todosRefGetter()
  const stacksRef = stacksRefGetter()

  const historyItem = [ ...history ].pop()
  commit('popFromHistory')

  const newValue = {
    deleted: false,
    deletedAt: firebase.firestore.FieldValue.delete(),
  }

  switch (historyItem.type) {
    case 'todo':
      // TODO: place deleted to first place
      todosRef.doc(historyItem.id).update(newValue)
      break

    case 'stack':
      stacksRef.doc(historyItem.id).update(newValue)
      break

    case 'todo_batch':
      // TODO: place deleted to first place
      const batch = fireApp.firestore().batch()

      historyItem.ids.forEach(id => {
        todosRef.doc(id).update(newValue)
      })

      batch.commit()
      break

    default:
      // Promise.reject(new Error("провал"))
      break
  }
}
