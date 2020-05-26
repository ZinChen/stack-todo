import firebase from 'firebase'
import { fireApp, todosRefGetter, stacksRefGetter } from 'boot/fire.js'
import findLast from 'lodash/findLast'

// Basic actions
export function createTodo ({ state, getters }, stack) {
  const lastTodo = findLast(getters.stackTodos(stack.id))
  const order = lastTodo ? lastTodo.order + 1 : 0
  const todo = {
    stackId: stack.id,
    title: stack.newTodoTitle,
    createdAt: new Date(),
    deleted: false,
    order
  }
  const todosRef = todosRefGetter(state.user)

  stack.newTodoTitle = ''

  return todosRef.add(todo)
}

export function updateTodo ({ state }, todo) {
  const todosRef = todosRefGetter(state.user)
  return todosRef.doc(todo.id).update(todo)
}

export function deleteTodo ({ state }, todo) {
  const todosRef = todosRefGetter(state.user)

  return todosRef.doc(todo.id).update({
    deleted: true,
    deletedAt: new Date(),
  })
}

export function createStack ({ state }) {
  const stacksRef = stacksRefGetter(state.user)
  return stacksRef.add({
    createdAt: new Date(),
    title: '',
    deleted: false,
  })
}

export function updateStack ({ state }, stack) {
  const stacksRef = stacksRefGetter(state.user)
  return stacksRef.doc(stack.id).update(stack)
}

export function deleteStack ({ state }, stack) {
  const stacksRef = stacksRefGetter(state.user)
  return stacksRef.doc(stack.id).update({
    deleted: true,
    deletedAt: new Date(),
  })
}

// Complex actions

export function toggleTodoDone ({ dispatch }, todo) {
  if (todo.done) {
    todo.done = false
    todo.doneDate = firebase.firestore.FieldValue.delete()
  } else {
    todo.done = true
    todo.doneDate = new Date()
  }
  return dispatch('updateTodo', todo)
}

export function undoLastTodo ({ getters, dispatch }) {
  const lastTodo = getters.lastDone()

  if (lastTodo) {
    lastTodo.done = false
    // lastTodo.doneDate = firebase.firestore.FieldValue.delete()
    // TODO: place deleted to first place
    return dispatch('updateTodo', lastTodo)
  }
}

export function deleteAllDoneTodos ({ state, dispatch }) {
  const { todos } = state
  dispatch('pushTodoBatchToHistory', todos)

  const todosRef = todosRefGetter(state.user)
  const batch = fireApp.firestore().batch()

  todos.forEach(todo => {
    todosRef.doc(todo.id).update({
      deleted: true,
      deletedAt: new Date()
    })
  })

  return batch.commit()
}

export function swapTodo ({ state, getters }, stack) {
  const stackTodos = getters.stackTodosNotDone(stack.id)
  const currentTodo = stackTodos[0]

  const todosRef = todosRefGetter(state.user)
  const batch = fireApp.firestore().batch()

  batch.update(todosRef.doc(currentTodo.id), { order: stackTodos.length - 1 })

  stackTodos.slice(1).forEach((todo, index) => {
    batch.update(todosRef.doc(todo.id), { order: index })
  })

  return batch.commit()
}

export function swapTodoBack ({ state, getters }, stack) {
  const stackTodos = getters.stackTodosNotDone(stack.id)
  const prevTodo = stackTodos[stackTodos.length - 1]

  const todosRef = todosRefGetter(state.user)
  const batch = fireApp.firestore().batch()

  batch.update(todosRef.doc(prevTodo.id), { order: 0 })

  stackTodos.slice(0, stackTodos.length - 1).forEach((todo, index) => {
    batch.update(todosRef.doc(todo.id), { order: index + 1 })
  })

  return batch.commit()
}
