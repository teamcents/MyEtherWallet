<template>
  <div class="swap-container">
    <swap-confirmation-modal/>

    <div class="title-block">
      <interface-container-title :title="$t('common.swap')"/>
      <div class="buy-eth">
        <span>Buy ETH with</span>
        <img :src="images.visaMaster">
      </div>
    </div>

    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="title">
            <h4>{{ $t('common.from') }}</h4>
          </div>
          <swap-currency-picker
            :currencies="fromArray"
            :token="true"
            page="SwapContainerFrom"
            @selectedCurrency="setFromCurrency"/>
          <div class="the-form amount-number">
            <input
              type="number"
              name=""
              value=""
              placeholder="Deposit Amount">
          </div>
        </div>
        <div class="exchange-icon">
          <img :src="images.swap">
        </div>
        <div class="amount">
          <div class="title">
            <h4>{{ $t('common.to') }}</h4>
          </div>
          <swap-currency-picker
            :currencies="toArray"
            :token="true"
            page="SwapContainerTo"
            @selectedCurrency="setToCurrency"/>
          <div class="the-form amount-number">
            <input
              type="number"
              name=""
              value=""
              placeholder="Received Amount">
          </div>
        </div>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title title-and-copy">
          <h4>{{ $t('common.toAddress') }}</h4>
          <p class="copy-button prevent-user-select">Copy</p>
        </div>
      </div>
      <div class="the-form gas-amount">
        <drop-down-address-selector/>
      </div>
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title title-and-copy">
          <h4>Providers</h4>
        </div>
      </div>
      <providers-radio-selector/>
    </div>

    <div
      v-if="false"
      class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-and-popover">
            <h4>{{ $t('common.speedTx') }}</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTX')"/>
          </div>
          <p>{{ $t('common.txFee') }}: 0.000013 ETH ($1.234)</p>
        </div>
        <div class="buttons">
          <div class="small-circle-button-green-border">
            {{ $t('common.slow') }}
          </div>
          <div class="small-circle-button-green-border active">
            {{ $t('common.regular') }}
          </div>
          <div class="small-circle-button-green-border">
            {{ $t('common.fast') }}
          </div>
        </div>
      </div>

      <div class="the-form gas-amount">
        <input
          type="number"
          name=""
          value=""
          placeholder="Gas Amount">
        <div class="good-button-container">
          <p>Gwei</p>
          <i
            class="fa fa-check-circle good-button not-good"
            aria-hidden="true"/>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <h4 v-if="false">1 ETH = 0.000231 BTC</h4>
      <div
        class="submit-button large-round-button-green-filled clickable"
        @click="swapConfirmationModalOpen">
        {{ $t('common.continue') }}
        <i
          class="fa fa-long-arrow-right"
          aria-hidden="true"/>
      </div>
    </div>

  </div>
</template>
<script>
/*eslint-disable*/

import ProvidersRadioSelector from './components/ProvidersRadioSelector';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import swapIcon from '@/assets/images/icons/swap.svg';
import ImageKybernetowrk from '@/assets/images/etc/kybernetowrk.png';
import ImageBity from '@/assets/images/etc/bity.png';
import ImageVisaMaster from '@/assets/images/etc/visamaster.png';

import SwapCurrencyPicker from './components/SwapCurrencyPicker';
import SwapConfirmationModal from './components/SwapConfirmationModal';

import {
  BitySwap,
  bityCurrencies,
  kyberCurrencies,
  currencies as partnerConfig,
  changellyCurrencies,
  CurrencyFilter
} from '@/partners';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'swap-currency-picker': SwapCurrencyPicker,
    'drop-down-address-selector': DropDownAddressSelector,
    'providers-radio-selector': ProvidersRadioSelector,
    'swap-confirmation-modal': SwapConfirmationModal
  },
  data() {
    return {
      bitySwap: {},
      images: {
        kybernetowrk: ImageKybernetowrk,
        bity: ImageBity,
        visaMaster: ImageVisaMaster,
        swap: swapIcon
      },
      fromCurrency: 'BTC',
      toCurrency: 'ETH',
      toArray: [
        { symbol: 'BTC', name: 'Bitcoin' },
        { symbol: 'REP', name: 'Augur' },
        { symbol: 'OMG', name: 'OhMyGod' }
      ],
      fromArray: [
        { symbol: 'BTC', name: 'Bitcoin' },
        { symbol: 'REP', name: 'Augur' },
        { symbol: 'OMG', name: 'OhMyGod' }
      ]
    };
  },
  computed: {
    // toAvailable() {},
    // fromAvailable() {}
  },
  mounted() {
    const collectMap = new Map();
    for(let prop in bityCurrencies){
      if(bityCurrencies[prop]) collectMap.set(prop, { symbol: prop, name: bityCurrencies[prop].name })
    }
    for(let prop in kyberCurrencies){
      if(kyberCurrencies[prop]) collectMap.set(prop, { symbol: prop, name: kyberCurrencies[prop].name })
    }
    for(let prop in changellyCurrencies){
      if(changellyCurrencies[prop]) collectMap.set(prop, { symbol: prop, name: changellyCurrencies[prop].name })
    }
    collectMap.set('ETH', { symbol: 'ETH', name: 'Ether' })
    // if(collectMap.has(this.toCurrency))
    this.toArray = Array.from(collectMap.values()).sort(this.comparator);
    this.fromArray = Array.from(collectMap.values()).sort(this.comparator);
  },
  methods: {
    swapConfirmationModalOpen() {
      this.$children[0].$refs.swapconfirmation.show();
    },
    setFromCurrency(value) {
      const collectMap = new Map();
      if (bityCurrencies[value.symbol]) {
        for(let prop in bityCurrencies){
          if(prop !== value.symbol){
            if(bityCurrencies[prop]) collectMap.set(prop, { symbol: prop, name: bityCurrencies[prop].name })
          }
        }
      }
      if (kyberCurrencies[value.symbol]) {
        for(let prop in kyberCurrencies){
          if(prop !== value.symbol){
            if(kyberCurrencies[prop]) collectMap.set(prop, { symbol: prop, name: kyberCurrencies[prop].name })
          }
        }
      }
      if (changellyCurrencies[value.symbol]) {
        for(let prop in changellyCurrencies){
          if(prop !== value.symbol){
            if(changellyCurrencies[prop]) collectMap.set(prop, { symbol: prop, name: changellyCurrencies[prop].name })
          }
        }
      }
      // if(collectMap.has(this.toCurrency))
      collectMap.set('ETH', { symbol: 'ETH', name: 'Ether' })
      this.toArray = Array.from(collectMap.values()).sort(this.comparator)
      console.log(value.symbol); // todo remove dev item

    },
    setToCurrency(value) {
      const collectMap = new Map();
      if (bityCurrencies[value.symbol]) {
        for(let prop in bityCurrencies){
          if(prop !== value.symbol){
            if(bityCurrencies[prop]) collectMap.set(prop, { symbol: prop, name: bityCurrencies[prop].name })
          }
        }
      }
      if (kyberCurrencies[value.symbol]) {
        for(let prop in kyberCurrencies){
          if(prop !== value.symbol){
            if(kyberCurrencies[prop]) collectMap.set(prop, { symbol: prop, name: kyberCurrencies[prop].name })
          }
        }
      }
      if (changellyCurrencies[value.symbol]) {
        for(let prop in changellyCurrencies){
          if(prop !== value.symbol){
            if(changellyCurrencies[prop]) collectMap.set(prop, { symbol: prop, name: changellyCurrencies[prop].name })
          }
        }
      }
      // if(collectMap.has(this.toCurrency))
      collectMap.set('ETH', { symbol: 'ETH', name: 'Ether' })
      this.fromArray = Array.from(collectMap.values()).sort(this.comparator)
      console.log(value.symbol); // todo remove dev item
    },
    updateValidPairs() {
      // this.toArray;
    },
    comparator(a, b) {
      a = a.symbol;
      b = b.symbol;
      return a < b ? -1 : a > b ? 1 : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapContainer.scss';
</style>
