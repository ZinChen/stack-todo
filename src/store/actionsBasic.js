import { todosRefGetter, stacksRefGetter } from 'boot/fire.js'
import findLast from 'lodash/findLast'

// Basic actions
export function createTodo ({ state, getters }, { stack, newTodoTitle }) {
  const lastTodo = findLast(getters.stackTodos(stack.id))
  const order = lastTodo ? lastTodo.order + 1 : 0
  const todo = {
    stackId: stack.id,
    title: newTodoTitle,
    createdAt: new Date(),
    deleted: false,
    order
  }
  const todosRef = todosRefGetter()

  stack.newTodoTitle = ''

  return todosRef.add(todo)
}

export function updateTodo ({ state }, { todo, update }) {
  const todosRef = todosRefGetter()
  return todosRef.doc(todo.id).update({ ...todo, ...update })
}

export function deleteTodo ({ state }, todo) {
  const todosRef = todosRefGetter()

  return todosRef.doc(todo.id).update({
    deleted: true,
    deletedAt: new Date(),
  })
}

export function createStack ({ state }) {
  const stacksRef = stacksRefGetter()
  return stacksRef.add({
    createdAt: new Date(),
    title: '',
    deleted: false,
  })
}

export function updateStack ({ state }, { stack, update }) {
  const stacksRef = stacksRefGetter()
  return stacksRef.doc(stack.id).update({ ...stack, ...update })
}

export function deleteStack ({ state }, stack) {
  const stacksRef = stacksRefGetter()
  return stacksRef.doc(stack.id).update({
    deleted: true,
    deletedAt: new Date(),
  })
}
