import firebase from 'firebase'
// import { firestorePlugin } from 'vuefire'
import firebaseConfig from './firebaseConfig'

export const fireApp = firebase.initializeApp(firebaseConfig)

export const todosRefGetter = () => fireApp.firestore()
  .collection('users')
  .doc(firebase.auth().currentUser.uid)
  .collection('todos')

export const stacksRefGetter = () => fireApp.firestore()
  .collection('users')
  .doc(firebase.auth().currentUser.uid)
  .collection('stacks')
