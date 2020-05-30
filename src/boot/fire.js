import firebase from 'firebase'
// import { firestorePlugin } from 'vuefire'
import firebaseConfig from './firebaseConfig'

export const fireApp = firebase.initializeApp(firebaseConfig)

export const settingsRefGetter = () => fireApp.firestore()
  .collection('user_settings')
  .doc(firebase.auth().currentUser.uid)

export const todosRefGetter = () => fireApp.firestore()
  .collection('users')
  .doc(firebase.auth().currentUser.uid)
  .collection('todos')

export const stacksRefGetter = () => fireApp.firestore()
  .collection('users')
  .doc(firebase.auth().currentUser.uid)
  .collection('stacks')

export const sampleItems = {
  stacks: [
    'Home',
    'Hobby',
    'Weekend'
  ],
  todos: [
    {
      stack: 'Home',
      title: 'Cleaning',
      done: true
    },
    {
      stack: 'Home',
      title: 'Make a lunch',
    },
    {
      stack: 'Home',
      title: 'Do some laundry',
    },
    {
      stack: 'Home',
      title: 'Make a dinner',
    },
    {
      stack: 'Hobby',
      title: 'Draw a sketch',
    },
    {
      stack: 'Hobby',
      title: 'Play guitar',
    },
    {
      stack: 'Hobby',
      title: 'Watch a movie',
    },
    {
      stack: 'Weekend',
      title: 'Walk in the park',
    },
    {
      stack: 'Weekend',
      title: 'Have a picnic',
    },
    {
      stack: 'Weekend',
      title: 'Visit family',
    },
  ]
}
