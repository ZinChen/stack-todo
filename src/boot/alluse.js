import Vue2TouchEvents from 'vue2-touch-events'

export default ({ Vue /* app, router, Vue, ... */ }) => {
  Vue.use(Vue2TouchEvents, {
    touchHoldTolerance: 300,
  })
}
