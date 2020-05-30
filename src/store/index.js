import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actionsBasic from './actionsBasic'
import * as actionsHistory from './actionsHistory'
import * as actionsFirebase from './actionsFirebase'
import * as actionsUI from './actionsUI'
import * as actionsComplex from './actionsComplex'

Vue.use(Vuex)

export default function () {
  const store = new Vuex.Store({
    namespaced: true,
    state,
    getters,
    mutations: {
      ...vuexfireMutations,
      ...mutations
    },
    actions: {
      ...actionsBasic,
      ...actionsHistory,
      ...actionsFirebase,
      ...actionsUI,
      ...actionsComplex,
    },
    strict: process.env.DEV
  })

  /*
    if we want some HMR magic for it, we handle
    the hot update like below. Notice we guard this
    code with "process.env.DEV" -- so this doesn't
    get into our production build (and it shouldn't).
  */

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./'], () => {
      const newShowcase = require('./').default
      store.hotUpdate({ modules: { showcase: newShowcase } })
    })
  }

  return store
}
