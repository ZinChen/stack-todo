<template lang="pug">
  #q-app
    transition(
      appear
      leave-active-class="animated fadeOut"
    )
      preloader(
        v-show="loadingState == 'loading'"
      )
    toolbar

    router-view
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import isEmpty from 'lodash/isEmpty'
import firebase from 'firebase'
import Preloader from 'components/Preloader'
import Toolbar from 'components/Toolbar/Toolbar'

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
  components: { Preloader, Toolbar },
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
        this.setAuthState('logged_in')
        this.setLoadingState('loaded')
        this.setUser(user)
        this.bindFirestoreSettingsRef()
        this.bindFirestoreTodosRef()
        this.bindFirestoreStacksRef()
      }
    })

    window.addEventListener('beforeinstallprompt', (e) => {
      this.setPWAButton(true)
      this.setPWAEvent(e)
      // Prevent the mini-infobar from appearing on mobile
      // e.preventDefault();
      // Stash the event so it can be triggered later.
      // deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      // showInstallPromotion();
    })
    window.addEventListener('appinstalled', () => {
      console.log('===============')
      console.log('app installed')
      this.setPWAButton(false)
    })
  },
  methods: {
    login,
    ...mapMutations([
      'setUser',
      'setAuthState',
      'setLoadingState',
      'setPWAButton',
      'setPWAEvent'
    ]),
    ...mapActions([
      'bindFirestoreSettingsRef',
      'bindFirestoreTodosRef',
      'bindFirestoreStacksRef',
      'unbindFirestoreRefs',
    ])
  }
}
</script>
