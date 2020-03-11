// import something here
import firebase from 'firebase'
import { firestorePlugin } from 'vuefire'

const firebaseConfig = {
  apiKey: "AIzaSyCv2Va6fg2gYgGfBuMgtarpEltRkBQtd5k",
  authDomain: "stack-todo-3a3e9.firebaseapp.com",
  databaseURL: "https://stack-todo-3a3e9.firebaseio.com",
  projectId: "stack-todo-3a3e9",
  storageBucket: "stack-todo-3a3e9.appspot.com",
  messagingSenderId: "766212534759",
  appId: "1:766212534759:web:9dcda14e51895b60c20d42"
}

export const fireApp = firebase.initializeApp(firebaseConfig)

// "async" is optional
export default ({  Vue /* app, router, Vue, ... */ }) => {
  Vue.use(firestorePlugin)
}
