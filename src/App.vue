<template lang="pug">
  #q-app
    .container
      .section
        .row
          | Current: {{ user.email }}
        .row(
          v-if="state == 'logged_in'"
        )
          .button(@click='logout') Logout
        .row(
          v-else
        )
          .button(@click='login') Login

    router-view
</template>

<script>
import firebase from 'firebase'

const login = function() {
  // Read about auth types here: https://firebase.google.com/docs/auth/web/cordova
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithRedirect(provider).then(function() {
    return firebase.auth().getRedirectResult()
  })
}

export default {
  name: 'App',
  data: function () {
    return {
      state: 'init',
      user: {},
    }
  },
  // TODO: Try to use signup with login and password if it's not web
  beforeCreate: function() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log('user', user)

      if (!user && confirm('Auth?')) {
        login()
      } else if (user) {
        this.state = 'logged_in'
        this.$root.$emit('state_update', this.state)
        this.user = user
      }
      //  else {
      //   const stacksRef = fireApp.firestore()
      //     .collection('users')
      //     .doc(user.uid)
      //     .collection('stacks')

      // }
    })
  },
  computed: {
    currentUser: function() {
      console.log(' firebase.auth().currentUser.email',  (firebase.auth().currentUser || {}).email)
      if (this.state === 'logged_in') {
        return firebase.auth().currentUser || {}
      } else {
        return {}
      }
    }
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(function() {
        this.state = 'logout'
        this.user = {}
        this.$root.$emit('state_update', this.state)
      }, function(error) {
        console.log('error on logout: ', error)
      });
    },
    login
  }
}
</script>
