<template>
  <div class="what-is-mew">

    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          Congratulations!
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue"></div>
        </div>
        <div class="block-progressbar__content text-cented">

          <img src="~@/assets/images/icons/drink.svg">

          <p>
            You have read through our warning slides, and you're ready to
            dive in. If you want to know more, please head to our
            <a href="">Help Center</a>. We have many articles to assist you!
          </p>

          <div class="mid-round-button-green-filled-green-border" @click="complete">Get Started</div>
          <!--<router-link to="/create-wallet">-->
            <!--<div class="mid-round-button-green-filled-green-border">Get Started</div>-->
          <!--</router-link>-->

        </div>
      </dir>
    </div>

  </div>
</template>

<script>
import store from 'store'

export default {
  props: ['progressBarValue'],
  components: {},
  data () {
    return {}
  },
  methods: {
    complete () {
      store.set('tutorialComplete', true)
      this.$router.push({path: 'create-wallet'})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../BlockWithProgressBar.scss";
</style>
