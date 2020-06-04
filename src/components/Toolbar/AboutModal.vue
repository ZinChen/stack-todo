<template lang="pug">
    q-dialog(
      :value="toolbar.aboutModal"
      @before-hide="toggleAbout"
    )
      q-card
        q-card-section
          div.text-h6 About

        q-card-section.q-pt-none.q-px-xl
          .text-h5.text-center.q-mb-lg
            | Stack Todo

          p.q-mb-md This application will help you with managing daily tasks. If you have any ideas to make this app better, feel free to contact.

          p
            strong Web page: &nbsp;
            a(href="https://stack-todo.now.sh/") https://stack-todo.now.sh/
          P
            strong Source: &nbsp;
            a(href="https://github.com/ZinChen/stack-todo") https://github.com/ZinChen/stack-todo
          p
            strong Email: &nbsp;
            a(href="email:zinchen777@gmail.com") zinchen777@gmail.com

        q-card-actions(align="right")
          q-btn(flat label="OK" color="primary" v-close-popup)
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'about-modal',
  computed: mapState([
    'toolbar'
  ]),
  methods: mapMutations([
    'toggleAbout'
  ])
}
</script>
