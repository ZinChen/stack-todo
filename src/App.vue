<template lang="pug">
  #q-app
    transition
      preloader(
        v-show="state != 'logged_in'"
      )
    q-toolbar.bg-white
      q-avatar.bg-grey
        img.toolbar-avatar(
          v-if="user.photoURL"
          :src="user.photoURL"
        )
        q-menu
          q-list(dense)
            q-item
              q-item-section(
                clickable
                @click="logout"
              ) Logout

      q-toolbar-title
        | {{ user.email }}

    router-view
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import firebase from 'firebase'
import Preloader from 'components/Preloader'

// TODO: compare with inserting preloader directly in index.html and hide it with "watch" and "document.querySelector(#preloader)"

const login = function () {
  // Read about auth types here: https://firebase.google.com/docs/auth/web/cordova
  const provider = new firebase.auth.GoogleAuthProvider().setCustomParameters({
    prompt: 'select_account'
  })
  firebase.auth().signInWithRedirect(provider).then(function () {
    return firebase.auth().getRedirectResult()
  })
}

export default {
  name: 'App',
  components: { Preloader },
  data: function () {
    return {
      state: 'init',
      user: {},
    }
  },
  // TODO: Try to use signup with login and password if it's not web
  beforeCreate: function () {
    // firebase.auth().getRedirectResult()
    firebase.auth().onAuthStateChanged((user) => {
      if (isEmpty(user)) {
        login()
      } else if (user) {
        this.state = 'logged_in'
        this.$root.$emit('state_update', this.state)
        this.user = user
      }
    })
  },
  methods: {
    logout: function () {
      firebase.auth().signOut().then(() => {
        this.state = 'logout'
        this.user = {}
        this.$root.$emit('state_update', this.state)
      }, (error) => {
        console.log('error on logout: ', error)
      })
    },
    login,
    test: function () {
      console.log('just for test')
    }
  }
}
</script>
