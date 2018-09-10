<template>
  <div class="interface-address">
    <div class="info-block address">
      <div class="block-image">
        <blockie
          :address="address"
          width="64px"
          height="64px"/>
        <input
          ref="copyAddress"
          :value="address"
          class="hidden-input"
          autocomplete="off">
      </div>
      <div class="block-content">
        <div class="information-container">
          <h2>{{ $t("common.address") }}</h2>
          <p class="address">{{ address }}</p>
        </div>
        <div class="icon-container">
          <b-btn
            id="print"
            class="custom-tooltip">
            <img src="~@/assets/images/icons/printer-white.svg">
          </b-btn>
          <b-btn
            id="copy"
            class="custom-tooltip"
            @click="copy">
            <img src="~@/assets/images/icons/copy.svg">
          </b-btn>
          <b-btn class="custom-tooltip" @click="switchAddress" id="switch">
            <img src="~@/assets/images/icons/change.svg">
          </b-btn>
          <b-popover
            :content="$t('popover.print')"
            target="print"
            placement="top"
            triggers="hover"
            title=""/>
          <b-popover
            :content="$t('popover.copy')"
            target="copy"
            placement="top"
            triggers="hover"
            title=""/>
          <b-popover
            :content="$t('popover.switchAddress')"
            target="switch"
            placement="top"
            triggers="hover"
            title=""/>
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
  components: {
    blockie: Blockie,
    'interface-address-modal': InterfaceAddressModal
  },
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  methods: {
    copy() {
      this.$refs.copyAddress.select();
      document.execCommand('copy');
    },
    switchAddress () {
      this.$refs.switchAddressModal.$refs.switchAddressModal.show()
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceAddress.scss';
</style>
