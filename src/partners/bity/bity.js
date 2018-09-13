export default class BitySwap {
  constructor() {
    this.SERVERURL = 'https://bity.myetherapi.com';
    this.BITYRATEAPI = 'https://bity.com/api/v1/rate2/';
    this.decimals = 6;
    this.ethExplorer = 'https://etherscan.io/tx/[[txHash]]';
    this.btcExplorer = 'https://blockchain.info/tx/[[txHash]]';
    this.validStatus = ['RCVE', 'FILL', 'CONF', 'EXEC'];
    this.invalidStatus = ['CANC'];
    this.mainPairs = ['REP', 'ETH'];
    this.min = 0.01;
    this.max = 3;
  }

  async getRate() {
    // const rate = await fetch();
  }

  async getRates() {
    const rates = await fetch(BITYRATEAPI, {
      method: 'GET'
    });

    data.forEach(function(pair) {
      if (this.mainPairs.indexOf(pair.pair.substring(3)) !== -1)
        this.curRate[pair.pair] = parseFloat(pair.rate_we_sell);
      else if (this.mainPairs.indexOf(pair.pair.substring(0, 3)) !== -1)
        this.curRate[pair.pair] = parseFloat(pair.rate_we_buy);
      else this.curRate[pair.pair] = parseFloat(pair.rate);
    });
  }

  buildOrder() {}

  submitOrder() {}
}
