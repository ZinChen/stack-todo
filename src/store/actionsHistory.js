import firebase from 'firebase'
import { fireApp, todosRefGetter, stacksRefGetter } from 'boot/fire.js'

export function pushTodoToHistory ({ state }, todo) {
  state.editorHistory.push({
    type: 'todo',
    id: todo.id
  })
}

export function pushStackToHistory ({ state }, stack) {
  state.editorHistory.push({
    type: 'stack',
    id: stack.id
  })
}

export function pushTodoBatchToHistory ({ state }, todos) {
  const doneTodoIds = todos.filter(todo => todo.done).map(todo => todo.id)

  state.editorHistory.push({
    type: 'todo_batch',
    ids: doneTodoIds
  })
}

export function restoreByHistory ({ state }) {
  const {
    editorHistory: history
  } = state

  if (!history.length) {
    return false
  }

  const todosRef = todosRefGetter(state.user)
  const stacksRef = stacksRefGetter(state.user)

  const historyItem = history.splice(history.length - 1, 1)[0]

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
        state.todosRef.doc(id).update(newValue)
      })

      batch.commit()
      break

    default:
      // Promise.reject(new Error("провал"))
      break
  }
}
