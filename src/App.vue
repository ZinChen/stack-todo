<template lang="pug">
  #q-app
    transition(
      appear
      leave-active-class="animated fadeOut"
    )
      preloader(
        v-show="loadingState == 'loading'"
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

const login = function () {
  // Read about auth types here: https://firebase.google.com/docs/auth/web/cordova
  const provider = new firebase.auth.GoogleAuthProvider().setCustomParameters({
    prompt: 'select_account' // TODO: check if it's needed
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
      authState: 'init',
      loadingState: 'loading',
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
        this.authState = 'logged_in'
        this.user = user
        this.$root.$emit('auth_state', this.authState)
        setTimeout(() => {
          this.loadingState = 'loaded'
          this.$root.$emit('loading_state', this.loadingState)
        }, 2000)
      }
    })
  },
  methods: {
    logout: function () {
      firebase.auth().signOut().then(() => {
        this.authState = 'logout'
        this.loadingState = 'loading'
        this.user = {}
        this.$root.$emit('auth_state', this.authState)
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
