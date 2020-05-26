<template lang="pug">
  q-layout.layout
    .section.screen-section.editor-section(
      key="editor"
      :class="{'active-section': pageState.screen == 'editor'}"
    )
      todo-editor

    .section.screen-section.stacks-section(
      key="stacks"
      :class="{'active-section': pageState.screen == 'stacks'}"
    )
      todo-stacks

    fab-menu-editor
    fab-menu-stacks
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'
import TodoStacks from '../components/Stacks/TodoStacks'
import TodoEditor from '../components/Editor/TodoEditor'
import FabMenuEditor from '../components/FabMenu/FabMenuEditor'
import FabMenuStacks from '../components/FabMenu/FabMenuStacks'

// const bindFirebase = function (context) {
//   // Todo: track, when collections received
//   const user = firebase.auth().currentUser
//   const stacksRef = fireApp.firestore()
//     .collection('users')
//     .doc(user.uid)
//     .collection('stacks')

//   context.stacksRef = stacksRef
//   context.$bind('stacks', stacksRef.where('deleted', "==", false)
//     .orderBy('createdAt')
//     // .then(() => {
//     //   // TODO: check when all will be loaded
//     // })
//   )

//   const todosRef = fireApp.firestore()
//     .collection('users')
//     .doc(user.uid)
//     .collection('todos')

//   context.todosRef = todosRef
//   context.$bind('todos', todosRef.where('deleted', "==", false)
//     .orderBy('order')
//     // .then(() => {
//     //   // TODO: check when all will be loaded
//     // })
//   )
// }

export default {
  name: 'PageIndex',
  components: { TodoStacks, TodoEditor, FabMenuStacks, FabMenuEditor },
  data () {
    return {
      // isLoaded: false,
      // todos: [],
      // stacks: [],
      // editorHistory: [],
      // pageState: {
      //   screen: 'stacks', // 'editor',
      //   mode: 'simple', // 'input_editing
      //   inputData: {
      //     type: '',
      //     item: null
      //   }
      // },
    }
  },
  computed: {
    ...mapState([
      'pageState'
    ])
    // isEditorInputEditing () {
    //   const {
    //     screen,
    //     mode
    //   } = this.pageState
    //   return screen == 'editor' && mode == 'input_editing'
    // },
    // isEditorSimpleView () {
    //   const {
    //     screen,
    //     mode
    //   } = this.pageState
    //   return screen == 'editor' && mode != 'input_editing'
    // },
    // stackTodos () {
    //   return stackId => this.todos.filter(todo => todo.stackId === stackId)
    // },
    // stackTodosNotDone () {
    //   return stackId => this.todos.filter(todo => todo.stackId === stackId && !todo.done)
    // },
    // doneTodos () {
    //   return this.todos.filter(todo => todo.done)
    // },
    // filteredStacks () {
    //   const nonEmptyStackIds = [...new Set(this.todos.map(todo => todo.stackId))]
    //   return this.stacks.filter(stack => nonEmptyStackIds.includes(stack.id))
    // },
    // lastDone () {
    //   let lastTodo = { doneDate: 0 }
    //   this.todos.find(todo => {
    //     if (todo.done && todo.doneDate > lastTodo.doneDate) {
    //       lastTodo = todo
    //     }
    //   })
    //   return lastTodo.done && lastTodo
    // }
  },
  // beforeCreate: function () {
  //   // this.$root.$on('auth_state', (state) => {
  //   //   if (state === 'logged_in') {
  //   //     bindFirebase(this)
  //   //   } else {
  //   //     this.$unbind('stacks')
  //   //     this.$unbind('todos')
  //   //   }
  //   // })
  //   // this.$root.$on('loading_state', (state) => {
  //   //   this.isLoaded = state == 'loaded'
  //   // })
  // },
  created: function () {
    const user = firebase.auth().currentUser
    if (user) {
      this.$store.dispatch('bindFirestoreTodosRef', user)
      this.$store.dispatch('bindFirestoreStacksRef', user)
    }
  },
  methods: {
    // toggleView () {
    //   if (this.pageState.screen === 'stacks') {
    //     this.pageState.screen = 'editor'
    //   } else {
    //     this.saveNewTodos()
    //     this.pageState.screen = 'stacks'
    //   }
    // },
    // setInputMode (type, item) {
    //   this.pageState.mode = 'input_editing'
    //   this.pageState.inputData.type = type
    //   this.pageState.inputData.item = item
    // },
    // createTodo (stack) {
    //   if (this.pageState.mode != 'input_editing') {
    //     return
    //   }

    //   this.$store.dispatch('setPageStateMode', 'simple')
    //   this.$store.dispatch('createTodo', stack)
    // },
    // blurTodo (todo) {
    //   if (this.pageState.mode == 'input_editing') {
    //     this.updateTodo(todo)
    //     this.pageState.mode = 'simple'
    //   }
    // },
    // updateTodo (todo) {
    //   this.todosRef.doc(todo.id).update(todo)
    // },
    // deleteTodo (todo) {
    //   // this.editorHistory.push({
    //   //   type: 'todo',
    //   //   id: todo.id
    //   // })
    //   // this.todosRef.doc(todo.id).update({
    //   //   deleted: true,
    //   //   deletedAt: new Date(),
    //   // })
    // },
    // createStack () {
    //   this.stacksRef.add({
    //     createdAt: new Date(),
    //     title: '',
    //     deleted: false,
    //   })
    // },
    // blurStack (stack) {
    //   if (this.pageState.mode == 'input_editing') {
    //     this.updateStack(stack)
    //     this.pageState.mode = 'simple'
    //   }
    // },
    // updateStack (stack) {
    //   // this.stacksRef.doc(stack.id).update(stack)
    //   // this.pageState.mode = 'simple'
    // },
    // deleteStack (stack) {
    //   // this.editorHistory.push({
    //   //   type: 'stack',
    //   //   id: stack.id
    //   // })
    //   // this.stacksRef.doc(stack.id).update({
    //   //   deleted: true,
    //   //   deletedAt: new Date(),
    //   // })
    // },
    // saveNewTodos () {
    //   this.stacks.forEach(stack => {
    //     if (stack.newTodoTitle) {
    //       this.createTodo(stack)
    //     }
    //   })
    // },
    // saveNewItem () {
    //   const {
    //     type,
    //     item
    //   } = this.pageState.inputData

    //   // ugly short alternative

    //   // const methods = {
    //   //   stack: 'updateStack',
    //   //   todo: 'updateTodo',
    //   //   new_todo: 'createTodo'
    //   // }
    //   // if (Object.keys(methods).includes(type)) {
    //   //   this[methods[type]]()
    //   // }

    //   switch (type) {
    //     case 'stack':
    //       this.blurStack(item)
    //       break

    //     case 'todo':
    //       this.blurTodo(item)
    //       break

    //     case 'new_todo':
    //       this.createTodo(item)
    //       break
    //   }
    // },
    // deleteAllDoneTodos () {
    //   let doneTodoIds = this.todos.filter(todo => todo.done).map(todo => todo.id)
    //   this.editorHistory.push({
    //     type: 'todo_batch',
    //     ids: doneTodoIds
    //   })

    //   const batch = fireApp.firestore().batch()

    //   doneTodoIds.forEach(todoId => {
    //     this.todosRef.doc(todoId).update({
    //       deleted: true,
    //       deletedAt: new Date()
    //     })
    //   })

    //   batch.commit()
    // },
    // restoreByHistory () {
    //   const {
    //     editorHistory: history
    //   } = this

    //   if (!history.length) {
    //     return false
    //   }

    //   const historyItem = history.splice(history.length - 1, 1)[0]

    //   const newValue = {
    //     deleted: false,
    //     deletedAt: firebase.firestore.FieldValue.delete(),
    //   }

    //   switch (historyItem.type) {
    //     case 'todo':
    //       // TODO: place deleted to first place
    //       this.todosRef.doc(historyItem.id).update(newValue)
    //       break

    //     case 'stack':
    //       this.stacksRef.doc(historyItem.id).update(newValue)
    //       break

    //     case 'todo_batch':
    //       // TODO: place deleted to first place
    //       const batch = fireApp.firestore().batch()

    //       historyItem.ids.forEach(id => {
    //         this.todosRef.doc(id).update(newValue)
    //       })

    //       batch.commit()
    //       break

    //     default:
    //       break
    //   }
    // },
    // toggleTodoDone (todo) {
    //   if (todo.done) {
    //     todo.done = false
    //     todo.doneDate = firebase.firestore.FieldValue.delete()
    //   } else {
    //     todo.done = true
    //     todo.doneDate = new Date()
    //   }
    //   this.updateTodo(todo)
    // },
    // undoLastTodo (e) {
    //   const lastTodo = this.lastDone

    //   if (lastTodo) {
    //     lastTodo.done = false
    //     // lastTodo.doneDate = firebase.firestore.FieldValue.delete()
    //     // TODO: place deleted to first place
    //     this.updateTodo(lastTodo)
    //   }
    // },
    // swapTodo (stack) {
    //   const stackTodos = this.stackTodosNotDone(stack.id)
    //   const currentTodo = stackTodos[0]

    //   const batch = fireApp.firestore().batch()

    //   batch.update(this.todosRef.doc(currentTodo.id), { order: stackTodos.length - 1 })

    //   stackTodos.slice(1).forEach((todo, index) => {
    //     batch.update(this.todosRef.doc(todo.id), { order: index })
    //   })

    //   batch.commit()
    // },
    // swapTodoBack (stack) {
    //   const stackTodos = this.stackTodosNotDone(stack.id)
    //   const prevTodo = stackTodos[stackTodos.length - 1]

    //   const batch = fireApp.firestore().batch()

    //   batch.update(this.todosRef.doc(prevTodo.id), { order: 0 })

    //   stackTodos.slice(0, stackTodos.length - 1).forEach((todo, index) => {
    //     batch.update(this.todosRef.doc(todo.id), { order: index + 1 })
    //   })

    //   batch.commit()
    // }
  }
}
</script>
