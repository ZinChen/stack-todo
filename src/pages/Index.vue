<template lang="pug">
  mixin tile(customClass, title, desc)
    article(class='tile is-child notification ' + customClass)
      p.title= title
      p.subtitle= desc

  layout
    section.section
      h1.title Section
      .tile.is-ancestor
        .tile
          .tile.is-parent.is-vertical
            +tile('is-primary', 'Lorem tile', 'Lorem, ipsum dolor.')
            +tile('is-warning', 'Ipsum tile', 'Lorem ipsum dolor sit.')
          .tile.is-parent
            +tile('is-success', 'Dolor tile', 'Lorem dolor.')
        .tile.is-parent
          +tile('is-info', 'Ipsum tile', 'Dolor sit amet.')
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
