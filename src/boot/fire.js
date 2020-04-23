// import something here
import firebase from 'firebase'
import { firestorePlugin } from 'vuefire'
import firebaseConfig from './firebaseConfig'

export const fireApp = firebase.initializeApp(firebaseConfig)

// "async" is optional
export default ({ Vue /* app, router, Vue, ... */ }) => {
  Vue.use(firestorePlugin)
}
