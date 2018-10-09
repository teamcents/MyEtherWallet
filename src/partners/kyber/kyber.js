import BigNumber from 'bignumber.js';
import {
  kyberCurrencies,
  kyberAddressFallback,
  kyberNetworkABI,
  ERC20
} from './config';

/**
 * Note: Need to implement checks for these
 * Source amount is too small. Minimum amount is 0.001 ETH equivalent.
 */
export default class Kyber {
  constructor(props = {}) {
    this.gasLimit = 300000;
    this.maxGasPrice = 30000000000; // 30 Gwei
    this.gasPrice = 2000000000; // 2 Gwei
    this.tokenDetails = props.currencies || kyberCurrencies;
    this.web3 = props.web3;
    this.ens = props.ens;
    this.kyberNetworkABI = kyberNetworkABI || [];
    this.kyberNetworkAddress = props.kyberAddress || kyberAddressFallback;
    // eslint-disable-next-line prefer-const
    // for (let i in kyberNetworkABI) {
    //   this.kyberNetworkABI[kyberNetworkABI[i].name] = kyberNetworkABI[i];
    // }
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
    this.kyberNetworkContract = new this.web3.eth.Contract(
      this.kyberNetworkABI,
      address
    );
  }

  getTokenAddress(_token) {
    try {
      return this.tokenDetails[_token].address;
    } catch (e) {
      throw Error('Token not included in kyber network list of tokens');
    }
  }

  convertToTokenBase(token, value) {
    const decimals = this.tokenDetails[token].decimals;
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value).div(denominator).toString(10);
  }

  convertToTokenWei(token, value) {
    const decimals = this.tokenDetails[token].decimals;
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value).times(denominator).toString(10);
  }

  getKyberNetworkAddress() {
    return this.kyberNetworkAddress;
  }

  // createDataHex(method) {
  //   return this.kyberNetwork.methods.transfer(this.address, amount).encodeABI();
  // }

  findBestRate() {}

  async getTradeData(fromToken, toToken, fromValue, minRate, userAddress) {
    const walletId = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'; // TODO move to config
    const maxDestAmount = 2 ** 200; // TODO move to config

    return this.kyberNetworkContract.methods
      .trade(
        await this.getTokenAddress(fromToken),
        await this.convertToTokenWei(fromToken, fromValue),
        await this.getTokenAddress(toToken),
        userAddress,
        1000000000000000, //maxDestAmount,
        minRate,
        walletId
      )
      .encodeABI();
  }

  async getBalance(fromToken, userAddress) {
    return await this.kyberNetworkContract.methods
      .getBalance(this.getTokenAddress(fromToken), userAddress)
      .call();
  }

  async getExpectedRate(fromToken, toToken, fromValue) {
    const rates = await this.kyberNetworkContract.methods
      .getExpectedRate(
        this.getTokenAddress(fromToken),
        this.getTokenAddress(toToken),
        this.convertToTokenWei(fromToken, fromValue)
      )
      .call();
    return rates['expectedRate'];
  }

  async getUserCapInWei(userAddress) {
    return await this.kyberNetworkContract.methods
      .getUserCapInWei(userAddress)
      .call();
  }

  async checkUserCap(swapValue, userAddress) {
    // look at what checks are needed
    const weiValue = this.convertToTokenWei('ETH', swapValue);
    const userCap = await this.getUserCapInWei(userAddress);
    const numberAsBN = new BigNumber(weiValue);
    const nineFivePct = new BigNumber(userCap).times(0.95);
    // let nineFivePctUserCap = this.convertToTokenWei(nineFivePct, 'ETH');
    return nineFivePct.gt(numberAsBN);
  }

  kyberNetworkState() {}

  approveKyber(fromToken, fromValue) {
    const weiValue = this.convertToTokenWei(fromToken, fromValue);
    const contract = new this.web3.eth.Contract(
      ERC20,
      this.getTokenAddress(fromToken)
    );
    return contract.methods
      .approve(this.getKyberNetworkAddress(), weiValue)
      .encodeABI();
    // return {
    //   value: 0,
    //   to: this.getTokenAddress(fromToken),
    //   data: data
    // };
  }

  // not a transaction, just a read-only call
  async allowance(fromToken, userAddress) {
    const contract = new this.web3.eth.Contract(
      ERC20,
      this.getTokenAddress(fromToken)
    );
    return await contract.methods
      .allowance(userAddress, this.getKyberNetworkAddress())
      .call();
  }

  async generateDataForTransactions(
    fromToken,
    toToken,
    fromValue,
    toValue,
    rate,
    userAddress
  ) {
    try {
      const prepareSwapTxData = await this.canUserSwap(
        fromToken,
        toToken,
        fromValue,
        toValue,
        userAddress
      );
      if (Array.isArray(prepareSwapTxData)) {
        const kyberSwap = await this.getTradeData(
          fromToken,
          toToken,
          fromValue,
          rate,
          userAddress
        );

        return prepareSwapTxData.push(kyberSwap);
      }
    } catch (e) {
      console.log(e); // todo remove dev item
      throw e;
    }
  }

  async canUserSwap(fromToken, toToken, fromValue, toValue, userAddress) {
    let userCap = true;
    if (fromToken === 'ETH' || toToken === 'ETH') {
      const checkValue = fromToken === 'ETH' ? fromValue : toValue;
      userCap = await this.checkUserCap(checkValue, userAddress);
    }
    const tokenBalance = await this.getBalance(fromToken, userAddress);
    const userTokenBalance = new BigNumber(tokenBalance);
    const hasEnoughTokens = userTokenBalance.gte(fromValue);

    console.log(userCap); // todo remove dev item
    console.log(hasEnoughTokens); // todo remove dev item
    console.log(userCap && hasEnoughTokens); // todo remove dev item
    if (userCap && hasEnoughTokens) {
      const { approve, reset } = await this.isTokenApprovalNeeded(
        fromToken,
        toToken,
        fromValue,
        userAddress
      );
      if (approve && reset) {
        return [
          this.approveKyber(fromToken, 0, userAddress),
          this.approveKyber(fromToken, fromValue, userAddress)
        ];
      } else if (approve) {
        return [this.approveKyber(fromToken, fromValue, userAddress)];
      }
      return [];
    }
    const reason = !userCap ? 'user cap value' : 'current token balance';
    const errorMessage = `User is not eligible to use kyber network. Current swap value exceeds ${reason}`;
    throw Error(errorMessage);
  }

  async isTokenApprovalNeeded(fromToken, toToken, fromValue, userAddress) {
    if (fromToken === 'ETH') return { approve: false, reset: false };

    const currentAllowance = await this.allowance(fromToken, userAddress);

    if (currentAllowance > 0) {
      const allocationNeeded = this.convertToTokenWei(fromToken, fromValue);
      if (currentAllowance < allocationNeeded) {
        return { approve: true, reset: true };
      }
      return { approve: false, reset: false };
    }
    return { approve: true, reset: false };
  }
}
