<template>
  <div class="interface-address">
    <div class="info-block address">
      <div class="block-image">
        <blockie :address="address" width="64px" height="64px"/>
        <input ref="copyAddress" class="hidden-input" :value="address" autocomplete="off"/>
      </div>
      <div class="block-content">
        <div class="information-container">
          <h2>{{ $t("common.address") }}</h2>
          <p class="address">{{address}}</p>
        </div>
        <div class="icon-container">
          <b-btn class="custom-tooltip" id="print">
            <img src="~@/assets/images/icons/printer-white.svg">
          </b-btn>
          <b-btn class="custom-tooltip" @click="copy" id="copy">
            <img src="~@/assets/images/icons/copy.svg">
          </b-btn>
          <b-btn class="custom-tooltip" @click="switchAddress" id="switch">
            <img src="~@/assets/images/icons/change.svg">
          </b-btn>
          <b-popover target="print" placement="top" triggers="hover" title=""
                     :content="$t('popover.print')"></b-popover>
          <b-popover target="copy" placement="top" triggers="hover" title="" :content="$t('popover.copy')"></b-popover>
          <b-popover target="switch" placement="top" triggers="hover" title=""
                     :content="$t('popover.switchAddress')"></b-popover>
        </div>
      </div>
    </div>
    <interface-address-modal ref="switchAddressModal"></interface-address-modal>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie'
import InterfaceAddressModal from '../InterfaceAddressModal'

export default {
  props: ['address'],
  components: {
    'blockie': Blockie,
    'interface-address-modal': InterfaceAddressModal
  },
  methods: {
    copy () {
      this.$refs.copyAddress.select()
      document.execCommand('copy')
    },
    switchAddress () {
      this.$refs.switchAddressModal.$refs.switchAddressModal.show()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceAddress.scss";
</style>
