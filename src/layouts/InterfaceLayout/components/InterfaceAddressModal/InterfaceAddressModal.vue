<template>
  <b-modal ref="switchAddressModal" hide-footer class="bootstrap-modal modal-network-and-address"
           title="Network and Address" centered>
    <div class="content-container-1">

    </div>
    <div class="content-container-2">
      <div class="address-block-container">
        <div class="block-title">
          <h4>{{ $t('accessWallet.interactAddr') }}</h4>
        </div>

        <ul class="address-block table-header">
          <li>{{ $t('accessWallet.id') }}</li>
          <li>{{ $t('common.address') }}</li>
          <li>{{ $t('common.balance') }}</li>
          <li></li>
        </ul>

        <ul class="address-block address-data" v-for="(details, index) in orderedAddresses"
            v-bind:data-address="'address' + index"
            v-bind:key="index"
            @click="setAddress(details)"
            v-on:click="unselectAllAddresses">
          <li>{{details.index + 1}}.</li>
          <li>{{details.address}}</li>
          <li>{{details.balance}} ETH</li>
          <li class="user-input-checkbox">
            <label class="checkbox-container checkbox-container-small">
              <input v-bind:id="'address' + index" v-on:click="unselectAllAddresses" type="checkbox"/>
              <span class="checkmark checkmark-small"></span>
            </label>
          </li>
        </ul>

      </div> <!-- .address-block-container -->

      <div class="address-nav">
        <span v-on:click="priorAddressSet()" v-show="!connectionActive">&lt; {{ $t('common.previous') }}</span>
        <span v-on:click="nextAddressSet()" v-show="!connectionActive">{{ $t('common.next') }} &gt;</span>
        <!-- Probably will need to restructure a bit to allow back browsing while new addresses are retrieved-->
        <span v-show="connectionActive" class="activeConn">&lt; {{ $t('common.previous') }}</span>
        <span v-show="connectionActive" class="activeConn">{{ $t('common.next') }} &gt;</span>
      </div>
    </div> <!-- .content-container-2 -->

    <div class="button-container">
      <b-btn @click.prevent="unlockWallet" class="mid-round-button-green-filled close-button"
             :disabled="accessMyWalletBtnDisabled">
        {{ $t("common.accessMyWallet") }}
      </b-btn>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>{{ $t('common.customerSupport') }}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
const unit = require('ethjs-unit')

export default {
  data () {
    return {
      accessMyWalletBtnDisabled: true,
      walletUnlocked: false,
      connectionActive: false,
      offset: 0,
      count: 5,
      currentIndex: 0,
      maxIndex: 0,
      minIndex: 0,
      hardwareAddresses: [],
      displayAddresses: [],
      availablePaths: {},
      customPaths: {},
      selecteDPath: '',
      invalidPath: '',
      customPathInput: false,
      customPath: {label: '', dpath: ''},
      tenativeSwitchedAddress: {address: '', index: ''}
    }
  },
  mounted () {
    // reset component values when modal becomes hidden
    this.$refs.switchAddressModal.$on('hidden', () => {
      this.accessMyWalletBtnDisabled = true
      this.walletUnlocked = false
      this.availablePaths = {}
      this.selecteDPath = ''
      this.invalidPath = ''
      this.customPathInput = false
      this.customPath = {label: '', dpath: ''}
      this.resetPaginationValues()
    })

    this.$refs.switchAddressModal.$once('shown', () => {
      const indexRegex = /\/(\d+)\s*$/
      const addressDerivePath = this.$store.state.wallet.wallet.wallet.path
      const baseIndex = indexRegex.exec(addressDerivePath)
      this.minIndex = +baseIndex[1]
      this.currentIndex = +baseIndex[1]
      console.log(this.minIndex) // todo remove dev item
      this.getAddresses(5, baseIndex[1])
        .then(_result => {
          this.displayAddresses = _result
          console.log(_result) // todo remove dev item
        })
    })
  },
  computed: {
    orderedAddresses () {
      let addressSet = [...this.displayAddresses]
      addressSet.sort(this.comparator)
      return addressSet.sort(this.comparator)
    }
  },
  methods: {
    comparator (a, b) {
      a = (a.index + 1)
      b = (b.index + 1)
      return a < b ? -1 : a > b ? 1 : 0
    },
    unselectAllAddresses: function (e) {
      const selected = e.srcElement.parentElement.dataset.address
        ? e.srcElement.parentElement.dataset.address
        : e.srcElement.id
      document.querySelectorAll('.user-input-checkbox input').forEach(function (el) {
        el.checked = el.id === selected
      })
      this.accessMyWalletBtnDisabled = false
    },
    resetPaginationValues () {
      this.offset = 0
      this.count = 5
      this.currentIndex = 0
      this.maxIndex = 0
      this.displayAddresses = []
      this.hardwareAddresses = []
    },
    unlockWallet () {
      console.log('decryptWallet') // todo remove dev item
      this.$store.state.wallet.wallet.setActiveAddress(this.tenativeSwitchedAddress.address, this.tenativeSwitchedAddress.index)
      this.$refs.switchAddressModal.hide()
      // this.$store.dispatch('decryptWallet', this.hardwareWallet)
      // this.$router.push({path: 'interface'})
    },
    setAddress (details) {
      this.tenativeSwitchedAddress = {address: details.address, index: details.index}
      // this.hardwareWallet.setActiveAddress(details.address, details.index)
    },
    priorAddressSet () {
      let priorSetStart = this.currentIndex - this.count - this.count
      if (priorSetStart < this.minIndex) {
        if (priorSetStart <= 0) {
          this.currentIndex = 0
          this.minIndex = 0
          priorSetStart = 0
        } else {
          this.currentIndex = priorSetStart
          this.minIndex = priorSetStart
        }
        console.log(priorSetStart) // todo remove dev item
        this.getAddresses(this.count, priorSetStart)
          .then(addressSet => {
            this.displayAddresses = addressSet
          })
      } else if (this.currentIndex - this.count > 0) {
        this.currentIndex = this.currentIndex - this.count

        this.displayAddresses = this.hardwareAddresses.slice(this.currentIndex - this.count, this.currentIndex)
      } else {
        this.offset = 0
        this.currentIndex = 0
        this.displayAddresses = this.hardwareAddresses.slice(0, 5)
      }
    },

    /*
    *
    *         let bottomBound = this.currentIndex - this.count
        let upperBound = this.currentIndex
        */
    nextAddressSet () {
      if ((this.currentIndex + this.count) < this.maxIndex) {
        this.currentIndex = this.currentIndex + this.count
        console.log('1', this.currentIndex, this.currentIndex + this.count) // todo remove dev item
        this.displayAddresses = this.hardwareAddresses.slice(this.currentIndex, this.currentIndex + this.count)
      } else if ((this.currentIndex + this.count) === this.maxIndex) {
        this.currentIndex = this.currentIndex + this.count
        console.log('2', this.count, this.currentIndex) // todo remove dev item
        this.getAddresses(this.count, this.currentIndex)
          .then(addressSet => {
            this.displayAddresses = addressSet
          })
      } else {
        console.log('3', this.count, this.currentIndex) // todo remove dev item
        this.getAddresses(this.count, this.currentIndex)
          .then(addressSet => {
            this.displayAddresses = addressSet
          })
      }
    },
    getAddresses (count = 5, offset = 0) {
      return new Promise((resolve, reject) => {
        console.log('getAddresses', +count, +offset) // todo remove dev item
        if (offset >= 0 || offset + count > this.maxIndex) {
          this.connectionActive = !this.connectionActive
          const web3 = this.$store.state.web3
          let hardwareAddresses = []
          this.$store.state.wallet.wallet.getMultipleAccounts(+count, +offset)
            .then(_accounts => {
              Object.values(_accounts).forEach(async (address, i) => {
                const rawBalance = await this.$store.state.web3.eth.getBalance(address)
                const balance = unit.fromWei(web3.utils.toBN(rawBalance).toString(), 'ether')
                hardwareAddresses.push({index: +offset + i, address, balance})
                this.hardwareAddresses.push({index: +offset + i, address, balance})
              })
              if (this.maxIndex <= (+offset + count)) {
                this.maxIndex = +offset + count
              }
              if (this.minIndex >= +offset) {
                this.minIndex = +offset
              }
              this.currentIndex = +offset + count
              this.connectionActive = !this.connectionActive
              resolve(hardwareAddresses)
            })
            .catch(console.log)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceAddressModal.scss";

  .activeConn {
    color: gray;
  }
</style>
