<template lang="pug">
  #q-app
    .text-center
      .row
        .button(@click='tests') Test
      .row
        | state: {{ state }}
    router-view
</template>

<script>
import firebase from 'firebase'
// import { fireApp } from 'boot/fire.js'

export default {
  name: 'App',
  data: function () {
    return {
      state: 'init'
    }
  },
  // TODO: Try to use signup with login and password if it's not web
  beforeCreate: function() {
    firebase.auth().getRedirectResult()
    firebase.auth().onAuthStateChanged((user) => {
      console.log('user', user)
      // Read about auth types here: https://firebase.google.com/docs/auth/web/cordova
      if (!user && confirm('Auth?')) {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithRedirect(provider).then(function() {
          return firebase.auth().getRedirectResult()
        })
      } else {
        this.state = 'logged in'
        this.$root.$emit('state_update', this.state)
      }
      //  else {
      //   const stacksRef = fireApp.firestore()
      //     .collection('users')
      //     .doc(user.uid)
      //     .collection('stacks')

      // }
    })
  },
  methods: {
    tests: function() {
      console.log('firebase.auth().currentUser', firebase.auth().currentUser)
      // firebase.auth().signOut()
      this.$root.$emit('state_update', this.state)
    }
  }
}
</script>
