import firebase from 'firebase'
// import { firestorePlugin } from 'vuefire'
import firebaseConfig from './firebaseConfig'

export const fireApp = firebase.initializeApp(firebaseConfig)

export const todosRefGetter = (user) => fireApp.firestore()
  .collection('users')
  .doc(user.uid)
  .collection('todos')

export const stacksRefGetter = (user) => fireApp.firestore()
  .collection('users')
  .doc(user.uid)
  .collection('stacks')
