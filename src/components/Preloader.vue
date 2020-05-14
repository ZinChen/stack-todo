<template lang="pug">
.layout(
  :class="mode"
)
  .icon-container
    .stack.stack-leaving
      .stack-title
      .stack-items
        .stack-item
        .stack-item
        .stack-item
    .stack.stack-entering
      .stack-title
    .stack.stack-appearing
      .stack-title
    .stack
      .stack-title
      .stack-items.animated-items
        .stack-item
        .stack-item
        .stack-item
</template>

<style lang="sass" scoped>
$duration: 2s
$delay: -1.1s
$stack-size: 20vmin
$stack-bradius: 2vmin
$stack-item-shadow-top: -43px 54.7px 19.3px rgba(0, 0, 0, 0.036), 6px 72.3px 47.9px rgba(0, 0, 0, 0.054)
$stack-item-shadow-down: 0px 0.5px 0.5px 0px rgba(0, 0, 0, 0.105), 0 1.6px 1.6px -2px rgba(0, 0, 0, 0.155)
$movestartat: 40%
$moveendsat: 80%

@keyframes stack-slide
  0%
    transform: translateY(0)
  #{$movestartat}
    transform: translateY(0)
  #{$moveendsat}
    transform: translateY(-150%)
  100%
    transform: translateY(-150%)

@for $i from 1 through 3
  @keyframes item-drop-#{$i}
    0%
      transform: translate(150px, -150px)
      box-shadow: $stack-item-shadow-top
      opacity: 0
    #{$i * 4%}
      opacity: 1
    #{$i * 9% + 5%}
      transform: translate(0, 0)
      box-shadow: $stack-item-shadow-down
    100%
      transform: translate(0, 0)

@keyframes stack-appearing
  0%
    transform: translateY(300%)
  #{$movestartat}
    transform: translateY(300%)
  #{$moveendsat}
    transform: translateY(150%)
  100%
    transform: translateY(150%)

@keyframes stack-entering
  0%
    transform: translateY(150%)
  #{$movestartat}
    transform: translateY(150%)
  #{$moveendsat}
    transform: translateY(0)
  100%
    transform: translateY(0)

@keyframes stack-leaving
  0%
    transform: translateY(-150%)
  #{$movestartat}
    transform: translateY(-150%)
  #{$moveendsat}
    transform: translateY(-300%)
  100%
    transform: translateY(-300%)

.layout
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: #f0f0f0
  display: flex
  flex-flow: column
  align-items: center
  justify-content: center
  z-index: 10

.layout:not(.full)
  .stack
    animation-delay: .8s
    animation-play-state: paused

  .stack-appearing,
  .stack-entering,
  .stack-leaving
    display: none
    animation: none

.layout.freezed
  .stack-items.animated-items
    .stack-item
      animation-play-state: paused
      animation-delay: -.30s
      // animation-delay: -0.75s

.layout.static
  .stack-items.animated-items
    .stack-item
      animation: none

    .stack-item:last-child
      transform: translate(85px, -85px)
      box-shadow: $stack-item-shadow-top

    .stack-item:nth-child(2)
      transform: translate(40px, -40px)
      box-shadow: $stack-item-shadow-top

.icon-container
  position: relative
  padding: 20vmin
  // border: 1px solid #e0e0e0
  transform: rotateX(45deg) rotateZ(-45deg)
  overflow: hidden

.stack
  position: relative
  width: $stack-size
  height: $stack-size
  border-radius: $stack-bradius
  background: #fff
  animation: #{$duration} stack-slide #{$delay} forwards infinite ease-in-out
  will-change: transition

.stack-appearing
  position: absolute
  animation: #{$duration} stack-appearing #{$delay} forwards infinite ease-in-out

.stack-entering
  position: absolute
  animation: #{$duration} stack-entering #{$delay} forwards infinite ease-in-out

.stack-leaving
  position: absolute
  animation: #{$duration} stack-leaving #{$delay} forwards infinite ease-in-out

.stack-title
  position: absolute
  top: 20%
  left: 10%
  height: 10%
  width: 60%
  border-radius: 1vmin
  background: #cecece

.stack-items
  width: 100%
  height: 100%

.stack-item
  position: absolute
  top: 50%
  left: 10%
  height: 30%
  width: 80%
  border-radius: 1vmin
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%)
  box-shadow: $stack-item-shadow-down
  will-change: transition, box-shadow

.stack-items.animated-items
  @for $i from 1 through 3
    .stack-item:nth-child(#{$i})
      animation: #{$duration} item-drop-#{$i} #{$delay} forwards infinite ease-in-out

</style>

<script>
export default {
  name: 'preloader',
  data: function () {
    return {
      mode: 'freezed' // 'full', 'simple', 'freezed ,'static'
    }
  }
}
</script>
