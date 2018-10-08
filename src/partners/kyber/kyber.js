import {
  kyberCurrencies,
  kyberAddressFallback,
  kyberNetworkABI
} from './config';

export default class Kyber {
  constructor(props = {}) {
    this.gasLimit = 300000;
    this.maxGasPrice = 30000000000; // 30 Gwei
    this.gasPrice = 2000000000; // 2 Gwei
    this.tokenDetails = props.currencies || kyberCurrencies;
    this.web3 = props.web3;
    this.ens = props.ens;
    this.kyberNetworkABI = {};
    this.kyberNetworkAddress = kyberAddressFallback;
    // eslint-disable-next-line prefer-const
    for (let i in kyberNetworkABI) {
      this.kyberNetworkABI[kyberNetworkABI[i].name] = kyberNetworkABI[i];
    }
    this.getMainNetAddress();
    this.setupKyberContractObject(this.kyberNetworkAddress);
  }

  getMainNetAddress() {
    try {
      this.ens
        .owner('kybernetwork.eth')
        .then(address => {
          this.kyberNetworkAddress = address;
          this.setupKyberContractObject(address);
        })
        .catch(() => {
          console.error('failed to resolve kyber network address via ENS');
        });
    } catch (e) {
      console.error(e);
    }
  }

  setupKyberContractObject(address) {
    this.kyberNetwork = new this.web3.eth.Contract(kyberNetworkABI, address);
  }

  getTokenAddress(_token) {
    return this.tokenDetails[_token].address;
  }

  convertToTokenBase(_value, _token) {
    const decimals = this.tokenDetails[_token].decimals;
    const denominator = this.web3.utils
      .toBN(10)
      .pow(this.web3.utils.toBN(decimals));
    return this.web3.utils
      .toBN(_value)
      .div(denominator)
      .toString(10);
  }

  convertToTokenWei(_value, _token) {
    const decimals = this.tokenDetails[_token].decimals;
    const denominator = this.web3.utils
      .toBN(10)
      .pow(this.web3.utils.toBN(decimals));
    return this.web3.utils
      .toBN(_value)
      .times(denominator)
      .toString(10);
  }

  getKyberNetworkAddress() {
    return this.kyberNetworkAddress;
  }

  // createDataHex(method) {
  //   return this.kyberNetwork.methods.transfer(this.address, amount).encodeABI();
  // }

  findBestRate() {}

  getTradeData(fromToken, toToken, fromValue, minRate, userAddress) {
    const walletId = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'; // TODO move to config
    const maxDestAmount = 2 ** 200; // TODO move to config

    return this.kyberNetwork.methods
      .trade(
        this.getTokenAddress(fromToken),
        this.convertToTokenWei(fromValue, fromToken),
        this.getTokenAddress(toToken),
        userAddress,
        maxDestAmount,
        this.convertToTokenWei(minRate, 'ETH'),
        walletId
      )
      .encodeABI();
  }

  async getBalance(fromToken, userAddress) {
    const balance = await this.kyberNetwork.methods
      .getBalance(this.getTokenAddress(fromToken), userAddress)
      .call();

    return balance[0];
  }

  async getExpectedRate(fromToken, toToken, fromValue) {
    const rates = await this.kyberNetwork.methods
      .getExpectedRate(
        this.getTokenAddress(fromToken),
        this.getTokenAddress(toToken),
        this.convertToTokenWei(fromValue, fromToken)
      )
      .call();
    return rates['expectedRate'];
  }

  async getUserCapInWei(userAddress) {
    const data = await this.kyberNetwork.methods
      .getUserCapInWei(userAddress)
      .call();
    return data[0];
  }

  async checkUserCap(swapValue, userAddress) {
    const weiValue = this.convertToTokenWei(swapValue, 'ETH');
    const userCap = await this.getUserCapInWei(userAddress);
    const numberAsBN = this.web3.toBN(weiValue);
    const nineFivePct = this.web3.toBN(userCap).times(0.95);
    // let nineFivePctUserCap = this.convertToTokenWei(nineFivePct, 'ETH');
    return nineFivePct.gt(numberAsBN);
  }

  kyberNetworkState() {}

  approveKyber(fromValue, fromToken, userAddress) {
    const jsonInterface = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: '_owner',
            type: 'address'
          },
          {
            indexed: true,
            name: '_spender',
            type: 'address'
          },
          {
            indexed: false,
            name: '_value',
            type: 'uint256'
          }
        ],
        name: 'Approval',
        type: 'event'
      }
    ];

    const weiValue = this.convertToTokenWei(fromValue, fromToken);
    const contract = new this.web3.eth.Contract(jsonInterface);
    const data = contract.methods
      .Approval(userAddress, this.getKyberNetworkAddress(), weiValue)
      .encodeABI();

    return {
      value: 0,
      to: this.getTokenAddress(fromToken),
      data: data
    };
  }

  // not a transaction, just a read-only call
  async allowance(fromToken, userAddress) {
    const jsonInterface = [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address'
          },
          {
            name: '_spender',
            type: 'address'
          }
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      }
    ];

    const contract = new this.web3.eth.Contract(jsonInterface);
    const data = await contract.methods
      .allowance(userAddress, this.getKyberNetworkAddress())
      .call();

    return data[0];
  }
}
