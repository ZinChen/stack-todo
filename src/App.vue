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
import { mapState, mapMutations, mapActions } from 'vuex'
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
  computed: mapState([
    'loadingState',
    'user'
  ]),
  // TODO: Try to use signup with login and password if it's not web
  beforeCreate: function () {
    // firebase.auth().getRedirectResult()
    firebase.auth().onAuthStateChanged((user) => {
      if (isEmpty(user)) {
        login()
      } else if (user) {
        console.log('user in App', user)
        this.setAuthState('logged_in')
        this.setLoadingState('loaded')
        this.setUser(user)
        this.bindFirestoreTodosRef()
        this.bindFirestoreStacksRef()
      }
    })
  },
  methods: {
    logout: function () {
      firebase.auth().signOut().then(() => {
        this.setAuthState('logout')
        this.setLoadingState('loading')
        this.setUser({})
        this.unbindFirestoreRefs()
      }, (error) => {
        console.log('error on logout: ', error)
      })
    },
    login,
    test: function () {
      console.log('just for test')
    },
    ...mapMutations([
      'setUser',
      'setAuthState',
      'setLoadingState',
    ]),
    ...mapActions([
      'bindFirestoreTodosRef',
      'bindFirestoreStacksRef',
      'unbindFirestoreRefs',
    ])
  }
}
</script>
